FROM node:14

WORKDIR /app

RUN yarn set version berry

COPY .yarn ./.yarn

COPY .yarnrc.yml ./

COPY yarn.lock ./

COPY .pnp.js ./

COPY package*.json ./

RUN yarn

COPY ../.. .

EXPOSE 8080

CMD [ "yarn", "start" ]
