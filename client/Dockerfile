FROM node:12.4.0-alpine as builder

RUN mkdir -p /usr/app/notifications-ui-client
WORKDIR /usr/app/notifications-ui-client

COPY package.json /usr/app/notifications-ui-client
RUN npm install
COPY . /usr/app/notifications-ui-client
RUN npm run build

FROM nginx:latest
RUN rm -rf /etc/nginx/conf.d
RUN rm -rf /usr/share/nginx/html/*
COPY conf /etc/nginx
COPY --from=builder /usr/app/notifications-ui-client/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]