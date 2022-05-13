### Build stage ###
FROM node:16 as builder
WORKDIR /app
COPY . /app
RUN npm install --force &&  \
    npm run build --prod

### Webserver stage ###
FROM nginx:latest
COPY /etc/nginx/ /etc/nginx/conf.d/
RUN rm -f -r /usr/share/nginx/html/* 
COPY --from=builder /app/dist/ibsys /usr/share/nginx/html