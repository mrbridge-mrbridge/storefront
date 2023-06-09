FROM node:lts-bullseye-slim@sha256:d93fb5c25db163dc795d40eabf66251a2daf6a2c6a2d21cc29930e754aef4c2c as builder

WORKDIR /usr/app

# Install dependencies based on the preferred package manager
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn config set unsafe-perm true

RUN npm pkg delete scripts.postinstall

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

#----- Staging
FROM node:lts-bullseye-slim@sha256:d93fb5c25db163dc795d40eabf66251a2daf6a2c6a2d21cc29930e754aef4c2c as stager

ENV NODE_ENV production
WORKDIR /usr/app

RUN yarn config set unsafe-perm true

COPY --from=builder /usr/app/package.json ./
COPY --from=builder /usr/app/yarn.lock ./

RUN npm pkg delete scripts.postinstall

RUN yarn install --prod

#----- Production
FROM node:lts-bullseye-slim@sha256:d93fb5c25db163dc795d40eabf66251a2daf6a2c6a2d21cc29930e754aef4c2c as prod

WORKDIR /usr/app
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

COPY --from=stager /usr/app/package.json ./
COPY --from=stager /usr/app/yarn.lock ./
COPY --from=builder /usr/app/dist ./dist
COPY --from=stager /usr/app/node_modules ./node_modules

RUN chown -R node /usr/app

EXPOSE 3001

USER node
CMD ["yarn", "start"]
