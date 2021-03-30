import { CarDTO } from '@modules/car/dtos/CarDTO';

import { Transmission, Engine } from '../enums';

export class RegisterCarDTO extends CarDTO {
  model: string;

  brand: string;

  max_speed: number;

  horse_power: number;

  zero_to_one_hundred: number;

  engine: Engine;

  transmission: Transmission;

  passengers: number;

  daily_value: number;
}
