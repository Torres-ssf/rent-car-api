import { CreateCarImageDTO } from '@modules/carImage/dtos/CreateCarImageDTO';
import { CarImage } from '@modules/carImage/models/CarImage';
import { ICarImageRepository } from '../ICarImageRepository';

export class FakeCarImageRepository implements ICarImageRepository {
  private carImages: CarImage[] = [];

  async createMany(createCarImageDTO: CreateCarImageDTO): Promise<CarImage[]> {
    const { car_id, images_names } = createCarImageDTO;

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
