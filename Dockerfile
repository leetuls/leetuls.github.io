# 1. For build React app
FROM node:20.11.1-alpine3.19 AS builder
# Set working directory
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build


# 2. For Nginx setup
FROM nginx:1.19-alpine

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /app/dist .