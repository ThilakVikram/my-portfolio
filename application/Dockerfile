FROM node:24-alpine

WORKDIR /application
COPY ./package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["sh", "-c", "npm run db:makemigrations && npm start"]