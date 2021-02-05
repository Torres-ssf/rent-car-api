import { Car } from 'modules/car/models/Car';
import { ICarRepository } from '../ICarRepository';

export class FakeCarRepository implements ICarRepository {
  private cars: Car[] = [];

  async findById(id: string): Promise<Car | undefined> {
    return this.cars.find(car => car.id === id);
  }

  async save(car: Car): Promise<Car> {
    this.cars.push(car);
    return car;
  }

  remove(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
