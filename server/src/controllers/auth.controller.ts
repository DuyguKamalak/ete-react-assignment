import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { credentialsSchema } from '../validators/schemas';
import { asyncHandler } from '../utils/asyncHandler';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = credentialsSchema.parse(req.body);
    const result = await authService.register(username, password);
    res.status(201).json(result);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = credentialsSchema.parse(req.body);
    const result = await authService.login(username, password);
    res.json(result);
  }),
};
