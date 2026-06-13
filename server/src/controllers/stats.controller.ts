import { Request, Response } from 'express';
import { statsService } from '../services/stats.service';
import { asyncHandler } from '../utils/asyncHandler';

export const statsController = {
  dashboard: asyncHandler(async (_req: Request, res: Response) => {
    res.json(await statsService.getDashboard());
  }),
};
