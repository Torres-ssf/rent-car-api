import auth from '@config/auth';
import { sign } from 'jsonwebtoken';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { TypeormUser } from '../entities/TypeormUser';
import { User } from '../models/User';
import { IHashProvider } from '../../../shared/container/providers/HashProvider/models/IHashProvider';

type CreateDummyUserParams = Pick<
  User,
  'name' | 'email' | 'password' | 'admin' | 'driver_license'
>;

export const getAdminAuthToken = async (
  connection: Connection,
): Promise<string> => {
  const id = v4();

  const password = await container
    .resolve<IHashProvider>('HashProvider')
    .generateHash('aA123543');

  await connection.query(
    `INSERT INTO "user"(id, name, email, password, avatar, admin, created_at, updated_at, driver_license )
    values('${id}', 'admin', 'admin@email.com', '${password}', NULL, true, 'now()', 'now()', '${v4()}') `,
  );

  const { secret, expiresIn } = auth.jwt;

  const adminToken = sign({}, secret, {
    subject: id,
    expiresIn,
  });

  return adminToken;
};

export const getUserAuthToken = async (
  connection: Connection,
): Promise<string> => {
  const id = v4();

  const password = await container
    .resolve<IHashProvider>('HashProvider')
    .generateHash('aA123543');

  await connection.query(
    `INSERT INTO "user"(id, name, email, password, avatar, admin, created_at, updated_at, driver_license )
    values('${id}', 'John Doe', 'john@email.com', '${password}', NULL, false, 'now()', 'now()', '${v4()}') `,
  );

  const { secret, expiresIn } = auth.jwt;

  const adminToken = sign({}, secret, {
    subject: id,
    expiresIn,
  });

  return adminToken;
};

export const createDummyUser = async (
  connection: Connection,
  userParams: CreateDummyUserParams,
): Promise<void> => {
  const hashProvider = container.resolve<IHashProvider>('HashProvider');

  await connection
    .createQueryBuilder()
    .insert()
    .into(TypeormUser)
    .values({
      id: v4(),
      ...userParams,
      password: await hashProvider.generateHash(userParams.password),
    })
    .execute();
};
