const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const userService = {
    // Perfil completo del usuario (sin contraseña), uniendo los datos de su perfil.
    async getProfile(id) {
        const user = await User.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.statusCode = 404;
            throw err;
        }

        // Enriquecimos el perfil con los datos específicos según el rol
        if (user.role === 'MEDICO') {
            const doc = await Doctor.findByUserId(user.id);
            if (doc) {
                user.firstName = doc.first_name;
                user.paternalSurname = doc.paternal_surname;
                user.maternalSurname = doc.maternal_surname;
                user.name = `${doc.first_name} ${doc.paternal_surname}${doc.maternal_surname ? ' ' + doc.maternal_surname : ''}`;
                user.phone = doc.phone;
            }
        } else if (user.role === 'PACIENTE') {
            const pat = await Patient.findByUserId(user.id);
            if (pat) {
                user.firstName = pat.first_name;
                user.paternalSurname = pat.paternal_surname;
                user.maternalSurname = pat.maternal_surname;
                user.name = `${pat.first_name} ${pat.paternal_surname}${pat.maternal_surname ? ' ' + pat.maternal_surname : ''}`;
                user.phone = pat.phone;
                // En pacientes el correo principal vive en la tabla patients
                if (!user.email) user.email = pat.email;
            }
        }

        return user;
    },

    // Actualiza los campos que vienen en `fields` (solo los permitidos en el modelo).
    async update(id, fields) {
        const updated = await User.updateById(id, fields);
        if (!updated) {
            const err = new Error('Usuario no encontrado');
            err.statusCode = 404;
            throw err;
        }
        return updated;
    },

    // Elimina la cuenta de usuario.
    async delete(id) {
        const deleted = await User.deleteById(id);
        if (!deleted) {
            const err = new Error('Usuario no encontrado');
            err.statusCode = 404;
            throw err;
        }
        return deleted;
    },

    // Cambia la contraseña y limpia la bandera must_change_password.
    async changePassword(id, newPassword) {
        const updated = await User.changePassword(id, newPassword);
        if (!updated) {
            const err = new Error('Usuario no encontrado');
            err.statusCode = 404;
            throw err;
        }
        return updated;
    },
};

module.exports = userService;
