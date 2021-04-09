import { UploadCarImagesDTO } from '@modules/carImage/dtos/UploadCarImagesDTO';
import { TypeormCarImage } from '@modules/carImage/entities/TypeormCarImage';
import { CarImage } from '@modules/carImage/models/CarImage';
import { getRepository, Repository } from 'typeorm';
import { ICarImageRepository } from '../ICarImageRepository';

export class TypeormCarImageRepository implements ICarImageRepository {
  private readonly carImageRepository: Repository<CarImage>;

  constructor() {
    this.carImageRepository = getRepository(TypeormCarImage);
  }

  async createMany(
    uploadCarImagesDTO: UploadCarImagesDTO,
  ): Promise<CarImage[]> {
    const { car_id, images_names } = uploadCarImagesDTO;

    const images = images_names.map(eachImage => {
      return this.carImageRepository.create({
        car_id,
        image_name: eachImage,
      });
    });

    return this.carImageRepository.save(images);
  }
}
