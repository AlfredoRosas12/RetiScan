const verificationService = require('../services/verificationService');

const verificationController = {
    // GET /api/auth/verify-email?token=...
    // El médico hace clic en el link del correo. Activa la cuenta y 30 días de trial.
    // No requiere JWT porque es el primer acceso tras el registro.
    async verifyEmail(req, res, next) {
        try {
            const { token } = req.query;
            const result = await verificationService.verifyEmailLink(token);
            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    },

    // POST /api/auth/send-otp
    // El paciente pide que le manden un OTP a su correo.
    // Body: { email, type: 'OTP_EMAIL' } — requiere JWT (ya inició sesión).
    async sendOtp(req, res, next) {
        try {
            const { email, type } = req.body;
            if (!email) {
                return res.status(400).json({ error: 'El campo email es requerido' });
            }
            const result = await verificationService.sendPatientOtp(
                req.user.id,
                email,
                type || 'OTP_EMAIL'
            );
            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    },

    // POST /api/auth/verify-otp
    // El paciente ingresa el código que recibió por correo.
    // Body: { otp, type: 'OTP_EMAIL' } — requiere JWT.
    async verifyOtp(req, res, next) {
        try {
            const { otp, type } = req.body;
            if (!otp) {
                return res.status(400).json({ error: 'El campo otp es requerido' });
            }
            const result = await verificationService.verifyPatientOtp(
                req.user.id,
                otp,
                type || 'OTP_EMAIL'
            );
            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = verificationController;
