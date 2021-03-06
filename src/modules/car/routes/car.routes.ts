import { Router } from 'express';
import { ListAvailableCarsController } from '../useCases/ListAvailableCars/ListAvailableCarsController';
import { ListCarController } from '../useCases/ListCar/ListCarController';
import { RegisterCarController } from '../useCases/RegisterCar/RegisterCarController';
import { RemoveCarController } from '../useCases/RemoveCar/RemoveCarController';
import { UpdateCarController } from '../useCases/UpdateCar/UpdateCarController';

const listCarController = new ListCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const registerCarController = new RegisterCarController();
const updateCarController = new UpdateCarController();
const removeCarController = new RemoveCarController();

export const carRoutes = Router();

carRoutes.get('/', listCarController.handle);

carRoutes.get('/available', listAvailableCarsController.handle);

carRoutes.post('/', registerCarController.handle);

carRoutes.put('/:id', updateCarController.handle);

carRoutes.delete('/:id', removeCarController.handle);
