import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';
import { authenticate } from '../middleware/auth';

export const statsRouter = Router();

statsRouter.use(authenticate);
statsRouter.get('/', statsController.dashboard);
