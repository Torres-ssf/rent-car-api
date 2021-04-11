import { v4 } from 'uuid';
import { Status } from '../enums/Status';

export class Rental {
  id: string;

  car_id: string;

  user_id: string;

  start_date: Date;

  expected_return_date: Date;

  returned_date: Date | null;

  status: Status;

  car_daily_value: number;

  car_daily_fine: number;

  estimated_total: number;

  total: number | null;

  created_at: Date;

  updated_at: Date;

  constructor() {
    const now = new Date();

    this.id = v4();
    this.created_at = now;
    this.updated_at = now;
  }
}
