import { uploadFile } from '@config/upload';
import { ensureAdminMiddleware } from '@shared/middlewares/ensureAdminMiddleware';
import { ensureAuthenticatedMiddleware } from '@shared/middlewares/ensureAuthenticatedMiddleware';
import { Router } from 'express';
import multer from 'multer';

import { UploadCarImageController } from '../useCases/uploadCarImage/UploadCarImageController';

const uploadCarImageController = new UploadCarImageController();

const uploadImagesMiddleware = multer(uploadFile('image'));

export const carImageRoutes = Router();

carImageRoutes.post(
  '/images/:id',
  ensureAuthenticatedMiddleware,
  ensureAdminMiddleware,
  uploadImagesMiddleware.array('imagesFiles'),
  uploadCarImageController.handle,
);
