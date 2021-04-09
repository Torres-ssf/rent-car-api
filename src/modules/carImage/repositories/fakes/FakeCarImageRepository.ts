import { UploadCarImagesDTO } from '@modules/carImage/dtos/UploadCarImagesDTO';
import { CarImage } from '@modules/carImage/models/CarImage';
import { ICarImageRepository } from '../ICarImageRepository';

export class FakeCarImageRepository implements ICarImageRepository {
  private carImages: CarImage[] = [];

  async createMany(
    uploadCarImagesDTO: UploadCarImagesDTO,
  ): Promise<CarImage[]> {
    const { car_id, images_names } = uploadCarImagesDTO;

    const carImages = images_names.map(image => {
      const newCarImage = new CarImage();

      Object.assign(newCarImage, {
        car_id,
        image_name: image,
      });

      return newCarImage;
    });

    this.carImages.push(...carImages);

    return carImages;
  }
}
