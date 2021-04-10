import { CreateRentalDTO } from '@modules/rental/dtos/CreateRentalDTO';
import { TypeormRental } from '@modules/rental/entities/TypeormRental';
import { Status } from '@modules/rental/enums/Status';
import { Rental } from '@modules/rental/models/Rental';
import { getRepository, Repository } from 'typeorm';
import { IRentalRepository } from '../IRentalRepository';

export class TypeormRentalRepository implements IRentalRepository {
  private readonly repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(TypeormRental);
  }

  create(createRentalDTO: CreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      ...createRentalDTO,
      status: Status.Open,
    });

    return this.repository.save(rental);
  }

  findOpenRentalForCar(car_id: string): Promise<Rental | undefined> {
    return this.repository.findOne({ where: { car_id, status: Status.Open } });
  }

  findOpenRentalForUser(user_id: string): Promise<Rental | undefined> {
    return this.repository.findOne({ where: { user_id, status: Status.Open } });
  }

  save(rental: Rental): Promise<Rental> {
    return this.repository.save(rental);
  }
}
