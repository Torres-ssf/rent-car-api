import { hash } from 'bcrypt';
import { v4 } from 'uuid';
import { getTypeormConnection } from '../index';

async function createAdmin() {
  const connection = await getTypeormConnection();

  const id = v4();

  const password = await hash('Aa123456', 8);

  await connection.query(
    `INSERT INTO "user"(id, name, email, password, admin, driver_license )
    VALUES('${id}', 'John Admin', 'john.admin@email.com', '${password}', true, '${v4()}') `,
  );
}

createAdmin().then(() => console.log('Admin user created'));
