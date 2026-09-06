require('dotenv').config();

const express = require('express');
const { pool, query } = require('./db');
const usersRouter = require('./routes/users');

const app = express();
const port = Number(process.env.PORT || 3000);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }));

app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    console.info('HTTP request', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      ip: req.ip,
    });
  });
  next();
});

app.get('/', (req, res) => {
  res.json({
    application: 'Docker Nginx PostgreSQL Demo',
    status: 'healthy',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/dbcheck', async (req, res, next) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ status: 'healthy', timestamp: result.rows[0].now });
  } catch (error) {
    next(error);
  }
});

app.use('/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((error, req, res, next) => {
  console.error('Unhandled request error', {
    method: req.method,
    path: req.originalUrl,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(port, '0.0.0.0', () => {
  console.info(`API listening on port ${port}`);
});

async function shutdown(signal) {
  console.info(`${signal} received; shutting down`);

  server.close(async () => {
    try {
      await pool.end();
      console.info('Shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('Shutdown failed', error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
