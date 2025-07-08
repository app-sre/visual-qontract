### base image
FROM registry.access.redhat.com/ubi9/nodejs-20@sha256:92c0a555301e3b21ecfea8adf461cb34515d87912932e4bcc5cdc434b183a750 AS base

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
FROM registry.access.redhat.com/ubi9/nginx-124@sha256:dccc713fd31160a77dd9fc0ba1032c64d3d4a68bd24e6128ec115df713847b6c AS prod

COPY deployment/entrypoint.sh /
COPY deployment/nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=base /opt/visual-qontract/build /opt/visual-qontract/build

EXPOSE 8080
USER 1001
ENTRYPOINT ["/entrypoint.sh"]

