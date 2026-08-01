// services/emailService.js
// Todo lo relacionado con el envío de correos sale de aquí:
// verificación, OTP, recuperación de contraseña, login seguro...
const nodemailer = require('nodemailer');
const env = require('../config/env');

// Un solo transporte reutilizable; la conexión con Gmail se abre una vez.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

const emailService = {
    // Envío genérico: cualquier correo pasa por aquí.
    async send({ to, subject, html }) {
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
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #1a73e8;">¡Bienvenido a RetiScan, ${name}!</h2>
                <p>Tu cuenta ha sido creada exitosamente. Confirma tu correo electrónico haciendo clic en el botón de abajo para activarla:</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${link}" style="background-color: #1a73e8; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px;">
                        Verificar mi cuenta
                    </a>
                </div>
                <p style="color: #888; font-size: 13px;">Este link expira en <strong>24 horas</strong>. Si no creaste esta cuenta, ignora este correo.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="color: #aaa; font-size: 12px;">RetiScan – Detección de Retinopatía Diabética con IA</p>
            </div>
        `;
        return this.send({ to, subject: 'Verifica tu cuenta de RetiScan', html });
    },

    // OTP de 6 dígitos para que el paciente verifique su cuenta.
    async sendOtp(to, otp, name) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #1a73e8;">Código de verificación — RetiScan</h2>
                <p>Hola <strong>${name}</strong>, usa el siguiente código para verificar tu cuenta:</p>
                <div style="text-align: center; margin: 32px 0;">
                    <span style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: #1a73e8;">${otp}</span>
                </div>
                <p style="color: #888; font-size: 13px;">Este código expira en <strong>15 minutos</strong>. No lo compartas con nadie.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="color: #aaa; font-size: 12px;">RetiScan – Detección de Retinopatía Diabética con IA</p>
            </div>
        `;
        return this.send({ to, subject: `${otp} es tu código de RetiScan`, html });
    },

    // OTP para recuperación de contraseña.
    async sendPasswordResetOtp(to, otp, name) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #ff3366;">Recuperación de contraseña — RetiScan</h2>
                <p>Hola <strong>${name}</strong>, hemos recibido una solicitud para restablecer tu contraseña. Usa el siguiente código:</p>
                <div style="text-align: center; margin: 32px 0;">
                    <span style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: #ff3366;">${otp}</span>
                </div>
                <p style="color: #888; font-size: 13px;">Este código expira en <strong>15 minutos</strong>. Si tú no lo solicitaste, puedes ignorar este correo de forma segura.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="color: #aaa; font-size: 12px;">RetiScan – Detección de Retinopatía Diabética con IA</p>
            </div>
        `;
        return this.send({ to, subject: `Código de recuperación: ${otp}`, html });
    },

    // OTP del segundo paso de inicio de sesión (MFA).
    async sendLoginOtp(to, otp, name) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #1a73e8;">Inicio de sesión seguro — RetiScan</h2>
                <p>Hola <strong>${name}</strong>, hemos detectado un intento de inicio de sesión. Por favor, ingresa este código para verificar tu identidad:</p>
                <div style="text-align: center; margin: 32px 0;">
                    <span style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: #1a73e8;">${otp}</span>
                </div>
                <p style="color: #888; font-size: 13px;">Este código expira en <strong>15 minutos</strong>. Si tú no intentaste iniciar sesión, te recomendamos cambiar tu contraseña de inmediato.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="color: #aaa; font-size: 12px;">RetiScan – Detección de Retinopatía Diabética con IA</p>
            </div>
        `;
        return this.send({ to, subject: `Verificación de inicio de sesión: ${otp}`, html });
    },
};

module.exports = emailService;
