import { v4 } from 'uuid';

export class Category {
  id: string;

  name: string;

  description: string;

  created_at: Date;

  constructor() {
    this.id = v4();
    this.created_at = new Date();
  }
}
