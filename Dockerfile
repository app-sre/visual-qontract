### base image
FROM registry.access.redhat.com/ubi9/nodejs-20@sha256:0b3efb944852c4bed1711dda1b89e0f95f214faaf74506268490b497139327b5 AS base

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
FROM registry.access.redhat.com/ubi9/nginx-124@sha256:9afdbf36dfc8204878f058f77dcc8c869d58af5aa9a10122c5f15e1038659439 AS prod

COPY deployment/entrypoint.sh /
COPY deployment/nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=base /opt/visual-qontract/build /opt/visual-qontract/build

EXPOSE 8080
USER 1001
ENTRYPOINT ["/entrypoint.sh"]

