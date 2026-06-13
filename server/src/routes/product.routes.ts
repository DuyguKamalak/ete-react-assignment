import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate } from '../middleware/auth';

export const productRouter = Router();

productRouter.use(authenticate);
productRouter.get('/', productController.list);
productRouter.post('/', productController.create);
productRouter.put('/:id', productController.update);
productRouter.delete('/:id', productController.remove);
