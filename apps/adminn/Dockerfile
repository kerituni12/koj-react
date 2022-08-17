FROM nginx:alpine as build

WORKDIR /app

COPY . ./

# nginx state for serving content
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

RUN pwd
COPY --from=build /app/dist/apps/adminn ./
COPY --from=build /app/apps/adminn/.nginx/nginx.conf /etc/nginx/nginx.conf

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
