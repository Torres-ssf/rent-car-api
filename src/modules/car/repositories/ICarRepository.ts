import { ListAvailableCarsDTO } from '../dtos/ListAvailableCarsDTO';
import { Car } from '../models/Car';

export interface ICarRepository {
  findById(id: string): Promise<Car | undefined>;
  list(): Promise<Car[]>;
  listAvailableCars(data: ListAvailableCarsDTO): Promise<Car[]>;
  save(car: Car): Promise<Car>;
  remove(id: string): Promise<void>;
}
