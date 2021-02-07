import { Engine, Transmission } from './enums';

export class Car {
  id: string;

  model: string;

  brand: string;

  max_speed: number;

  horse_power: number;

  zero_to_one_hundred: number;

  engine: Engine;

  transmission: Transmission;

  passengers: number;

  daily_value: number;

  created_at: Date;

  updated_at: Date;
}
