import { CarImage } from '@modules/carImage/models/CarImage';
import { Specification } from '@modules/specification/models/Specification';
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

  specifications: Specification[];

  images: CarImage[];

  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = v4();
      this.created_at = new Date();
    }
  }
}
