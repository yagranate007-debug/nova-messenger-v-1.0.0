FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

RUN npx prisma generate --schema=./prisma/schema.prisma

RUN npm run build

EXPOSE 3000

CMD ["node","dist/main.js"]