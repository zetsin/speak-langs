FROM node:latest

RUN echo $NODE_ENV

RUN mkdir -p /app
COPY . /app

WORKDIR /app
RUN npm install --unsafe-perm
WORKDIR /app
RUN npm run build

EXPOSE 80
CMD npm run serve
