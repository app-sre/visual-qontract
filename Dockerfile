### base image
FROM registry.access.redhat.com/ubi9/nodejs-20@sha256:9132b1644a1470d57cea9bcc563077cbab9bd476e5d0ef942599020957807539 AS base

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
FROM registry.access.redhat.com/ubi9/nginx-124@sha256:07547973a7e10860b474a331727ab7ecd9f30a2ab15f4a7ff024c3fec7dc80ba AS prod

COPY deployment/entrypoint.sh /
COPY deployment/nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=base /opt/visual-qontract/build /opt/visual-qontract/build

EXPOSE 8080
USER 1001
ENTRYPOINT ["/entrypoint.sh"]

