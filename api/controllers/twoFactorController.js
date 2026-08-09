const otpService = require('../services/otpService');

const twoFactorController = {
    // POST /api/auth/2fa/send
    // Genera un OTP de 6 dígitos para el usuario autenticado y lo regresa.
    // La PWA lo muestra en el banner de verificación.
    //
    // ⚠️ En producción habría que enviarlo por email/SMS y NO incluir `code`
    //    en la respuesta. Aquí se regresa para poder probar el flujo completo.
    async sendOtp(req, res, next) {
        try {
            const { code, expiresIn } = otpService.generate(req.user.id);

            return res.status(200).json({
                message: '2FA code generated successfully',
                code,        // ← eliminar en producción
                expiresIn,   // en segundos
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/auth/2fa/verify
    // Body: { code: "123456" }
    // 200 si el código es válido, 400 si no.
    async verifyOtp(req, res, next) {
        try {
            const { code } = req.body;

            if (!code) {
                return res.status(400).json({ error: 'code is required' });
            }

            const result = otpService.verify(req.user.id, code);

            if (!result.valid) {
                return res.status(400).json({ error: result.reason });
            }

            return res.status(200).json({ verified: true });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = twoFactorController;
