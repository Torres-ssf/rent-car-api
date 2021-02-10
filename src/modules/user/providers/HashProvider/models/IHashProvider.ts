import { ICompareHashDTO } from '../dtos/ICompareHashDTO';

export interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  generateSalt(): Promise<string>;
  compare(compareHashDTO: ICompareHashDTO): Promise<boolean>;
}
