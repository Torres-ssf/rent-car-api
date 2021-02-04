import { Car } from 'modules/car/models/Car';
import { ICarRepository } from '../ICarRepository';

export class FakeCarRepository implements ICarRepository {
  private cars: Car[] = [];

  findById(id: string): Promise<Car | undefined> {
    throw new Error('Method not implemented.');
  }

  async save(car: Car): Promise<Car> {
    this.cars.push(car);
    return car;
  }

  remove(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
