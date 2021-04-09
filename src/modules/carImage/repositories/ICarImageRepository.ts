import { UploadCarImagesDTO } from '../dtos/UploadCarImagesDTO';
import { CarImage } from '../models/CarImage';

export interface ICarImageRepository {
  createMany(uploadCarImageDTO: UploadCarImagesDTO): Promise<CarImage[]>;
}
