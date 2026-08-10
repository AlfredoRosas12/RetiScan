// services/emailService.js
// Todo lo relacionado con el envío de correos sale de aquí:
// verificación, OTP, recuperación de contraseña, login seguro...
const nodemailer = require('nodemailer');
const mjml = require('mjml');
const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true para puerto 465, false para otros puertos
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false // Evita bloqueos por certificados en proxies de la nube
    }
});

// Directorio de templates MJML
const TEMPLATES_DIR = path.join(__dirname, '../templates');

// Compilar template MJML y reemplazar variables
function compileTemplate(templateName, variables = {}) {
    const templatePath = path.join(TEMPLATES_DIR, templateName);
    const template = fs.readFileSync(templatePath, 'utf8');
    const { html } = mjml(template, { minify: true });

    // Reemplazar variables {{variable}} en el HTML
    let result = html;
    for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
}

const emailService = {
    // Envío genérico: cualquier correo pasa por aquí.
    async send({ to, subject, html }) {
        if (process.env.RESEND_API_KEY) {
            // En producción en Railway, usamos la API HTTPS de Resend para saltar el bloqueo de puertos
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'RetiScan <no-reply@retiscan.online>', // Dominio verificado en Resend
                    to: [to],
                    subject,
                    html
                })
            });

            const resData = await response.json();
            if (!response.ok) {
                throw new Error(`Resend API Error: ${JSON.stringify(resData)}`);
            }
            return resData;
        }

        // Fallback local: usar SMTP/Nodemailer normal
        return transporter.sendMail({
            from: env.SMTP_FROM,
            to,
            subject,
            html,
        });
    },

    // Link de verificación que llega al médico justo después de registrarse.
    async sendVerificationLink(to, token, name) {
        const link = `${env.LANDING_URL}/?verify=${token}`;
        const html = compileTemplate('verification-email.mjml', { name, link, logoUrl: env.LOGO_URL });
        return this.send({ to, subject: 'Verifica tu cuenta de RetiScan', html });
    },

    // OTP de 6 dígitos para que el paciente verifique su cuenta.
    async sendOtp(to, otp, name) {
        const html = compileTemplate('patient-otp.mjml', { otp, name, logoUrl: env.LOGO_URL });
        return this.send({ to, subject: 'Código de verificación - RetiScan', html });
    },

    // OTP para recuperación de contraseña.
    async sendPasswordResetOtp(to, otp, name) {
        const html = compileTemplate('password-reset-otp.mjml', { otp, name, logoUrl: env.LOGO_URL });
        return this.send({ to, subject: 'Recuperación de contraseña - RetiScan', html });
    },

    // OTP del segundo paso de inicio de sesión (MFA).
    async sendLoginOtp(to, otp, name) {
        const html = compileTemplate('login-otp.mjml', { otp, name, logoUrl: env.LOGO_URL });
        return this.send({ to, subject: 'Verificación de inicio de sesión - RetiScan', html });
    },
};

module.exports = emailService;
