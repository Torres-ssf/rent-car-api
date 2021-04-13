import { ensureAdminMiddleware } from '@shared/middlewares/ensureAdminMiddleware';
import { ensureAuthenticatedMiddleware } from '@shared/middlewares/ensureAuthenticatedMiddleware';
import { Router } from 'express';
import { CreateCategoryController } from '../useCases/createCategory/CreateCategoryController';
import { ListCategoriesController } from '../useCases/listCategories/ListCategoriesController';

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();

export const categoryRoutes = Router();

categoryRoutes.get(
  '/',
  ensureAuthenticatedMiddleware,
  listCategoriesController.handle,
);

categoryRoutes.post(
  '/',
  ensureAuthenticatedMiddleware,
  ensureAdminMiddleware,
  createCategoryController.handle,
);
