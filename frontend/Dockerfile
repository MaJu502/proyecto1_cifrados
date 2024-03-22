# Etapa de construcción para compilar la aplicación Angular
FROM node:18.17.0 AS builder
WORKDIR /usr/frontend/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:latest
RUN apt-get update && apt-get install -y nginx
COPY --from=builder /usr/frontend/src/app/dist/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
