import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enums/Status';
import { Rental } from '../models/Rental';

@Entity('rental')
export class TypeormRental extends Rental {
  @PrimaryColumn()
  id: string;

  @Column()
  car_id: string;

  @Column()
  user_id: string;

  @Column()
  start_date: Date;

  @Column()
  expected_return_date: Date;

  @Column()
  returned_date: Date | null;

  @Column()
  status: Status;

  @Column()
  car_daily_value: number;

  @Column()
  car_daily_fine: number;

  @Column()
  estimated_total: number;

  @Column()
  total: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    super();
  }
}
