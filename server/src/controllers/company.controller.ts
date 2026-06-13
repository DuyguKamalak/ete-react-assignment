import { Request, Response } from 'express';
import { companyService } from '../services/company.service';
import { companySchema } from '../validators/schemas';
import { asyncHandler } from '../utils/asyncHandler';

export const companyController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    res.json(await companyService.list());
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    res.json(await companyService.getById(Number(req.params.id)));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const input = companySchema.parse(req.body);
    res.status(201).json(await companyService.create(input));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const input = companySchema.parse(req.body);
    res.json(await companyService.update(Number(req.params.id), input));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await companyService.remove(Number(req.params.id));
    res.status(204).send();
  }),
};
