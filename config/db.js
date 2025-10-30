;
require('dotenv').config();   // <- MUY IMPORTANTE que esté acá
const { Pool } = require('pg');

const cfg = {
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 10,
  idleTimeoutMillis: 30000,
};

// Debug amistoso (podés dejarlo por ahora)
if (!cfg.user || !cfg.password || !cfg.database) {
  console.error('❌ Faltan variables PG en .env', {
    user: cfg.user,
    hasPassword: !!cfg.password,
    database: cfg.database
  });
}

const pool = new Pool(cfg);
pool.on('connect', () => console.log('✅ Conectado a PostgreSQL'));
pool.on('error', (err) => console.error('❌ Error en pool PG:', err));
module.exports = pool;
