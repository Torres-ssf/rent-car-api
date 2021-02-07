import { Router } from 'express';
import { RegisterCarController } from '../useCases/RegisterCar/RegisterCarController';
import { UpdateCarController } from '../useCases/UpdateCar/UpdateCarController';

const registerCarController = new RegisterCarController();
const updateCarController = new UpdateCarController();

export const carRoutes = Router();

carRoutes.post('/', registerCarController.handle);

carRoutes.put('/:id', updateCarController.handle);
