import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Car } from '../models/Car';
import { Category } from '../models/Category';

@Entity('car')
export class TypeormCar extends Car {
  @PrimaryColumn()
  id: string;

  @Column()
  model: string;

  @Column()
  brand: string;

  @Column()
  max_speed: number;

  @Column()
  horse_power: number;

  @Column()
  zero_to_one_hundred: number;

  @Column()
  license_plate: string;

  @Column()
  daily_value: number;

  @Column()
  fine_amount: number;

  @Column()
  available: boolean;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    super();
  }
}
