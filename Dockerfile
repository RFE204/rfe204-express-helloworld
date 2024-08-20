FROM node:21.6.2

ARG DATABASE_URL

WORKDIR /app

COPY package.json .

RUN npm install

COPY . /app/

RUN npx prisma generate
RUN npx prisma db push

ENV DATABASE_URL=$DATABASE_URL

EXPOSE 3000

CMD [ "node", "app.js" ]