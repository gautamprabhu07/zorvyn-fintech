const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

const defaultCorsOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

const stripWrappingQuotes = (value) => value.replace(/^['"]+|['"]+$/g, '');

const normalizeOrigin = (value) => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  let normalized = stripWrappingQuotes(value.trim());

  if (!normalized) {
    return '';
  }

  if (normalized.includes('*')) {
    // Keep wildcard entries as-is for host suffix matching.
    return normalized.replace(/\/+$/, '');
  }

  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  try {
    return new URL(normalized).origin;
  } catch {
    return '';
  }
};

const rawAllowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : defaultCorsOrigins;

const allowedOrigins = rawAllowedOrigins
  .map(normalizeOrigin)
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    // Allow server-to-server tools and curl requests with no Origin header.
    return true;
  }

  const normalizedRequestOrigin = normalizeOrigin(origin);

  if (!normalizedRequestOrigin) {
    return false;
  }

  return allowedOrigins.some((allowedOrigin) => {
    if (!allowedOrigin.includes('*')) {
      return allowedOrigin === normalizedRequestOrigin;
    }

    // Supports wildcard rules like https://*.vercel.app
    const wildcardPattern = allowedOrigin
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');

    return new RegExp(`^${wildcardPattern}$`, 'i').test(normalizedRequestOrigin);
  });
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Zorvyn Fintech API',
  });
});

app.use('/api', healthRoutes);
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
