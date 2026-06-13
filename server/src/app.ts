import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth.routes';
import { companyRouter } from './routes/company.routes';
import { productRouter } from './routes/product.routes';
import { statsRouter } from './routes/stats.routes';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/companies', companyRouter);
  app.use('/api/products', productRouter);
  app.use('/api/stats', statsRouter);

  app.use(errorHandler);

  return app;
}
