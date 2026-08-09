const pool = require('../config/database');
const crypto = require('crypto');

const AI_Processing_Log = {
    // Registro del arranque del procesamiento de IA. task_id es la PK
    // (ej. "task_<uuid>") y el estado arranca en PROCESSING.
    async create(analysisId) {
        const taskId = `task_${crypto.randomUUID()}`;
        const result = await pool.query(
            `INSERT INTO ai_processing_logs (task_id, analysis_id, start_time, status)
       VALUES ($1, $2, NOW(), 'PROCESSING')
       RETURNING *`,
            [taskId, analysisId]
        );
        return result.rows[0];
    },

    // Cierra el registro: fija end_time y el estado final (COMPLETED/FAILED).
    async complete(taskId, status = 'COMPLETED') {
        const result = await pool.query(
            `UPDATE ai_processing_logs
       SET end_time = NOW(),
           status   = $1
       WHERE task_id = $2
       RETURNING *`,
            [status, taskId]
        );
        return result.rows[0] || null;
    },

    // Todo el historial de procesamiento de un análisis.
    async findByAnalysisId(analysisId) {
        const result = await pool.query(
            `SELECT * FROM ai_processing_logs
       WHERE analysis_id = $1
       ORDER BY start_time DESC`,
            [analysisId]
        );
        return result.rows;
    },

    // Una sola entrada por task_id.
    async findById(taskId) {
        const result = await pool.query(
            'SELECT * FROM ai_processing_logs WHERE task_id = $1',
            [taskId]
        );
        return result.rows[0] || null;
    },

    // Borrado permanente de una entrada.
    async deleteById(taskId) {
        const result = await pool.query(
            'DELETE FROM ai_processing_logs WHERE task_id = $1 RETURNING task_id',
            [taskId]
        );
        return result.rows[0] || null;
    },
};

module.exports = AI_Processing_Log;
