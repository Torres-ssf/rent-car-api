import { Router } from 'express';
import { CreateSpecificationController } from '../useCases/createSpecification/CreateSpecificationController';

const createSpecificationController = new CreateSpecificationController();

export const specificationRoutes = Router();

specificationRoutes.post('/', createSpecificationController.handle);
