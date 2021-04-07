import { uploadAvatar } from '@config/upload';
import { ensureAuthenticatedMiddleware } from '@shared/middlewares/ensureAuthenticatedMiddleware';
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
  ensureAuthenticatedMiddleware,
  uploadAvatarMiddleware.single('avatar'),
  updateUserAvatarController.handle,
);
