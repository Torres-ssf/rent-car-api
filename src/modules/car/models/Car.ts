import { v4 } from 'uuid';

export class Car {
  id: string;

  model: string;

  brand: string;

  max_speed: number;

  horse_power: number;

  zero_to_one_hundred: number;

  license_plate: string;

  daily_value: number;

  fine_amount: number;

  available: boolean;

  category_id: string;

  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = v4();
      this.created_at = new Date();
    }
  }
}
