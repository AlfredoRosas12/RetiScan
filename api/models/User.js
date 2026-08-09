const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const env = require('../config/env');

const User = {
    // Crea un usuario nuevo, hasheando la contraseña antes de guardarla.
    async create({ username, email, plainPassword, role, mustChangePassword = false, subscriptionEndDate = null }) {
        const passwordHash = await bcrypt.hash(plainPassword, env.BCRYPT_SALT_ROUNDS);
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, role, must_change_password, subscription_end_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, role, must_change_password, is_verified, subscription_end_date, created_at`,
            [username, email || null, passwordHash, role, mustChangePassword, subscriptionEndDate]
        );
        return result.rows[0];
    },

    // Por email; incluimos password_hash y los campos de intentos para el auth.
    async findByEmail(email) {
        const result = await pool.query(
            'SELECT *, failed_attempts, locked_until FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    },

    // Por username; misma lógica que findByEmail.
    async findByUsername(username) {
        const result = await pool.query(
            'SELECT *, failed_attempts, locked_until FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0] || null;
    },

    // Por UUID; aquí NO regresamos el hash para no exponerlo.
    async findById(id) {
        const result = await pool.query(
            'SELECT id, username, email, role, must_change_password, is_verified, subscription_end_date, failed_attempts, locked_until, created_at, updated_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    },

    // Actualiza solo los campos que se envíen (email, role, verificación,
    // suscripción o contraseña). La contraseña siempre se hashea de nuevo.
    async updateById(id, fields) {
        const setClauses = [];
        const values = [];
        let idx = 1;

        if (fields.email !== undefined) { setClauses.push(`email = $${idx++}`); values.push(fields.email); }
        if (fields.role) { setClauses.push(`role = $${idx++}`); values.push(fields.role); }
        if (fields.is_verified !== undefined) { setClauses.push(`is_verified = $${idx++}`); values.push(fields.is_verified); }
        if (fields.subscription_end_date !== undefined) { setClauses.push(`subscription_end_date = $${idx++}`); values.push(fields.subscription_end_date); }
        if (fields.password) {
            const hash = await bcrypt.hash(fields.password, env.BCRYPT_SALT_ROUNDS);
            setClauses.push(`password_hash = $${idx++}`);
            values.push(hash);
        }

        if (!setClauses.length) return null;

        setClauses.push(`updated_at = NOW()`);
        values.push(id);

        const result = await pool.query(
            `UPDATE users SET ${setClauses.join(', ')}
       WHERE id = $${idx}
       RETURNING id, username, email, role, must_change_password, is_verified, subscription_end_date, updated_at`,
            values
        );
        return result.rows[0] || null;
    },

    // Cambia la contraseña y de paso limpia la bandera de "debes cambiarla".
    async changePassword(id, newPlainPassword) {
        const hash = await bcrypt.hash(newPlainPassword, env.BCRYPT_SALT_ROUNDS);
        const result = await pool.query(
            `UPDATE users
             SET password_hash = $1, must_change_password = FALSE, updated_at = NOW()
             WHERE id = $2
             RETURNING id, username, email, role, must_change_password, updated_at`,
            [hash, id]
        );
        return result.rows[0] || null;
    },

    // Elimina un usuario permanentemente.
    async deleteById(id) {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0] || null;
    },

    // Compara contraseña en texto plano contra el hash guardado.
    async comparePassword(plainPassword, hash) {
        return bcrypt.compare(plainPassword, hash);
    },

    // Sube el contador de intentos fallidos. Al llegar a 5, bloquea 5 minutos.
    async incrementFailedAttempts(userId) {
        const result = await pool.query(
            `UPDATE users 
             SET failed_attempts = failed_attempts + 1,
                 locked_until = CASE WHEN failed_attempts + 1 >= 5 THEN NOW() + INTERVAL '5 minutes' ELSE locked_until END
             WHERE id = $1
             RETURNING failed_attempts, locked_until`,
            [userId]
        );
        return result.rows[0];
    },

    // Devuelve el contador a cero tras un login exitoso.
    async resetFailedAttempts(userId) {
        await pool.query(
            'UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = $1',
            [userId]
        );
    },
};

module.exports = User;
