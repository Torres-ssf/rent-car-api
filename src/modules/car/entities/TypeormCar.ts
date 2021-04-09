import { TypeormCarImage } from '@modules/carImage/entities/TypeormCarImage';
import { TypeormSpecification } from '@modules/specification/entities/TypeormSpecification';
import { Specification } from '@modules/specification/models/Specification';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  @ManyToMany(() => TypeormSpecification)
  @JoinTable({
    name: 'specification_car',
    joinColumn: { name: 'car_id' },
    inverseJoinColumn: { name: 'specification_id' },
  })
  specifications: Specification[];

  @OneToMany(() => TypeormCarImage, carImage => carImage.car)
  images: TypeormCarImage[];

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    super();
  }
}
