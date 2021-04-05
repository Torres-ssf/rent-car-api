import { RegisterCarDTO } from '@modules/car/dtos/RegisterCarDTO';
import { TypeormCar } from '@modules/car/entities/TypeormCar';
import { Car } from 'modules/car/models/Car';
import { getRepository, Repository } from 'typeorm';
import { ICarRepository } from '../ICarRepository';

export class TypeormCarRepository implements ICarRepository {
  private readonly carRepository: Repository<Car>;

  constructor() {
    this.carRepository = getRepository(TypeormCar);
  }

  async create(registerCarDTO: RegisterCarDTO): Promise<Car> {
    const newCar = this.carRepository.create({
      ...registerCarDTO,
      available: true,
    });

    return this.carRepository.save(newCar);
  }

  async findById(id: string): Promise<Car | undefined> {
    return this.carRepository.findOne({ where: { id } });
  }

  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    return this.carRepository.findOne({ license_plate });
  }

  async listAllCars(): Promise<Car[]> {
    return this.carRepository.find();
  }

  async listAvailableCars(): Promise<Car[]> {
    return this.carRepository.find({ where: { available: true } });
  }

  async save(car: Car): Promise<Car> {
    return this.carRepository.save(car);
  }

  async remove(id: string): Promise<void> {
    await this.carRepository.delete({ id });
  }
}
