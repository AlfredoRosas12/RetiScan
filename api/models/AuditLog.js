const pool = require('../config/database');

const AuditLog = {
    // Registra una acción en la tabla de auditoría. Si falla el INSERT,
    // no detenemos el flujo principal: solo avisamos y regresamos null.
    async log(userId, action, entity, entityId, details = {}) {
        try {
            const result = await pool.query(
                `INSERT INTO audit_logs (user_id, action, entity, entity_id, details)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [userId, action, entity, entityId, details]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error al guardar el log de auditoría:', error);
            return null;
        }
    }
};

module.exports = AuditLog;
