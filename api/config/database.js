const { Pool } = require('pg');
const env = require('./env');

// Un solo pool para toda la app; pg se encarga de crear
// conexiones nuevas cuando las que hay se saturan.
const pool = new Pool({
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
});

pool.on('connect', () => {
    console.log('✅ PostgreSQL pool connected');
});

pool.on('error', (err) => {
    // Si el pool se queda sin conexión a la BD no hay mucho que hacer:
    // mejor morir con un error claro que seguir en un estado roto.
    console.error('❌ PostgreSQL pool error:', err.message);
    process.exit(-1);
});

module.exports = pool;
