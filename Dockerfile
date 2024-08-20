FROM node:21.6.2

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

COPY package.json .

RUN npm install

COPY . /app/

RUN npx prisma generate
RUN npx prisma db push


EXPOSE 3000

CMD [ "node", "server.js" ]