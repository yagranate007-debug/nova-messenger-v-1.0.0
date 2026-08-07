FROM node:20 AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm install

COPY backend .

RUN npx prisma generate
RUN npm run build


FROM node:20 AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend .

RUN npm run build


FROM node:20

WORKDIR /app

COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/package.json ./backend/package.json

COPY --from=frontend-build /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

EXPOSE 8080

CMD ["npm","run","start:prod"]