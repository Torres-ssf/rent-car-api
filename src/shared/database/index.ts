import { appEnv } from '@config/environment';
import { createConnection, getConnectionOptions } from 'typeorm';

interface IOptions {
  database: string;
}

if (appEnv !== 'test') {
  createConnection();
} else {
  getConnectionOptions().then(options => {
    const newOptions = options as IOptions;

    newOptions.database = 'rent_api_test_db';

    createConnection({
      ...options,
    });
  });
}
