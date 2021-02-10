import { Router } from 'express';

import { CreateSessionController } from '../useCases/CreateSession/CreateSessionController';

const createSessionController = new CreateSessionController();

export const sessionRoutes = Router();

sessionRoutes.post('/signin', createSessionController.handle);
