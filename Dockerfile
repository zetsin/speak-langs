FROM node:latest

RUN mkdir -p /app
COPY . /app
VOLUME /app

WORKDIR /app
RUN npm install --unsafe-perm
RUN npm run build

EXPOSE 80
CMD npm run serve
