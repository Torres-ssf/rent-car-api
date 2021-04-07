import { ensureAdminMiddleware } from '@shared/middlewares/ensureAdminMiddleware';
import { ensureAuthenticatedMiddleware } from '@shared/middlewares/ensureAuthenticatedMiddleware';
import { Router } from 'express';
import { CreateSpecificationController } from '../useCases/createSpecification/CreateSpecificationController';

const createSpecificationController = new CreateSpecificationController();

export const specificationRoutes = Router();

specificationRoutes.post(
  '/',
  ensureAuthenticatedMiddleware,
  ensureAdminMiddleware,
  createSpecificationController.handle,
);
