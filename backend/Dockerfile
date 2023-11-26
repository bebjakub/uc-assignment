###################
# BUILD FOR PRODUCTION
###################

# Installing dependencies:

FROM node:18-alpine AS install-dependencies

WORKDIR /usr/src/app

COPY ./backend/package.json ./backend/package-lock.json ./

RUN npm ci --omit=dev

COPY .env .

COPY ./backend .


# Creating a build:

FROM node:18-alpine AS create-build

WORKDIR /usr/src/app

COPY --from=install-dependencies /usr/src/app ./

RUN npm run build

USER node


# Running the application:

FROM node:18-alpine AS run

WORKDIR /usr/src/app

COPY --from=install-dependencies /usr/src/app/node_modules ./node_modules
COPY --from=create-build /usr/src/app/dist ./dist
COPY --from=install-dependencies /usr/src/app/package.json ./
COPY --from=install-dependencies /usr/src/app/.env ./

CMD ["npm", "run", "start:prod"]
