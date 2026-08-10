const {
    S3Client,
    HeadBucketCommand,
    CreateBucketCommand,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const endpoint = process.env.S3_ENDPOINT || 'http://minio:9000';
const publicEndpoint = process.env.S3_PUBLIC_ENDPOINT || process.env.APP_URL || 'http://localhost:9000';

// Cloudflare R2 requiere region 'auto' para firmar peticiones S3 (SigV4) correctamente
const isR2 = endpoint.includes('r2.cloudflarestorage.com') || (process.env.S3_PUBLIC_ENDPOINT || '').includes('r2.dev');
const region = isR2 ? 'auto' : (process.env.S3_REGION || 'us-east-1');
const bucketName = process.env.S3_BUCKET || 'retina-images';

// En producción, las credenciales S3 son obligatorias
if (process.env.NODE_ENV === 'production') {
    if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
        throw new Error('S3_ACCESS_KEY and S3_SECRET_KEY are required in production');
    }
}
const accessKeyId = process.env.S3_ACCESS_KEY || 'retiscan';
const secretAccessKey = process.env.S3_SECRET_KEY || 'retiscan123';

// Cliente interno: apunta a Cloudflare R2 / MinIO dentro de la red.
const s3Client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    ...(isR2 ? {
        requestChecksumCalculation: "WHEN_REQUIRED",
        responseChecksumValidation: "WHEN_REQUIRED"
    } : {
        forcePathStyle: true
    })
});

// Cliente público: lo usamos para firmar URLs que ve el navegador.
const s3PublicClient = new S3Client({
    endpoint: publicEndpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    ...(isR2 ? {
        requestChecksumCalculation: "WHEN_REQUIRED",
        responseChecksumValidation: "WHEN_REQUIRED"
    } : {
        forcePathStyle: true
    })
});

let bucketInitialized = false;

// MinIO no crea buckets solos; verificamos que exista o lo creamos.
async function ensureBucketExists() {
    if (bucketInitialized) return;
    try {
        await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
        bucketInitialized = true;
    } catch (err) {
        if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
            try {
                await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
                console.log(`[Storage] Bucket '${bucketName}' creado.`);
            } catch (createErr) {
                console.error(`[Storage] Error creando bucket:`, createErr.message);
            }
        } else {
            console.warn(`[Storage] No se pudo verificar bucket '${bucketName}' (${err.message}). Continuando con operaciones S3.`);
        }
        bucketInitialized = true;
    }
}

ensureBucketExists().catch(() => {});

const storageService = {
    bucketName,

    // Sube la imagen y devuelve la llave con la que quedó guardada.
    async uploadImage(buffer, filename, mimeType = 'image/jpeg') {
        await ensureBucketExists();
        const key = filename.startsWith('retina-') ? filename : `retina-${filename}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: mimeType
        });

        await s3Client.send(command);
        return key;
    },

    // Regresa la imagen como stream para reenviarla al servicio de IA.
    async getImageStream(key) {
        await ensureBucketExists();

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key
        });

        const response = await s3Client.send(command);
        return response.Body;
    },

    // URL firmada (1 hora por defecto) para mostrar la imagen en el navegador.
    async getPresignedUrl(key, expiresInSeconds = 3600) {
        if (!key) return null;
        if (key.startsWith('http')) return key;

        await ensureBucketExists();

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key
        });

        return getSignedUrl(s3PublicClient, command, { expiresIn: expiresInSeconds });
    },

    async deleteImage(key) {
        if (!key) return;
        await ensureBucketExists();

        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key
        });

        await s3Client.send(command);
    }
};

module.exports = storageService;
