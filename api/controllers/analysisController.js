const analysisService = require('../services/analysisService');
const storageService = require('../services/storageService');
const Patient = require('../models/Patient');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Convierte la URI interna de la imagen a una URL firmada temporalmente.
// Así el frontend puede mostrar la retinografía sin exponer el bucket.
async function formatAnalysisWithPresignedUrl(analysis) {
    if (!analysis) return null;
    const formatted = { ...analysis };
    if (formatted.image_uri) {
        formatted.image_uri = await storageService.getPresignedUrl(formatted.image_uri);
    }
    return formatted;
}

const analysisController = {
    // POST /api/analyses
    // Respondemos de inmediato con 202 Accepted (status PENDING).
    // La IA procesa la imagen en segundo plano.
    async createAnalysis(req, res, next) {
        try {
            const { eye, doctorNotes } = req.body;
            let patientId = req.body.patientId;
            let doctorId = req.user.id;

            // Si quien sube es el paciente, resolvemos su registro y al médico dueño
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
                // Subir el buffer directo a MinIO con un nombre único
                const filename = `${uuidv4()}${path.extname(req.file.originalname || '.jpg')}`;
                imageUri = await storageService.uploadImage(req.file.buffer, filename, req.file.mimetype);
            }

            const analysis = await analysisService.createAnalysis({
                patientId,
                doctorId,
                eye: eye || 'LEFT', // default temporal
                imageUri,
                doctorNotes,
            });

            const responseAnalysis = await formatAnalysisWithPresignedUrl(analysis);

            return res.status(202).json({
                message: 'Análisis en cola — el procesamiento de IA ha comenzado en segundo plano',
                analysis: responseAnalysis,
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/analyses/patient/:patientId
    // Lista de análisis de un paciente, solo los del médico autenticado.
    async getAnalysisByPatient(req, res, next) {
        try {
            const analyses = await analysisService.getByPatientAndDoctor(
                req.params.patientId,
                req.user.id
            );
            const formattedAnalyses = await Promise.all(analyses.map(formatAnalysisWithPresignedUrl));
            return res.status(200).json({ count: formattedAnalyses.length, analyses: formattedAnalyses });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/analyses/my
    // Vista del paciente: solo sus propios análisis.
    async getMyAnalyses(req, res, next) {
        try {
            const analyses = await analysisService.getByPatientUserId(req.user.id);
            const formattedAnalyses = await Promise.all(analyses.map(formatAnalysisWithPresignedUrl));
            return res.status(200).json({ count: formattedAnalyses.length, analyses: formattedAnalyses });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/analyses/:id
    // Detalle de un análisis, con verificación de propiedad:
    // el paciente solo ve los suyos y el médico solo los de sus pacientes.
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

            const formattedAnalysis = await formatAnalysisWithPresignedUrl(analysis);
            return res.status(200).json({ analysis: formattedAnalysis });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/analyses/:id/logs
    // Logs de auditoría del procesamiento de IA.
    async getAnalysisLogs(req, res, next) {
        try {
            const logs = await analysisService.getLogsForAnalysis(req.params.id);
            return res.status(200).json({ count: logs.length, logs });
        } catch (err) {
            next(err);
        }
    },

    // DELETE /api/analyses/:id
    // Elimina un análisis, siempre que pertenezca al médico autenticado.
    async deleteAnalysis(req, res, next) {
        try {
            await analysisService.delete(req.params.id, req.user.id);
            return res.status(200).json({ message: 'Análisis eliminado' });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/analyses/:id/notes
    // Actualiza las notas médicas de un análisis.
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
