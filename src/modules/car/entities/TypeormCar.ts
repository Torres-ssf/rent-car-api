import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Car } from '../models/Car';
import { TypeormCategory } from './TypeormCategory';

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

  @Column()
  category_id: string;

  @ManyToOne(() => TypeormCategory)
  @JoinColumn({ name: 'category_id' })
  category: TypeormCategory;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    super();
  }
}
