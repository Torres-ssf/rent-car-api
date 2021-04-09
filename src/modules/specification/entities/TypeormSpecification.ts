import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { Specification } from '../models/Specification';

@Entity('specification')
export class TypeormSpecification extends Specification {
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
