import { v4 } from 'uuid';

export class Specification {
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
