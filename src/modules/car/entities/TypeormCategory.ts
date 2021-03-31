import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { Category } from '../models/Category';

@Entity('category')
export class TypeormCategory extends Category {
  constructor() {
    super();
  }

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
