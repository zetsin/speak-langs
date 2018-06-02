FROM node:latest

RUN mkdir -p /app
COPY . /app

WORKDIR /app
RUN npm install --unsafe-perm
RUN npm run build
VOLUME /app

EXPOSE 80
CMD npm run serve
