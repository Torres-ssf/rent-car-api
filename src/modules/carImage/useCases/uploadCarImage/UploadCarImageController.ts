import { UploadCarImagesDTO } from '@modules/carImage/dtos/UploadCarImagesDTO';
import { AppError } from '@shared/errors/AppError';
import { dataValidation } from '@shared/utils/dataValidation';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { deleteMultipleFiles } from '@shared/utils/deleteMultipleFiles';
import { UploadCarImageUseCase } from './UploadCarImageUseCase';

interface IFiles {
  filename: string;
}

export class UploadCarImageController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const imagesFiles = request.files as IFiles[];

    const imagesNames = imagesFiles.map(file => file.filename);

    try {
      const uploadCarImagesDTO = await dataValidation(UploadCarImagesDTO, {
        car_id: id,
        images_names: imagesNames,
      });

      const uploadCarImageUseCase = container.resolve(UploadCarImageUseCase);

      const carImages = await uploadCarImageUseCase.execute(uploadCarImagesDTO);

      return response.json(carImages);
    } catch (err) {
      await deleteMultipleFiles(
        imagesFiles.map(file => `./tmp/image/${file.filename}`),
      );

      throw new AppError(
        err.message || 'Error occurred while trying to upload car image(s)',
      );
    }
  }
}
