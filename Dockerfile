FROM node:lateset

EXPOSE 80

RUN mkdir -p /app
COPY . /app
VOLUME /app

WORKDIR /app
RUN npm install
RUN npm run build
RUN npm run serve
