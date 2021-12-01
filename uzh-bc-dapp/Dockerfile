FROM nginx:1.20.1-alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY dist/uzh-bc-dapp .

EXPOSE 80
