import 'reflect-metadata';

import 'express-async-errors';

import express from 'express';

import swaggerUi from 'swagger-ui-express';

import './database/index';

import './container';

import swaggerDoc from './docs/swagger.json';

import { errorHandlingMiddleware } from './middlewares/errorHandleMiddleware';

import { appRoutes } from './routes';

export const app = express();

app.use(express.json());

app.use(appRoutes);

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errorHandlingMiddleware);
