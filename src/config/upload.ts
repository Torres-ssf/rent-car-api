import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

interface IUpdateFileReturn {
  storage: multer.StorageEngine;
}

export const uploadFile = (directory: string): IUpdateFileReturn => {
  return {
    storage: multer.diskStorage({
      destination: path.resolve(__dirname, '..', '..', 'tmp', directory),
      filename: (request, file, callback) => {
        const hash = crypto.randomBytes(16).toString('hex');
        const fileName = `${hash}-${file.originalname.replace(' ', '')}`;

        return callback(null, fileName);
      },
    }),
  };
};
