import { v4 } from 'uuid';

export class Category {
  id: string;

  name: string;

  description: string;

  created_at: string;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}
