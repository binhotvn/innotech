# Stage 1: Build the Next.js application
FROM node:16-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN yarn install

COPY . .
RUN yarn build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]