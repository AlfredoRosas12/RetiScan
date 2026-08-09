const { Router } = require('express');

const userRoutes = require('./userRoutes');
const patientRoutes = require('./patientRoutes');
const analysisRoutes = require('./analysisRoutes');
const authRoutes = require('./authRoutes');
const doctorRoutes = require('./doctorRoutes');
const recommendationRoutes = require('./recommendationRoutes');

const router = Router();

// Health-check (sin autenticación) — verifica DB + API
router.get('/health', async (req, res) => {
    const health = {
        status: 'OK',
        service: 'RetiScan SaaS API',
        database: 'unknown',
        timestamp: new Date().toISOString(),
    };

    try {
        const pool = require('../config/database');
        await pool.query('SELECT 1');
        health.database = 'connected';
    } catch (err) {
        health.status = 'ERROR';
        health.database = 'disconnected';
        return res.status(503).json(health);
    }

    res.status(200).json(health);
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/analyses', analysisRoutes);
router.use('/recommendations', recommendationRoutes);

module.exports = router;
