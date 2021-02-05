import 'reflect-metadata';

import 'express-async-errors';

import express from 'express';

import './container';

import { errorHandlingMiddleware } from './middlewares/errorHandleMiddleware';

import { appRoutes } from './routes';

export const app = express();

app.use(express.json());

app.use(appRoutes);

app.use(errorHandlingMiddleware);
