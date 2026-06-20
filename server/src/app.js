import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import badgeRoutes from './routes/badgeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import demoRoutes from './routes/demoRoutes.js';

export function createApp({ demoMode = false } = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'Life XP', mode: demoMode ? 'demo' : 'mongo' });
  });

  if (demoMode) {
    app.use('/api', demoRoutes);
  } else {
    app.use('/api/experiences', experienceRoutes);
    app.use('/api/skills', skillRoutes);
    app.use('/api/badges', badgeRoutes);
    app.use('/api/dashboard', dashboardRoutes);
  }

  app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Something went wrong.'
    });
  });

  return app;
}


