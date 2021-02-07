import { Router } from 'express';
import { RegisterCarController } from '../useCases/RegisterCar/RegisterCarController';
import { RemoveCarController } from '../useCases/RemoveCar/RemoveCarController';
import { UpdateCarController } from '../useCases/UpdateCar/UpdateCarController';

const registerCarController = new RegisterCarController();
const updateCarController = new UpdateCarController();
const removeCarController = new RemoveCarController();

export const carRoutes = Router();

carRoutes.post('/', registerCarController.handle);

carRoutes.put('/:id', updateCarController.handle);

carRoutes.delete('/:id', removeCarController.handle);
