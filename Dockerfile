FROM node:latest

RUN mkdir -p /app
VOLUME /app
COPY . /app

WORKDIR /app
RUN npm install --unsafe-perm
RUN npm run build

CMD npm run serve
