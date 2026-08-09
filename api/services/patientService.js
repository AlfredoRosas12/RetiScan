const crypto = require('crypto');
const Patient = require('../models/Patient');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Username en formato nombre.apellido#XXXX.
// Quitamos acentos y caracteres raros para que sirva como login.
function buildPatientUsername(fullName, lastName) {
    const normalize = (str) =>
        (str || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z]/g, '');

    const first = normalize(fullName).slice(0, 10) || 'paciente';
    const last = normalize(lastName).slice(0, 10) || 'retiscan';
    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `${first}.${last}#${suffix}`;
}

const patientService = {
    // Crea el paciente + su cuenta de usuario (PACIENTE) con contraseña temporal.
    // Regresa las tres cosas para que el controller las arme en la respuesta.
    async create(data, doctorId) {
        const { firstName, paternalSurname, maternalSurname } = data;

        if (!firstName || !paternalSurname) {
            const err = new Error('firstName y paternalSurname son requeridos');
            err.statusCode = 400;
            throw err;
        }

        // 1. Generamos un username único; si choca, intentamos de nuevo
        let username;
        let attempts = 0;
        do {
            username = buildPatientUsername(firstName, paternalSurname);
            attempts++;
            if (attempts > 10) {
                const err = new Error('No se pudo generar un username único, intente de nuevo');
                err.statusCode = 500;
                throw err;
            }
        } while (await User.findByUsername(username));

        // 2. Contraseña temporal segura (12 caracteres alfanuméricos)
        const tempPassword = crypto.randomBytes(9).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);

        // 3. Cuenta de usuario (sin email; el paciente lo agrega en su primer login)
        const patientUser = await User.create({
            username,
            email: null,
            plainPassword: tempPassword,
            role: 'PACIENTE',
            mustChangePassword: true,
        });

        // 4. Expediente del paciente (fecha de nacimiento y teléfono los llena él)
        const patient = await Patient.create({
            firstName,
            paternalSurname,
            maternalSurname,
            birthDate: null,
            phone: null,
            doctorId,
            userId: patientUser.id,
        });

        // Auditoría silenciosa del alta
        await AuditLog.log(doctorId, 'CREATE', 'PATIENT', patient.id, {
            firstName,
            paternalSurname,
            maternalSurname
        });

        return { patient, patientUser, tempPassword };
    },


    // Lista de pacientes del médico autenticado (aislamiento multi-tenant).
    async getAll(doctorId, page = 1, limit = 50, search = '') {
        const offset = (page - 1) * limit;
        return Patient.findAllByDoctor(doctorId, limit, offset, search);
    },

    // Paciente por UUID, validando que pertenezca al médico.
    async getById(id, doctorId) {
        const patient = await Patient.findByIdAndDoctor(id, doctorId);
        if (!patient) {
            const err = new Error('Paciente no encontrado');
            err.statusCode = 404;
            throw err;
        }
        return patient;
    },

    // Registro de paciente del usuario autenticado (vista PACIENTE).
    async getMyRecord(userId) {
        const patient = await Patient.findByUserId(userId);
        if (!patient) {
            const err = new Error('No se encontró un registro de paciente para este usuario');
            err.statusCode = 404;
            throw err;
        }
        return patient;
    },

    // El paciente completa su perfil en el primer login.
    // Solo se permiten: birthDate, gender, email, phone.
    async updateMyProfile(userId, fields) {
        const patient = await Patient.findByUserId(userId);
        if (!patient) {
            const err = new Error('Registro de paciente no encontrado');
            err.statusCode = 404;
            throw err;
        }

        // Validamos temprano si el correo ya lo usa otra cuenta
        if (fields.email) {
            if (fields.email.length > 255) {
                const err = new Error('El correo electrónico excede el límite de caracteres permitido.');
                err.statusCode = 400;
                throw err;
            }
            const existingUser = await User.findByEmail(fields.email);
            if (existingUser && existingUser.id !== userId) {
                const err = new Error('Este correo electrónico ya está registrado por otro usuario. Por favor, utiliza uno diferente.');
                err.statusCode = 409;
                throw err;
            }
        }

        const updated = await Patient.updateByIdAndDoctor(patient.id, patient.doctor_id, {
            birthDate: fields.birthDate,
            gender: fields.gender,
            email: fields.email,
            phone: fields.phone,
        });

        // El correo también debe quedar en la cuenta principal del usuario
        if (fields.email) {
            await User.updateById(userId, { email: fields.email });
        }

        if (!updated) {
            const err = new Error('No se pudo actualizar el perfil');
            err.statusCode = 500;
            throw err;
        }

        return updated;
    },

    // Actualiza datos del paciente (con validación de propiedad).
    async update(id, doctorId, fields) {
        // Verificar que exista y que sea de este médico
        await patientService.getById(id, doctorId);
        const updated = await Patient.updateByIdAndDoctor(id, doctorId, fields);
        if (!updated) {
            const err = new Error('Paciente no encontrado o sin cambios');
            err.statusCode = 404;
            throw err;
        }

        await AuditLog.log(doctorId, 'UPDATE', 'PATIENT', id, fields);

        return updated;
    },

    // Elimina un paciente (solo si pertenece al médico). Cascada en análisis y logs en BD.
    async delete(id, doctorId) {
        const deleted = await Patient.deleteByIdAndDoctor(id, doctorId);
        if (!deleted) {
            const err = new Error('Paciente no encontrado');
            err.statusCode = 404;
            throw err;
        }

        await AuditLog.log(doctorId, 'SOFT_DELETE', 'PATIENT', id);

        return deleted;
    },
};

module.exports = patientService;
