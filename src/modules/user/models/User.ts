import { v4 } from 'uuid';

export class User {
  id: string;

  name: string;

  image: string | null;

  email: string;

  password: string;

  driver_license: string;

  admin: boolean;

  created_at: Date;

  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}
