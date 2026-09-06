const { Pool } = require('pg');

const requiredVariables = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error', error);
});

async function query(text, params) {
  const startedAt = Date.now();

  try {
    const result = await pool.query(text, params);
    console.info('Database query completed', {
      durationMs: Date.now() - startedAt,
      rowCount: result.rowCount,
    });
    return result;
  } catch (error) {
    console.error('Database query failed', {
      durationMs: Date.now() - startedAt,
      message: error.message,
    });
    throw error;
  }
}

module.exports = { pool, query };

