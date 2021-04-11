import { Router } from 'express';

import { userRoutes } from '@modules/user/routes/user.routes';
import { sessionRoutes } from '@modules/user/routes/session.routes';
import { carRoutes } from '@modules/car/routes/car.routes';
import { categoryRoutes } from '@modules/category/routes/category.routes';
import { specificationRoutes } from '@modules/specification/routes/specification.routes';
import { rentalRoutes } from '@modules/rental/routes/rental.routes';
import { carImageRoutes } from '@modules/carImage/routes/carImages.routes';

export const appRoutes = Router();

appRoutes.use('/user', userRoutes);

appRoutes.use('/session', sessionRoutes);

appRoutes.use('/car', carRoutes, carImageRoutes);

appRoutes.use('/category', categoryRoutes);

appRoutes.use('/specification', specificationRoutes);

appRoutes.use('/rental', rentalRoutes);
