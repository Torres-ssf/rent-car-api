import { RegisterCarDTO } from '@modules/car/dtos/RegisterCarDTO';
import { Car } from '@modules/car/models/Car';
import { ICarRepository } from '../ICarRepository';

export class FakeCarRepository implements ICarRepository {
  private cars: Car[] = [];

  async create(registerCarDTO: RegisterCarDTO): Promise<Car> {
    const newCar = new Car();

    Object.assign(newCar, {
      ...registerCarDTO,
      available: true,
    });

    this.cars.push(newCar);

    return newCar;
  }

  async findById(id: string): Promise<Car | undefined> {
    return this.cars.find(car => car.id === id);
  }

  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    return this.cars.find(car => car.license_plate === license_plate);
  }

  async listAllCars(): Promise<Car[]> {
    return this.cars;
  }

  async listAvailableCars(): Promise<Car[]> {
    return this.cars;
  }

  async save(car: Car): Promise<Car> {
    const carIndex = this.cars.findIndex(item => item.id === car.id);

    if (carIndex < 0) {
      this.cars.push(car);
    } else {
      this.cars[carIndex] = car;
    }

    return car;
  }

  async remove(id: string): Promise<void> {
    const carIndex = this.cars.findIndex(car => car.id === id);

    this.cars.splice(carIndex, 1);
  }
}
