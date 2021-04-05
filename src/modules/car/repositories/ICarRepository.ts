import { RegisterCarDTO } from '../dtos/RegisterCarDTO';
import { Car } from '../models/Car';

export interface ICarRepository {
  create(registerCarDTO: RegisterCarDTO): Promise<Car>;
  findById(id: string): Promise<Car | undefined>;
  findByLicensePlate(license_plate: string): Promise<Car | undefined>;
  listAllCars(): Promise<Car[]>;
  listAvailableCars(): Promise<Car[]>;
  save(car: Car): Promise<Car>;
  remove(id: string): Promise<void>;
}
