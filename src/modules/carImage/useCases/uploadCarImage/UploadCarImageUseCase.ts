import { ICarRepository } from '@modules/car/repositories/ICarRepository';
import { UploadCarImagesDTO } from '@modules/carImage/dtos/UploadCarImagesDTO';
import { ICarImageRepository } from '@modules/carImage/repositories/ICarImageRepository';
import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UploadCarImageUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('CarImageRepository')
    private carImageRepository: ICarImageRepository,
  ) {}

  async execute(uploadCarImagesDTO: UploadCarImagesDTO): Promise<void> {
    const { car_id } = uploadCarImagesDTO;

    const carExists = await this.carRepository.findById(car_id);

    if (!carExists) {
      throw new AppError('No car found for the given id');
    }
  }
}
