### base image
FROM registry.access.redhat.com/ubi9/nodejs-20@sha256:f91e70850145174b6257c4536d2cdb8b0d6796e4220e022e1958b533d47db36d AS base

USER root
ENV CI=1

RUN npm install --global yarn

WORKDIR /opt/visual-qontract
COPY package.json yarn.lock ./
RUN yarn install --non-interactive --frozen-lockfile

COPY . .
RUN yarn build

### test image
FROM base AS test

# install dev deps as well
RUN yarn lint && yarn test 

### prod image
FROM registry.access.redhat.com/ubi9/nginx-124@sha256:cd49f0b20c71ade4babf4212869f850645d9f151591fe031d48739d213edd7d4 AS prod

COPY deployment/entrypoint.sh /
COPY deployment/nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=base /opt/visual-qontract/build /opt/visual-qontract/build

EXPOSE 8080
USER 1001
ENTRYPOINT ["/entrypoint.sh"]

