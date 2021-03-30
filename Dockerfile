FROM node:lts-alpine

WORKDIR /usr/app

COPY package.json ./

RUN yarn

COPY . .

COPY ormconfig.example.json ./ormconfig.json

EXPOSE 3333

CMD ["yarn", "start:dev"]

