### base image
FROM registry.access.redhat.com/ubi8/nodejs-20 AS base

USER root
ENV CI=1

RUN npm install --local=global yarn

WORKDIR /opt/visual-qontract
COPY . .
RUN yarn install --production --non-interactive && yarn build

### test image
FROM base AS test

RUN yarn lint && yarn test 

### prod image
FROM registry.access.redhat.com/ubi8/nginx-124 AS prod

COPY deployment/entrypoint.sh /
COPY deployment/nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=base /opt/visual-qontract/build /opt/visual-qontract/build

EXPOSE 8080
USER 1001
ENTRYPOINT ["/entrypoint.sh"]

