const analysisService = require('../services/analysisService');
const Patient = require('../models/Patient');

const analysisController = {
    /**
     * POST /api/analyses
     * Devuelve inmediatamente un 202 Accepted con el registro PENDING.
     * El procesamiento de IA comienza asincrónicamente en segundo plano.
     */
    async createAnalysis(req, res, next) {
        try {
            const { eye, doctorNotes } = req.body;
            let patientId = req.body.patientId;
            let doctorId = req.user.id;

            if (req.user.role === 'PACIENTE') {
                const patient = await Patient.findByUserId(req.user.id);
                if (!patient) {
                    return res.status(404).json({ error: 'Perfil de paciente no encontrado' });
                }
                patientId = patient.id;
                doctorId = patient.doctor_id;
            }

            let imageUri = req.body.imageUri;

            if (req.file) {
                // Generar URL hacia la imagen estática servida en /uploads
                imageUri = `/uploads/${req.file.filename}`;
            }

            const analysis = await analysisService.createAnalysis({
                patientId,
                doctorId,
                eye: eye || 'LEFT', // Default temporal
                imageUri,
                doctorNotes,
            });
            return res.status(202).json({
                message: 'Análisis en cola — el procesamiento de IA ha comenzado en segundo plano',
                analysis,
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * GET /api/analyses/patient/:patientId
     * Lista todos los análisis de un paciente (solo los del médico autenticado).
     * Requiere rol MEDICO.
     */
    async getAnalysisByPatient(req, res, next) {
        try {
            const analyses = await analysisService.getByPatientAndDoctor(
                req.params.patientId,
                req.user.id
            );
            return res.status(200).json({ count: analyses.length, analyses });
        } catch (err) {
            next(err);
        }
    },

    /**
     * GET /api/analyses/my
     * Vista del paciente: devuelve sus propios análisis.
     * Requiere rol PACIENTE.
     */
    async getMyAnalyses(req, res, next) {
        try {
            const analyses = await analysisService.getByPatientUserId(req.user.id);
            return res.status(200).json({ count: analyses.length, analyses });
        } catch (err) {
            next(err);
        }
    },

    /**
     * GET /api/analyses/:id
     * Obtiene un análisis por ID (con verificación de propiedad del médico o paciente).
     * Requiere rol MEDICO o PACIENTE.
     */
    async getAnalysisById(req, res, next) {
        try {
            const id = req.params.id;
            const analysis = await require('../models/Analysis').findById(id);
            if (!analysis) {
                return res.status(404).json({ error: 'Análisis no encontrado' });
            }

            if (req.user.role === 'PACIENTE') {
                const patient = await Patient.findByUserId(req.user.id);
                if (!patient || patient.id !== analysis.patient_id) {
                    return res.status(404).json({ error: 'Análisis no encontrado' });
                }
            } else if (req.user.role === 'MEDICO') {
                if (analysis.doctor_id !== req.user.id) {
                    return res.status(404).json({ error: 'Análisis no encontrado' });
                }
            }

            return res.status(200).json({ analysis });
        } catch (err) {
            next(err);
        }
    },

    /**
     * GET /api/analyses/:id/logs
     * Logs de auditoría del procesamiento de IA.
     * Requiere rol MEDICO.
     */
    async getAnalysisLogs(req, res, next) {
        try {
            const logs = await analysisService.getLogsForAnalysis(req.params.id);
            return res.status(200).json({ count: logs.length, logs });
        } catch (err) {
            next(err);
        }
    },

    /**
     * DELETE /api/analyses/:id
     * Elimina un análisis (solo si pertenece al médico autenticado).
     * Requiere rol MEDICO.
     */
    async deleteAnalysis(req, res, next) {
        try {
            await analysisService.delete(req.params.id, req.user.id);
            return res.status(200).json({ message: 'Análisis eliminado' });
        } catch (err) {
            next(err);
        }
    },

    /**
     * PUT /api/analyses/:id/notes
     * Actualizar notas médicas de un análisis.
     * Requiere rol MEDICO.
     */
    async updateAnalysisNotes(req, res, next) {
        try {
            const { notes } = req.body;
            const updated = await analysisService.updateNotes(req.params.id, req.user.id, notes);
            return res.status(200).json({ message: 'Notas actualizadas', analysis: updated });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = analysisController;
