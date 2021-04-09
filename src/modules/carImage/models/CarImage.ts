import { v4 } from 'uuid';

export class CarImage {
  id: string;

  car_id: string;

  image_name: string;

  created_at: Date;

  constructor() {
    this.id = v4();
    this.created_at = new Date();
  }
}
