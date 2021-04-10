import { ensureAuthenticatedMiddleware } from '@shared/middlewares/ensureAuthenticatedMiddleware';
import { Router } from 'express';
import { CreateRentalController } from '../useCases/createRental/CreateRentalController';

const createRentalController = new CreateRentalController();

export const rentalRoutes = Router();

rentalRoutes.post(
  '/:car_id',
  ensureAuthenticatedMiddleware,
  createRentalController.handle,
);
