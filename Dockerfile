FROM node:18.5-slim as dependencies
WORKDIR /seaport-oracle
COPY ./package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
RUN yarn install

FROM node:18.5-slim as builder
WORKDIR /seaport-oracle
COPY . .
COPY --from=dependencies /seaport-oracle/node_modules ./node_modules
WORKDIR /seaport-oracle/packages/react-app
RUN "../../node_modules/.bin/next" build

EXPOSE 3000
CMD "../../node_modules/.bin/next" start