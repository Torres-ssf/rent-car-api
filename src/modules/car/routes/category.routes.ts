import { Router } from 'express';
import { CreateCategoryController } from '../useCases/createCategory/CreateCategoryController';
import { ListCategoriesController } from '../useCases/listCategories/ListCategoriesController';

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();

export const categoryRoutes = Router();

categoryRoutes.get('/', listCategoriesController.handle);

categoryRoutes.post('/', createCategoryController.handle);
