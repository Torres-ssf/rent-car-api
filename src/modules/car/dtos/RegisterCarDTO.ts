import { CarDTO } from '@modules/car/dtos/CarDTO';

export class RegisterCarDTO extends CarDTO {
  model: string;

  brand: string;

  max_speed: number;

  horse_power: number;

  zero_to_one_hundred: number;

  daily_value: number;

  license_plate: string;

  fine_amount: number;

  category_id: string;
}
