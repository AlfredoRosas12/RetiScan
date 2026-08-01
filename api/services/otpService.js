// otpService.js
//
// OTP en memoria para el segundo factor (2FA).
// Son códigos de 6 dígitos, válidos 30 segundos y de un solo uso.
//
// Nota: en producción el paso `send` debería ser email/SMS real y
// el `code` no debería viajar en la respuesta de la API.

/** @type {Map<string, { code: string, expiresAt: number }>} */
const otpStore = new Map();

const OTP_TTL_MS = 30_000; // 30 segundos

// Genera un OTP nuevo y lo guarda. Cualquier OTP pendiente del
// mismo usuario queda invalidado.
function generate(userId) {
    otpStore.delete(userId);

    // Nos deshacemos de los que ya caducaron para no acumular basura
    _cleanup();

    const code = String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
    const expiresAt = Date.now() + OTP_TTL_MS;

    otpStore.set(userId, { code, expiresAt });

    return { code, expiresIn: OTP_TTL_MS / 1000 };
}

// Verifica un código. Si es correcto se consume de inmediato.
function verify(userId, code) {
    const entry = otpStore.get(userId);

    if (!entry) {
        return { valid: false, reason: 'No pending OTP for this user. Request a new code.' };
    }

    if (Date.now() > entry.expiresAt) {
        otpStore.delete(userId);
        return { valid: false, reason: 'OTP has expired. Request a new code.' };
    }

    if (entry.code !== String(code)) {
        return { valid: false, reason: 'Invalid OTP code.' };
    }

    // De un solo uso
    otpStore.delete(userId);
    return { valid: true };
}

// Barre el almacén y borra las entradas ya vencidas.
function _cleanup() {
    const now = Date.now();
    for (const [userId, entry] of otpStore.entries()) {
        if (now > entry.expiresAt) otpStore.delete(userId);
    }
}

module.exports = { generate, verify };
