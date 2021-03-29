import { Router } from 'express';

import { userRoutes } from '@modules/user/routes/user.routes';
import { sessionRoutes } from '@modules/user/routes/session.routes';
import { carRoutes } from '@modules/car/routes/car.routes';
import { categoryRoutes } from '@modules/car/routes/category.routes';
import { rentalRoutes } from '@modules/rental/routes/rental.routes';

export const appRoutes = Router();

appRoutes.use('/user', userRoutes);

appRoutes.use('/session', sessionRoutes);

appRoutes.use('/car', carRoutes);

appRoutes.use('/category', categoryRoutes);

appRoutes.use('/rental', rentalRoutes);
