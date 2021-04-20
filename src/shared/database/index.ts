import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export const getTypeormConnection = async (): Promise<Connection> => {
  const options = await getConnectionOptions();

  if (process.env.NODE_ENV !== 'docker') {
    Object.assign(options, {
      host: 'localhost',
    });
  }

  if (process.env.NODE_ENV === 'test') {
    Object.assign(options, {
      database: 'rent_api_test_db',
    });
  }

  return createConnection(options);
};
