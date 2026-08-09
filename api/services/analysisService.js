const EventEmitter = require('events');
const Analysis = require('../models/Analysis');
const Patient = require('../models/Patient');
const AI_Processing_Log = require('../models/AI_Processing_Log');

const analysisEmitter = new EventEmitter();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────
// Worker en memoria: procesa los análisis en segundo plano para no
// bloquear la respuesta HTTP del endpoint.
// ─────────────────────────────────────────────────────────────────────
analysisEmitter.on('analysis:queued', async ({ analysisId, patientId }) => {
    console.log(`[Cola] Trabajo de análisis recibido: ${analysisId}`);

    let logEntry;
    try {
        logEntry = await AI_Processing_Log.create(analysisId);

        await Analysis.updateStatus(analysisId, 'PROCESSING', null);

        // Traemos la URI de la imagen guardada en MinIO
        const db = require('../config/database');
        const result = await db.query('SELECT image_uri, eye FROM analyses WHERE id = $1', [analysisId]);
        const analysisData = result.rows[0];

        if (!analysisData || !analysisData.image_uri) {
            throw new Error("No se encontró la imagen del análisis.");
        }

        // Descargamos la imagen y la mandamos al microservicio de IA
        const storageService = require('./storageService');
        const imageStream = await storageService.getImageStream(analysisData.image_uri);

        const formData = new FormData();
        formData.append('image', imageStream, { filename: 'retina.jpg' });
        if (analysisData.eye) {
            formData.append('eye', analysisData.eye);
        }

        console.log(`[Cola] Enviando imagen a servicio de IA...`);
        const aiResponse = await axios.post('http://algorithms:8000/predict', formData, {
            headers: {
                ...formData.getHeaders()
            },
            timeout: 90000 // 90s para inferencia de modelo PyTorch
        });

        const aiResult = aiResponse.data;

        await Analysis.updateStatus(analysisId, 'COMPLETED', aiResult);

        await Patient.incrementAnalyses(patientId).catch(e =>
            console.error(`[Cola] Error incrementando análisis del paciente:`, e.message)
        );
        if (aiResult.grade) {
            await Patient.updateHealthStatusFromAI(patientId, aiResult.grade).catch(e =>
                console.error(`[Cola] Error actualizando health_status:`, e.message)
            );
        }

        await AI_Processing_Log.complete(logEntry.task_id, 'COMPLETED');

    } catch (err) {
        console.error(`[Cola] Error procesando análisis ${analysisId}:`, err.message);

        // Si la IA respondió con un detalle legible, lo guardamos como error
        const errorMsg = err.response && err.response.data && err.response.data.detail
                         ? err.response.data.detail
                         : err.message;

        await Analysis.updateStatus(analysisId, 'FAILED', { error: errorMsg }).catch(() => { });

        if (logEntry) {
            await AI_Processing_Log.complete(logEntry.task_id, 'FAILED').catch(() => { });
        }
    }
});

const analysisService = {
    // Crea el análisis (PENDING) y lo manda al worker.
    // El cliente consulta el estado con polling a GET /analyses/:id.
    async createAnalysis({ patientId, doctorId, eye, imageUri, doctorNotes }) {
        if (!patientId) {
            const err = new Error('patientId es requerido');
            err.statusCode = 400;
            throw err;
        }
        if (!eye || !['LEFT', 'RIGHT'].includes(eye)) {
            const err = new Error('eye debe ser LEFT o RIGHT');
            err.statusCode = 400;
            throw err;
        }

        // El paciente debe pertenecer al médico que registra el análisis
        const patient = await Patient.findByIdAndDoctor(patientId, doctorId);
        if (!patient) {
            const err = new Error('Paciente no encontrado o no pertenece a este médico');
            err.statusCode = 404;
            throw err;
        }

        const analysis = await Analysis.create(patientId, doctorId, eye, imageUri, doctorNotes);
        console.log(`[Servicio] Análisis creado: ${analysis.id} | Status: PENDING`);

        // Fire-and-forget: encolamos el trabajo sin esperar al worker
        setImmediate(() => {
            analysisEmitter.emit('analysis:queued', {
                analysisId: analysis.id,
                patientId: analysis.patient_id,
            });
        });

        return analysis;
    },

    // Un solo análisis por UUID, con verificación de dueño (médico o paciente).
    async getById(id, doctorId) {
        const analysis = await Analysis.findByIdAndDoctor(id, doctorId);
        if (!analysis) {
            const err = new Error('Análisis no encontrado');
            err.statusCode = 404;
            throw err;
        }
        return analysis;
    },

    // Análisis de un paciente, filtrados por el médico.
    async getByPatientAndDoctor(patientId, doctorId) {
        return Analysis.findByPatientAndDoctor(patientId, doctorId);
    },

    // Análisis que puede ver un paciente (resolviendo su user_id).
    async getByPatientUserId(userId) {
        const patient = await Patient.findByUserId(userId);
        if (!patient) return [];
        return Analysis.findByPatientId(patient.id);
    },

    // Logs de procesamiento de un análisis.
    async getLogsForAnalysis(analysisId) {
        return AI_Processing_Log.findByAnalysisId(analysisId);
    },

    // Elimina un análisis (con verificación de propiedad).
    async delete(id, doctorId) {
        const deleted = await Analysis.deleteByIdAndDoctor(id, doctorId);
        if (!deleted) {
            const err = new Error('Análisis no encontrado');
            err.statusCode = 404;
            throw err;
        }
        return deleted;
    },

    // Actualiza las notas médicas de un análisis.
    async updateNotes(id, doctorId, notes) {
        const updated = await Analysis.updateNotes(id, doctorId, notes);
        if (!updated) {
            const err = new Error('Análisis no encontrado o no autorizado');
            err.statusCode = 404;
            throw err;
        }
        return updated;
    },
};

module.exports = analysisService;
