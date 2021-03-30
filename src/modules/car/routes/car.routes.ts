import { Router } from 'express';
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

export const carRoutes = Router();

carRoutes.get('/', listCarController.handle);

carRoutes.get('/available', listAvailableCarsController.handle);

carRoutes.post('/', registerCarController.handle);

carRoutes.put('/:id', updateCarController.handle);

carRoutes.delete('/:id', removeCarController.handle);
