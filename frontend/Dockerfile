FROM node:18.19.0 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g @angular/cli
COPY . .

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]