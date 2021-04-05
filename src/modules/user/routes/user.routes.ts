import { uploadAvatar } from '@config/upload';
import { ensuredAuthenticatedMiddleware } from '@shared/middlewares/ensuredAuthenticatedMiddleware';
import { Router } from 'express';
import multer from 'multer';

import { RegisterUserController } from '../useCases/registerUser/RegisterUserController';
import { UpdateUserAvatarController } from '../useCases/updateUserAvatar/UpdateUserAvatarController';

const registerUserController = new RegisterUserController();
const updateUserAvatarController = new UpdateUserAvatarController();

export const userRoutes = Router();

const uploadAvatarMiddleware = multer(uploadAvatar());

userRoutes.post('/', registerUserController.handle);

userRoutes.patch(
  '/avatar',
  ensuredAuthenticatedMiddleware,
  uploadAvatarMiddleware.single('avatar'),
  updateUserAvatarController.handle,
);
