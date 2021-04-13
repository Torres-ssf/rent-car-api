import auth from '@config/auth';
import { sign } from 'jsonwebtoken';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider';

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
