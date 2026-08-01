const pool = require('../config/database');

const Patient = {
    // Crea un paciente. El doctor_id indica a qué médico pertenece.
    async create({ firstName, paternalSurname, maternalSurname, birthDate, phone, doctorId, userId = null }) {
        const result = await pool.query(
            `INSERT INTO patients (first_name, paternal_surname, maternal_surname, birth_date, phone, doctor_id, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [firstName, paternalSurname, maternalSurname || null, birthDate, phone || null, doctorId, userId]
        );
        return result.rows[0];
    },

    // Vincula una cuenta de app (user_id) al registro del paciente.
    async linkUser(patientId, userId) {
        const result = await pool.query(
            `UPDATE patients SET user_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [userId, patientId]
        );
        return result.rows[0] || null;
    },

    // Pacientes activos de un médico, con paginación y búsqueda por nombre/email.
    async findAllByDoctor(doctorId, limit = 50, offset = 0, search = '') {
        let baseQuery = 'SELECT * FROM patients WHERE doctor_id = $1 AND is_active = true';
        let countQuery = 'SELECT COUNT(*) FROM patients WHERE doctor_id = $1 AND is_active = true';

        const values = [doctorId];
        let paramIdx = 2;

        if (search) {
            const searchClause = ` AND (first_name ILIKE $${paramIdx} OR paternal_surname ILIKE $${paramIdx} OR maternal_surname ILIKE $${paramIdx} OR email ILIKE $${paramIdx})`;
            baseQuery += searchClause;
            countQuery += searchClause;
            values.push(`%${search}%`);
            paramIdx++;
        }

        baseQuery += ` ORDER BY created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
        const dataValues = [...values, limit, offset];

        // Corremos la consulta de datos y la de conteo en paralelo
        const [dataResult, countResult] = await Promise.all([
            pool.query(baseQuery, dataValues),
            pool.query(countQuery, values)
        ]);

        return {
            data: dataResult.rows,
            total: parseInt(countResult.rows[0].count, 10),
            page: Math.floor(offset / limit) + 1,
            limit
        };
    },

    // Paciente por UUID, solo si pertenece al médico y sigue activo.
    async findByIdAndDoctor(id, doctorId) {
        const result = await pool.query(
            'SELECT * FROM patients WHERE id = $1 AND doctor_id = $2 AND is_active = true',
            [id, doctorId]
        );
        return result.rows[0] || null;
    },

    // Paciente vinculado a un user_id (cuenta de la app).
    async findByUserId(userId) {
        const result = await pool.query(
            'SELECT * FROM patients WHERE user_id = $1 AND is_active = true',
            [userId]
        );
        return result.rows[0] || null;
    },

    // Actualiza solo los campos enviados, validando propiedad del médico.
    async updateByIdAndDoctor(id, doctorId, fields) {
        const map = {
            firstName: 'first_name',
            paternalSurname: 'paternal_surname',
            maternalSurname: 'maternal_surname',
            birthDate: 'birth_date',
            gender: 'gender',
            email: 'email',
            phone: 'phone',
            lastVisit: 'last_visit',
            totalAnalyses: 'total_analyses',
            healthStatus: 'health_status',
        };

        const setClauses = [];
        const values = [];
        let idx = 1;

        for (const [key, col] of Object.entries(map)) {
            if (fields[key] !== undefined) {
                setClauses.push(`${col} = $${idx++}`);
                values.push(fields[key]);
            }
        }

        if (!setClauses.length) return null;

        setClauses.push(`updated_at = NOW()`);
        values.push(id, doctorId);

        const result = await pool.query(
            `UPDATE patients SET ${setClauses.join(', ')}
       WHERE id = $${idx} AND doctor_id = $${idx + 1}
       RETURNING *`,
            values
        );
        return result.rows[0] || null;
    },

    // Cada análisis nuevo incrementa el contador y refresca la última visita.
    async incrementAnalyses(id) {
        const result = await pool.query(
            `UPDATE patients
       SET total_analyses = total_analyses + 1,
           last_visit     = NOW(),
           updated_at     = NOW()
       WHERE id = $1
       RETURNING *`,
            [id]
        );
        return result.rows[0] || null;
    },

    // Soft delete: ocultamos al paciente en lugar de borrarlo.
    async deleteByIdAndDoctor(id, doctorId) {
        const result = await pool.query(
            'UPDATE patients SET is_active = false, updated_at = NOW() WHERE id = $1 AND doctor_id = $2 RETURNING id',
            [id, doctorId]
        );
        return result.rows[0] || null;
    },

    // Traduce el grade del modelo de IA a un estado legible para el paciente.
    async updateHealthStatusFromAI(patientId, aiGrade) {
        const gradeMap = {
            'No_DR': 'Normal',
            'Mild': 'Leve',
            'Moderate': 'Moderado',
            'Severe': 'Severo',
            'Proliferate_DR': 'Severo',
        };
        const healthStatus = gradeMap[aiGrade] || 'Normal';
        const result = await pool.query(
            `UPDATE patients SET health_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [healthStatus, patientId]
        );
        return result.rows[0] || null;
    },
};

module.exports = Patient;
