import { ListAvailableCarsDTO } from '@modules/car/dtos/ListAvailableCarsDTO';
import { Car } from 'modules/car/models/Car';
import { ICarRepository } from '../ICarRepository';

export class FakeCarRepository implements ICarRepository {
  private cars: Car[] = [];

  async findById(id: string): Promise<Car | undefined> {
    return this.cars.find(car => car.id === id);
  }

  async list(): Promise<Car[]> {
    return this.cars;
  }

  async listAvailableCars(data: ListAvailableCarsDTO): Promise<Car[]> {
    return this.cars;
  }

  async save(car: Car): Promise<Car> {
    this.cars.push(car);
    return car;
  }

  async remove(id: string): Promise<void> {
    const carIndex = this.cars.findIndex(car => car.id === id);

    this.cars.splice(carIndex, 1);
  }
}
