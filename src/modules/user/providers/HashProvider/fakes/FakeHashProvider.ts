import crypto from 'crypto';
import { IHashProvider } from '../models/IHashProvider';
import { ICompareHashDTO } from '../dtos/ICompareHashDTO';

export class FakeHashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    const hashedString = crypto.randomBytes(10).toString('hex');

    const salt = await this.generateSalt();

    return payload.concat(hashedString).concat(salt);
  }

  async generateSalt(): Promise<string> {
    return crypto.randomBytes(4).toString('hex');
  }

  async compare({ hashed, payload }: ICompareHashDTO): Promise<boolean> {
    return hashed.includes(payload);
  }
}
