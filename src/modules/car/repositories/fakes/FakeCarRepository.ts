import { ListAvailableCarsDTO } from '@modules/car/dtos/ListAvailableCarsDTO';
import { RegisterCarDTO } from '@modules/car/dtos/RegisterCarDTO';
import { Car } from '@modules/car/models/Car';
import { carRoutes } from '@modules/car/routes/car.routes';
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

  async listAvailableCars(
    listAvailableCarsDTO: ListAvailableCarsDTO,
  ): Promise<Car[]> {
    const { category_id, brand, model } = listAvailableCarsDTO;

    let cars = this.cars.filter(car => car.available);

    if (category_id) {
      cars = cars.filter(car => car.category_id === category_id);
    }

    if (brand) {
      cars = cars.filter(car => car.brand.includes(brand));
    }

    if (model) {
      cars = cars.filter(car => car.model.includes(model));
    }

    return cars;
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
