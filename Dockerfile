FROM node:12.4.0-alpine

RUN mkdir -p /usr/app/notifications-ui-server
WORKDIR /usr/app/notifications-ui-server

COPY package.json /usr/app/notifications-ui-server

RUN npm install

COPY . /usr/app/notifications-ui-server

CMD ["npm", "start"]