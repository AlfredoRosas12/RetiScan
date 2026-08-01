const pool = require('../config/database');

const Analysis = {
    // Crea un análisis nuevo siempre en estado PENDING.
    // Si no llega imagen, dejamos un placeholder local.
    async create(patientId, doctorId, eye, imageUri, doctorNotes = null) {
        const uri = imageUri || `retiscan://pending/${require('crypto').randomUUID()}`;
        const result = await pool.query(
            `INSERT INTO analyses (patient_id, doctor_id, eye, image_uri, doctor_notes, status, ai_result)
       VALUES ($1, $2, $3, $4, $5, 'PENDING', NULL)
       RETURNING *`,
            [patientId, doctorId, eye, uri, doctorNotes]
        );
        return result.rows[0];
    },

    // Todos los análisis de un médico (aislamiento multi-tenant).
    async findAllByDoctor(doctorId) {
        const result = await pool.query(
            'SELECT * FROM analyses WHERE doctor_id = $1 ORDER BY created_at DESC',
            [doctorId]
        );
        return result.rows;
    },

    // Análisis de un paciente, verificando propiedad del médico.
    async findByPatientAndDoctor(patientId, doctorId) {
        const result = await pool.query(
            'SELECT * FROM analyses WHERE patient_id = $1 AND doctor_id = $2 ORDER BY created_at DESC',
            [patientId, doctorId]
        );
        return result.rows;
    },

    // Un análisis por UUID, solo si pertenece al médico.
    async findByIdAndDoctor(id, doctorId) {
        const result = await pool.query(
            'SELECT * FROM analyses WHERE id = $1 AND doctor_id = $2',
            [id, doctorId]
        );
        return result.rows[0] || null;
    },

    // Variante para pacientes: sus análisis sin restricción de doctor.
    async findByPatientId(patientId) {
        const result = await pool.query(
            'SELECT * FROM analyses WHERE patient_id = $1 ORDER BY created_at DESC',
            [patientId]
        );
        return result.rows;
    },

    // Búsqueda por UUID, uso interno del worker de IA.
    async findById(id) {
        const result = await pool.query(
            'SELECT * FROM analyses WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    },

    // Actualiza el estado y, opcionalmente, el resultado del modelo de IA.
    async updateStatus(id, status, aiResult = null) {
        const result = await pool.query(
            `UPDATE analyses
       SET status     = $1,
           ai_result  = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
            [status, aiResult ? JSON.stringify(aiResult) : null, id]
        );
        return result.rows[0] || null;
    },

    // Borrado permanente (sus registros caen en cascada). Solo si es del médico.
    async deleteByIdAndDoctor(id, doctorId) {
        const result = await pool.query(
            'DELETE FROM analyses WHERE id = $1 AND doctor_id = $2 RETURNING id',
            [id, doctorId]
        );
        return result.rows[0] || null;
    },

    // Actualiza las notas médicas de un análisis.
    async updateNotes(id, doctorId, notes) {
        const result = await pool.query(
            `UPDATE analyses 
             SET doctor_notes = $1, updated_at = NOW() 
             WHERE id = $2 AND doctor_id = $3 
             RETURNING *`,
            [notes, id, doctorId]
        );
        return result.rows[0] || null;
    },
};

module.exports = Analysis;
