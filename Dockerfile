FROM node:18.5-slim as dependencies
WORKDIR /cancelx
COPY ./package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
RUN yarn install

FROM node:18.5-slim as builder
WORKDIR /cancelx
COPY . .
COPY --from=dependencies /cancelx/node_modules ./node_modules
WORKDIR /cancelx/packages/react-app
RUN "../../node_modules/.bin/next" build

EXPOSE 3000
CMD "../../node_modules/.bin/next" start