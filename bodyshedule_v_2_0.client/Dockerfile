FROM node:20-alpine AS build
WORKDIR /app/src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build 
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "500"]

EXPOSE 4200
