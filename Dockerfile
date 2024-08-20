FROM node:21.6.2


WORKDIR /app


COPY package.json .

RUN npm install

COPY . /app/

RUN npx prisma generate
RUN npx prisma db push

EXPOSE 3000

CMD [ "node", "app.js" ]