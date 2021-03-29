import { Router } from 'express';
import { CreateCategoryController } from '../useCases/createCategory/CreateCategoryController';

const createCategoryController = new CreateCategoryController();

export const categoryRoutes = Router();

categoryRoutes.post('/', createCategoryController.handle);
