FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN apk add --no-cache netcat-openbsd

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]