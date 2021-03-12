import { Router } from 'express';
import { RentCarController } from '../useCases/RentCar/RentCarController';

const rentCarController = new RentCarController();

export const rentalRoutes = Router();

rentalRoutes.post('/', rentCarController.handle);
