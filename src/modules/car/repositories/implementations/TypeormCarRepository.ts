import { ListAvailableCarsDTO } from '@modules/car/dtos/ListAvailableCarsDTO';
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
    return this.carRepository.findOne({
      where: { id },
      relations: ['specifications'],
    });
  }

  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    return this.carRepository.findOne({
      where: { license_plate },
      relations: ['specifications'],
    });
  }

  async listAllCars(): Promise<Car[]> {
    return this.carRepository.find({
      relations: ['specifications'],
    });
  }

  async listAvailableCars(
    listAvailableCarsDTO: ListAvailableCarsDTO,
  ): Promise<Car[]> {
    const { category_id, brand, model } = listAvailableCarsDTO;
    const query = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.specifications', 'specifications')
      .where('available = :available', { available: true });

    if (category_id) {
      query.andWhere('category_id = :category_id', { category_id });
    }

    if (model) {
      query.andWhere('model ILIKE :model', { model: `%${model}%` });
    }

    if (brand) {
      query.andWhere('brand ILIKE :brand', { brand: `%${brand}%` });
    }

    return query.getMany();
  }

  async save(car: Car): Promise<Car> {
    return this.carRepository.save(car);
  }

  async remove(id: string): Promise<void> {
    await this.carRepository.delete({ id });
  }
}
