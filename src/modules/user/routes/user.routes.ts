import { Router } from 'express';

import { RegisterUserController } from '../useCases/RegisterUser/RegisterUserController';

const registerUserController = new RegisterUserController();

export const userRoutes = Router();

userRoutes.post('/', registerUserController.handle);
