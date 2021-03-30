import { Router } from 'express';

import { CreateSessionController } from '../useCases/createSession/CreateSessionController';

const createSessionController = new CreateSessionController();

export const sessionRoutes = Router();

sessionRoutes.post('/signin', createSessionController.handle);
