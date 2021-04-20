import { v4 } from 'uuid';

export class User {
  id: string;

  name: string;

  email: string;

  avatar: string | null;

  password: string;

  driver_license: string;

  admin: boolean;

  created_at: Date;

  updated_at: Date;

  constructor() {
    const now = new Date();

    this.id = v4();
    this.created_at = now;
    this.updated_at = now;
  }
}
