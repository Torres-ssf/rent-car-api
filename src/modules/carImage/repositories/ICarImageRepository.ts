import { CreateCarImageDTO } from '../dtos/CreateCarImageDTO';
import { CarImage } from '../models/CarImage';

export interface ICarImageRepository {
  createMany(createCarImageDTO: CreateCarImageDTO): Promise<CarImage[]>;
}
