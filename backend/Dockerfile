# Stage 1: Development
ARG SENTRY_AUTH_TOKEN
FROM node:18-alpine AS development
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN yarn install --production 
RUN yarn global add @nestjs/cli

# Install sentry-cli globally for later use
RUN yarn global add @sentry/cli

# Stage 2: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copy the application code and dependencies
COPY . .
COPY --from=development /app/node_modules ./node_modules
RUN yarn global add @nestjs/cli

# Install sentry-cli in build stage
RUN yarn global add @sentry/cli


# Build the application
RUN yarn build

# Clean up unnecessary dependencies
RUN yarn install --production --prefer-offline

# Stage 3: Production
FROM node:18-alpine AS production
WORKDIR /app

# Copy necessary files from build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
RUN yarn global add @nestjs/cli

# Install sentry-cli in production stage
RUN yarn global add @sentry/cli

# Sentry Release
RUN if [ -n "$SENTRY_AUTH_TOKEN" ]; then sentry-cli releases finalize "$(sentry-cli releases propose-version)"; fi

CMD [ "yarn", "start:prod" ]
