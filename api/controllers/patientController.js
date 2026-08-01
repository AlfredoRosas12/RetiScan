const patientService = require('../services/patientService');

const patientController = {
    // POST /api/patients
    // Crea el paciente y su cuenta de usuario (PACIENTE) con contraseña temporal.
    // Requiere rol MEDICO.
    async createPatient(req, res, next) {
        try {
            const doctorId = req.user.id;
            const { firstName, paternalSurname, maternalSurname } = req.body;

            const { patient, patientUser, tempPassword } = await patientService.create(
                { firstName, paternalSurname, maternalSurname },
                doctorId
            );

            return res.status(201).json({
                message: 'Paciente creado exitosamente',
                patient,
                credentials: {
                    username: patientUser.username,
                    tempPassword,
                    note: 'Comparte estas credenciales con el paciente. Deberá cambiar su contraseña al primer inicio de sesión.',
                },
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/patients
    // Lista los pacientes del médico autenticado (aislamiento multi-tenant).
    async getAllPatients(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 50;
            const search = req.query.search || '';

            const data = await patientService.getAll(req.user.id, page, limit, search);

            return res.status(200).json({
                patients: data.data,
                total: data.total,
                page: data.page,
                limit: data.limit
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/patients/me
    // Vista del propio paciente: devuelve su registro de paciente.
    async getMyPatientRecord(req, res, next) {
        try {
            const patient = await patientService.getMyRecord(req.user.id);
            return res.status(200).json({ patient });
        } catch (err) {
            next(err);
        }
    },

    // PATCH /api/patients/me
    // El paciente completa su perfil en el primer login (birthDate, gender, email, phone).
    async updateMyProfile(req, res, next) {
        try {
            const { birthDate, gender, email, phone } = req.body;

            // El género llega como texto; validamos contra la lista permitida
            const validGenders = ['MASCULINO', 'FEMENINO', 'OTRO'];
            if (gender && !validGenders.includes(gender)) {
                return res.status(400).json({
                    error: `género inválido. Valores permitidos: ${validGenders.join(', ')}`,
                });
            }

            const patient = await patientService.updateMyProfile(req.user.id, {
                birthDate,
                gender,
                email,
                phone,
            });

            return res.status(200).json({
                message: 'Perfil actualizado exitosamente',
                patient,
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/patients/:id
    // Obtiene un paciente por ID (solo ve sus propios pacientes).
    async getPatientById(req, res, next) {
        try {
            const patient = await patientService.getById(req.params.id, req.user.id);
            return res.status(200).json({ patient });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/patients/:id
    // Actualiza datos del paciente (solo si pertenece al médico).
    async updatePatient(req, res, next) {
        try {
            const patient = await patientService.update(req.params.id, req.user.id, req.body);
            return res.status(200).json({ message: 'Paciente actualizado', patient });
        } catch (err) {
            next(err);
        }
    },

    // DELETE /api/patients/:id
    // Elimina un paciente (solo si pertenece al médico).
    async deletePatient(req, res, next) {
        try {
            await patientService.delete(req.params.id, req.user.id);
            return res.status(200).json({ message: 'Paciente eliminado' });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = patientController;
