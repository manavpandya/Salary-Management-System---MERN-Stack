import express from 'express';
import cors from 'cors';
import prisma from './services/prisma';
import employeeRoutes from './routes/employees';
import insightRoutes from './routes/insights';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));

// Request timeout middleware (30 seconds)
app.use((_req, res, next) => {
  res.setTimeout(30_000, () => {
    res.status(503).json({ message: 'Request timeout' });
  });
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/insights', insightRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

if (require.main === module) {
  // Validate database connectivity using the shared Prisma instance
  prisma.$queryRawUnsafe('SELECT 1')
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('FATAL: Database connection failed. Check DATABASE_URL.', err.message);
      process.exit(1);
    });
}

export default app;