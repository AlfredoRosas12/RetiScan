const Recommendation = require('../models/Recommendation');
const MedicationLog = require('../models/MedicationLog');
const Patient = require('../models/Patient');

const recommendationController = {
    // POST /recommendations — crear recomendación o medicamento (médico)
    async createRecommendation(req, res, next) {
        try {
            const { patientId, type, title, description, dosage, frequencyHours } = req.body;
            if (!patientId || !type || !title) {
                return res.status(400).json({ error: 'patientId, type y title son requeridos' });
            }
            if (!['RECOMMENDATION', 'MEDICATION'].includes(type)) {
                return res.status(400).json({ error: 'type debe ser RECOMMENDATION o MEDICATION' });
            }

            // El paciente debe pertenecer al médico que lo registra
            const patient = await Patient.findByIdAndDoctor(patientId, req.user.doctorId || req.user.id);
            if (!patient) {
                return res.status(404).json({ error: 'Paciente no encontrado o no pertenece a este médico' });
            }

            const rec = await Recommendation.create({
                patientId,
                type,
                title,
                description,
                dosage,
                frequencyHours: type === 'MEDICATION' ? frequencyHours : null,
                createdBy: req.user.id,
            });

            res.status(201).json(rec);
        } catch (err) {
            next(err);
        }
    },

    // GET /recommendations/my — mis recomendaciones (paciente)
    async getMyRecommendations(req, res, next) {
        try {
            const patient = await Patient.findByUserId(req.user.id);
            if (!patient) {
                return res.status(404).json({ error: 'Registro de paciente no encontrado' });
            }
            const recs = await Recommendation.findByPatient(patient.id);
            res.json(recs);
        } catch (err) {
            next(err);
        }
    },

    // GET /recommendations/patient/:patientId — recomendaciones de un paciente (médico)
    async getPatientRecommendations(req, res, next) {
        try {
            const { patientId } = req.params;
            const patient = await Patient.findByIdAndDoctor(patientId, req.user.doctorId || req.user.id);
            if (!patient) {
                return res.status(404).json({ error: 'Paciente no encontrado' });
            }
            const recs = await Recommendation.findByPatient(patientId);
            res.json(recs);
        } catch (err) {
            next(err);
        }
    },

    // POST /recommendations/:id/confirm — el paciente confirma que tomó su medicamento
    async confirmMedicationTaken(req, res, next) {
        try {
            const { id } = req.params;
            const rec = await Recommendation.findById(id);
            if (!rec) {
                return res.status(404).json({ error: 'Recomendación no encontrada' });
            }
            if (rec.type !== 'MEDICATION') {
                return res.status(400).json({ error: 'Solo se puede confirmar toma de medicamentos' });
            }

            // Solo el dueño del medicamento puede confirmar
            const patient = await Patient.findByUserId(req.user.id);
            if (!patient || patient.id !== rec.patient_id) {
                return res.status(403).json({ error: 'No autorizado' });
            }

            // Con la frecuencia en horas calculamos cuándo toca la siguiente toma
            const nextDoseAt = rec.frequency_hours
                ? new Date(Date.now() + rec.frequency_hours * 3600000).toISOString()
                : null;

            // Guardamos la toma en el log
            const log = await MedicationLog.create({
                recommendationId: id,
                nextDoseAt,
            });

            // Y actualizamos la próxima dosis en la recomendación
            await Recommendation.updateNextDose(id, nextDoseAt);

            res.json({
                message: 'Toma registrada correctamente',
                log,
                nextDoseAt,
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /recommendations/:id/logs — historial de tomas
    async getMedicationLogs(req, res, next) {
        try {
            const { id } = req.params;
            const logs = await MedicationLog.findByRecommendation(id);
            res.json(logs);
        } catch (err) {
            next(err);
        }
    },

    // DELETE /recommendations/:id — desactiva la recomendación (médico)
    async deleteRecommendation(req, res, next) {
        try {
            const { id } = req.params;
            const result = await Recommendation.deactivate(id);
            if (!result) {
                return res.status(404).json({ error: 'Recomendación no encontrada' });
            }
            res.json({ message: 'Recomendación desactivada' });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = recommendationController;
