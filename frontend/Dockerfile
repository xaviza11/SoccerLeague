# Frontend (Nuxt)
FROM node:22-alpine

RUN npm install -g npm@11.7.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "up"]
