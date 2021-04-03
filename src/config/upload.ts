import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

interface IUpdateAvatarReturn {
  storage: multer.StorageEngine;
}

export const uploadAvatar = (): IUpdateAvatarReturn => {
  return {
    storage: multer.diskStorage({
      destination: path.resolve(__dirname, '..', '..', 'tmp', 'avatar'),
      filename: (request, file, callback) => {
        const hash = crypto.randomBytes(16).toString('hex');
        const fileName = `${hash}-${file.originalname.replace(' ', '')}`;

        return callback(null, fileName);
      },
    }),
  };
};
