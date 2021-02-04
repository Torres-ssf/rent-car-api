import express from 'express';

export const app = express.Router();

app.get('/', (request, response) => {
  response.send('Hello World');
});
