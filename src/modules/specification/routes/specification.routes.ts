import { ensureAdminMiddleware } from '@shared/middlewares/ensureAdminMiddleware';
import { ensureAuthenticatedMiddleware } from '@shared/middlewares/ensureAuthenticatedMiddleware';
import { Router } from 'express';
import { CreateSpecificationController } from '../useCases/createSpecification/CreateSpecificationController';
import { ListSpecificationsController } from '../useCases/listSpecifications/ListSpecificationsController';

const listSpecificationsController = new ListSpecificationsController();
const createSpecificationController = new CreateSpecificationController();

export const specificationRoutes = Router();

specificationRoutes.get(
  '/',
  ensureAuthenticatedMiddleware,
  listSpecificationsController.handle,
);

specificationRoutes.post(
  '/',
  ensureAuthenticatedMiddleware,
  ensureAdminMiddleware,
  createSpecificationController.handle,
);
