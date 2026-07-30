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
const region = process.env.S3_REGION || 'us-east-1';
const accessKeyId = process.env.S3_ACCESS_KEY || 'retiscan';
const secretAccessKey = process.env.S3_SECRET_KEY || 'retiscan123';
const bucketName = process.env.S3_BUCKET || 'retina-images';

const s3Client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true
});

const s3PublicClient = new S3Client({
    endpoint: publicEndpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true
});

let bucketInitialized = false;

async function ensureBucketExists() {
    if (bucketInitialized) return;
    try {
        await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
        bucketInitialized = true;
    } catch (err) {
        if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
            try {
                await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
                bucketInitialized = true;
                console.log(`[Storage] Bucket '${bucketName}' creado.`);
            } catch (createErr) {
                console.error(`[Storage] Error creando bucket:`, createErr.message);
            }
        }
    }
}

ensureBucketExists().catch(() => {});

const storageService = {
    bucketName,

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

    async getImageStream(key) {
        await ensureBucketExists();

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key
        });

        const response = await s3Client.send(command);
        return response.Body;
    },

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
