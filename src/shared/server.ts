import { app } from './app';
import { getTypeormConnection } from './database';

const server = async () => {
  await getTypeormConnection();

  app.listen(3333, () => {
    console.log('App launched at 3333 🚀');
  });
};

server();
