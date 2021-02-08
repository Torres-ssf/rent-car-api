import { Router } from 'express';

import { userRoutes } from '@modules/user/routes/user.routes';
import { carRoutes } from '@modules/car/routes/car.routes';

export const appRoutes = Router();

appRoutes.use('/user', userRoutes);

appRoutes.use('/car', carRoutes);
