import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { productSchema } from '../validators/schemas';
import { asyncHandler } from '../utils/asyncHandler';

export const productController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    res.json(await productService.list());
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    res.json(await productService.getById(Number(req.params.id)));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const input = productSchema.parse(req.body);
    res.status(201).json(await productService.create(input));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const input = productSchema.parse(req.body);
    res.json(await productService.update(Number(req.params.id), input));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await productService.remove(Number(req.params.id));
    res.status(204).send();
  }),
};
