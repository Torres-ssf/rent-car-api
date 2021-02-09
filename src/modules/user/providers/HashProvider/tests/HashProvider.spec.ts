import { FakeHashProvider } from '../fakes/FakeHashProvider';
import { IHashProvider } from '../models/IHashProvider';

describe('HashProvider', () => {
  let hashProvider: IHashProvider;

  beforeEach(async () => {
    hashProvider = new FakeHashProvider();
  });

  it('should hash the given payload', async () => {
    const payload = '123456';

    const hashed = await hashProvider.generateHash(payload);

    expect(payload !== hashed).toBeTruthy();
  });

  it('should return false for a wrong payload', async () => {
    const payload = '123456';

    const wrongPayload = '888888';

    const hashed = await hashProvider.generateHash(payload);

    await expect(
      hashProvider.compare({ hashed, payload: wrongPayload }),
    ).resolves.toBeFalsy();
  });

  it('should return true for the right payload', async () => {
    const payload = '123456';

    const hashed = await hashProvider.generateHash(payload);

    await expect(
      hashProvider.compare({ hashed, payload }),
    ).resolves.toBeTruthy();
  });
});
