import { ensureAdminMiddleware } from '@shared/middlewares/ensureAdminMiddleware';
import { ensureAuthenticatedMiddleware } from '@shared/middlewares/ensureAuthenticatedMiddleware';
import { Router } from 'express';
import { AddSpecificationToCarController } from '../useCases/addSpecificationToCar/AddSpecificationToCarController';
import { ListAvailableCarsController } from '../useCases/listAvailableCars/ListAvailableCarsController';
import { ListCarController } from '../useCases/listCar/ListCarController';
import { RegisterCarController } from '../useCases/registerCar/RegisterCarController';
import { RemoveCarController } from '../useCases/removeCar/RemoveCarController';
import { UpdateCarController } from '../useCases/updateCar/UpdateCarController';

const listCarController = new ListCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const registerCarController = new RegisterCarController();
const updateCarController = new UpdateCarController();
const removeCarController = new RemoveCarController();
const addSpecificationToCarController = new AddSpecificationToCarController();

export const carRoutes = Router();

carRoutes.get('/', listCarController.handle);

carRoutes.get('/available', listAvailableCarsController.handle);

carRoutes.post(
  '/',
  ensureAuthenticatedMiddleware,
  ensureAdminMiddleware,
  registerCarController.handle,
);

carRoutes.post(
  '/:id/add-specification',
  ensureAuthenticatedMiddleware,
  ensureAdminMiddleware,
  addSpecificationToCarController.handle,
);

carRoutes.put(
  '/:id',
  ensureAuthenticatedMiddleware,
  ensureAdminMiddleware,
  updateCarController.handle,
);

carRoutes.delete(
  '/:id',
  ensureAuthenticatedMiddleware,
  ensureAdminMiddleware,
  removeCarController.handle,
);
