/**
 * config/env.js
 *
 * Aquí vive TODO lo que tiene que ver con variables de entorno.
 * Se carga una sola vez desde app.js y el resto de módulos lo importan
 * desde acá en vez de andar leyendo process.env por todos lados.
 */
require('dotenv').config();

// En producción es mejor fallar de inmediato si falta algo crítico,
// que darnos cuenta a mitad del camino con la app "funcionando".
const REQUIRED_IN_PROD = ['JWT_SECRET', 'DB_PASSWORD'];
if (process.env.NODE_ENV === 'production') {
    for (const key of REQUIRED_IN_PROD) {
        if (!process.env[key]) {
            throw new Error(`❌ Missing required environment variable: ${key}`);
        }
    }
}

const env = {
    // Servidor
    PORT: parseInt(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // PostgreSQL
    DB_USER: process.env.DB_USER || 'postgres',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_NAME: process.env.DB_NAME || 'retiscan_prueba',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_PORT: parseInt(process.env.DB_PORT) || 5432,

    // JWT (acceso + refresh)
    JWT_SECRET: process.env.JWT_SECRET || 'retiscan_default_secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    REFRESH_TOKEN_EXPIRES_DAYS: parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7,

    // Bcrypt (rondas para el hash de contraseñas)
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,

    // SMTP de Gmail para el envío de correos
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    SMTP_FROM: process.env.SMTP_FROM || 'RetiScan <no-reply@retiscan.com>',

    // URLs de las apps para armar links en correos
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    LANDING_URL: process.env.LANDING_URL || 'http://localhost:5174',
    PWA_URL: process.env.PWA_URL || 'http://localhost:5174',
    API_URL: process.env.API_URL || 'http://localhost:3000',
    STORAGE_URL: process.env.STORAGE_URL || 'http://localhost:9000',

    // Dominio para cookies / CORS
    DOMAIN: process.env.DOMAIN || 'localhost',

    // Logo para emails (Cloudinary)
    LOGO_URL: process.env.LOGO_URL || '',
};

module.exports = env;
