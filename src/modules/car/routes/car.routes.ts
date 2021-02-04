import { Router } from 'express';
import { RegisterCarController } from '../useCases/RegisterCar/RegisterCarController';

const registerCarController = new RegisterCarController();

export const carRoutes = Router();

carRoutes.post('/', registerCarController.handle);
