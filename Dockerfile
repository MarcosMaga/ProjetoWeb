FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install --build-from-source

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "sleep 30 && npx prisma migrate deploy && node app.js"]