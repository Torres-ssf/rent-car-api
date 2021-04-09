import { TypeormCar } from '@modules/car/entities/TypeormCar';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CarImage } from '../models/CarImage';

@Entity('car_image')
export class TypeormCarImage extends CarImage {
  @PrimaryColumn()
  id: string;

  @Column()
  car_id: string;

  @ManyToOne(() => TypeormCar)
  @JoinColumn({ name: 'car_id' })
  car: TypeormCar;

  @Column()
  image_name: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    super();
  }
}
