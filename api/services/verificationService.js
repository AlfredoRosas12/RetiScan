// services/verificationService.js
// Orquesta los dos flujos de verificación:
//  - Médicos: link por correo (token en la URL)
//  - Pacientes: OTP de 6 dígitos
const User = require('../models/User');
const Patient = require('../models/Patient');
const Verification = require('../models/Verification');
const emailService = require('./emailService');

const verificationService = {
    // MÉDICO: genera el token del link y lo manda al correo.
    // Se llama justo después del registro.
    async sendDoctorVerificationEmail(userId) {
        const user = await User.findById(userId);
        if (!user) throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404 });
        if (!user.email) throw Object.assign(new Error('El usuario no tiene email'), { statusCode: 400 });
        if (user.is_verified) throw Object.assign(new Error('La cuenta ya está verificada'), { statusCode: 409 });

        const verification = await Verification.createEmailLink(userId);
        await emailService.sendVerificationLink(user.email, verification.token, user.name);
        return { message: 'Correo de verificación enviado' };
    },

    // MÉDICO: valida el token del link y activa la cuenta + 30 días de prueba.
    async verifyEmailLink(token) {
        if (!token) throw Object.assign(new Error('Token requerido'), { statusCode: 400 });

        const record = await Verification.findValidEmailLink(token);
        if (!record) {
            throw Object.assign(new Error('Token inválido o expirado'), { statusCode: 400 });
        }

        // Cuenta verificada y suscripción de prueba por 30 días
        const trialEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await User.updateById(record.user_id, {
            is_verified: true,
            subscription_end_date: trialEnd,
        });

        // El token no sirve dos veces
        await Verification.markUsed(record.id);

        return { message: 'Tu cuenta ha sido activada exitosamente. Ya puedes acceder a la infraestructura completa de RetiScan.' };
    },

    // PACIENTE: genera el OTP y lo envía al correo que él mismo puso en su perfil.
    async sendPatientOtp(userId, email, type = 'OTP_EMAIL') {
        const user = await User.findById(userId);
        if (!user) throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404 });

        // Validamos temprano que el correo no lo esté usando otra cuenta
        if (email) {
            if (email.length > 255) {
                throw Object.assign(
                    new Error('El correo electrónico excede el límite de caracteres permitido.'),
                    { statusCode: 400 }
                );
            }
            const existingUser = await User.findByEmail(email);
            if (existingUser && existingUser.id !== userId) {
                throw Object.assign(
                    new Error('Este correo electrónico ya está registrado por otro usuario. Por favor, utiliza uno diferente.'),
                    { statusCode: 409 }
                );
            }
        }

        const verification = await Verification.createOtp(userId, type);

        // Para armar el saludo usamos el nombre del paciente si existe
        let profileName = user.username;
        const patient = await Patient.findByUserId(userId);
        if (patient) {
            profileName = `${patient.first_name} ${patient.paternal_surname}${patient.maternal_surname ? ' ' + patient.maternal_surname : ''}`;
        }

        // El SMS es simulado: en ambos casos el código llega por correo
        await emailService.sendOtp(email, verification.token, profileName);

        const response = { message: `Código OTP enviado al correo ${email}` };
        // En desarrollo devolvemos el OTP para facilitar las pruebas
        if (process.env.NODE_ENV === 'development') {
            response._dev_otp = verification.token;
        }
        return response;
    },

    // PACIENTE: valida el OTP y activa la cuenta.
    async verifyPatientOtp(userId, otp, type = 'OTP_EMAIL') {
        if (!otp) throw Object.assign(new Error('OTP requerido'), { statusCode: 400 });

        // Revisamos si la cuenta está en lockout por intentos fallidos
        const user = await User.findById(userId);
        if (user && user.locked_until && new Date(user.locked_until) > new Date()) {
            const diff = Math.ceil((new Date(user.locked_until) - new Date()) / 1000 / 60);
            throw Object.assign(new Error(`Demasiados intentos. Tu cuenta está bloqueada por ${diff} minutos.`), { statusCode: 429 });
        }

        const record = await Verification.findValidOtp(userId, otp, type);
        if (!record) {
            const updated = await User.incrementFailedAttempts(userId);
            if (updated.locked_until && new Date(updated.locked_until) > new Date()) {
                throw Object.assign(new Error('Has excedido el límite de intentos. Cuenta bloqueada por 5 minutos.'), { statusCode: 429 });
            }
            const remaining = 5 - updated.failed_attempts;
            throw Object.assign(new Error(`Código inválido o expirado. Intentos restantes: ${remaining}`), { statusCode: 400 });
        }

        // Todo bien: reseteamos intentos, activamos la cuenta y quemamos el OTP
        await User.resetFailedAttempts(userId);
        await User.updateById(userId, { is_verified: true });
        await Verification.markUsed(record.id);

        return { message: 'Cuenta verificada exitosamente' };
    },
};

module.exports = verificationService;
