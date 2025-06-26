### base image
FROM registry.access.redhat.com/ubi9/nodejs-20@sha256:744717c539514610ee1fe0829831607fb52188925dd567c0374ae32b32dab0ee AS base

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
FROM registry.access.redhat.com/ubi9/nginx-124@sha256:12c0a6a8ab30574d1eca8aaa2135777e96473f3713011ca6bbf1c419b1f26c27 AS prod

COPY deployment/entrypoint.sh /
COPY deployment/nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=base /opt/visual-qontract/build /opt/visual-qontract/build

EXPOSE 8080
USER 1001
ENTRYPOINT ["/entrypoint.sh"]

