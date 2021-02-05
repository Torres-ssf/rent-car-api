export class Car {
  id: string;

  model: string;

  brand: string;

  max_speed: number;

  horse_power: number;

  zero_to_one_hundred: number;

  engine: 'gas' | 'hybrid' | 'eletric';

  transmission: 'manual' | 'automatic';

  passengers: number;

  daily_value: number;

  created_at: Date;

  updated_at: Date;
}
