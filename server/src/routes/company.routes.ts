import { Router } from 'express';
import { companyController } from '../controllers/company.controller';
import { authenticate } from '../middleware/auth';

export const companyRouter = Router();

companyRouter.use(authenticate);
companyRouter.get('/', companyController.list);
companyRouter.post('/', companyController.create);
companyRouter.put('/:id', companyController.update);
companyRouter.delete('/:id', companyController.remove);
