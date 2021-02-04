import { Router } from 'express';
import { carRoutes } from '@modules/car/routes/car.routes';

export const appRoutes = Router();

appRoutes.use('/car', carRoutes);
