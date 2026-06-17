/**
 * errorMiddleware.js
 *
 * Manejador global de errores de Express. Debe registrarse al FINAL en app.js
 * (después de todas las rutas) y debe tener exactamente 4 parámetros.
 *
 * Los servicios lanzan Errores con una propiedad opcional .statusCode.
 * Este middleware lee ese código para que los controladores no tengan que hacerlo.
 */

// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
    const isDev = process.env.NODE_ENV === 'development';

    console.error(`[Error] ${req.method} ${req.path} — ${err.message}`);

    // ── Interceptor de Errores de PostgreSQL ──────────────────────────
    // Los errores de PG tienen un campo `code` numérico como string.
    // Mapeamos los más comunes a mensajes humanos y profesionales.
    if (err.code && typeof err.code === 'string' && err.code.length === 5) {
        const pgMessage = mapPostgresError(err);
        if (pgMessage) {
            return res.status(pgMessage.status).json({
                error: pgMessage.message,
                ...(isDev && { detail: err.detail, constraint: err.constraint }),
            });
        }
    }

    // ── Errores de la Aplicación (con statusCode) ─────────────────────
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        error: err.message || 'Ocurrió un error interno. Intenta de nuevo más tarde.',
        ...(isDev && { stack: err.stack }),
    });
}

/**
 * Traduce códigos de error de PostgreSQL a mensajes amigables en español.
 * @param {Error} err - Error con propiedades `code`, `constraint`, `detail`
 * @returns {{ status: number, message: string } | null}
 */
function mapPostgresError(err) {
    switch (err.code) {
        // ── 23505: Unique Violation ───────────────────────────────────
        case '23505': {
            const constraint = (err.constraint || '').toLowerCase();

            if (constraint.includes('email')) {
                return {
                    status: 409,
                    message: 'Este correo electrónico ya está registrado por otro usuario. Por favor, utiliza uno diferente.',
                };
            }
            if (constraint.includes('username')) {
                return {
                    status: 409,
                    message: 'El nombre de usuario ya existe. Intenta con otro.',
                };
            }
            if (constraint.includes('license')) {
                return {
                    status: 409,
                    message: 'Esta cédula profesional ya está registrada.',
                };
            }
            // Genérico para cualquier otro campo único
            return {
                status: 409,
                message: 'Uno de los datos ingresados ya está en uso por otro usuario.',
            };
        }

        // ── 22001: String Data Right Truncation ──────────────────────
        case '22001':
            return {
                status: 400,
                message: 'Uno de los campos excede el límite de caracteres permitido.',
            };

        // ── 23503: Foreign Key Violation ──────────────────────────────
        case '23503':
            return {
                status: 400,
                message: 'La referencia a un registro relacionado no es válida.',
            };

        // ── 23502: Not Null Violation ─────────────────────────────────
        case '23502':
            return {
                status: 400,
                message: 'Falta un campo obligatorio. Verifica que todos los datos estén completos.',
            };

        default:
            return null;
    }
}

module.exports = errorMiddleware;
