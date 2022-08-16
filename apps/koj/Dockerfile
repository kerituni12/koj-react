# FROM node:16 as nx-base
# # ARG NODE_ENV
# # ARG BUILD_FLAG
# WORKDIR /app/builder
# RUN npm i -g pnpm@7

# COPY .npmrc pnpm-lock.yaml package.json ./
# COPY libs/ckeditor-lib ./libs/ckeditor-lib
# COPY ckeditor5-build-classic ./ckeditor5-build-classic
# COPY ckeditor-export ./ckeditor-export

# RUN pnpm i
# RUN pnpm add nx@latest

# FROM nx-base AS builder

# WORKDIR /app

# COPY . ./app

# RUN npx nx

# RUN pnpm nx build koj

FROM nginx:alpine as build

WORKDIR /app

COPY . ./

# nginx state for serving content
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

RUN pwd
COPY --from=build /app/dist/apps/koj ./
# COPY --from=build /app/apps/koj/.nginx/nginx.conf /etc/nginx/nginx.conf

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
