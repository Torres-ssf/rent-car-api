import { genSalt, hash, compare } from 'bcrypt';
import { IHashProvider } from '../models/IHashProvider';
import { ICompareHashDTO } from '../dtos/ICompareHashDTO';

export class BcryptHashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    const salt = await this.generateSalt();

    return hash(payload, salt);
  }

  async generateSalt(): Promise<string> {
    return genSalt(8);
  }

  async compare({ hashed, payload }: ICompareHashDTO): Promise<boolean> {
    return compare(payload, hashed);
  }
}
