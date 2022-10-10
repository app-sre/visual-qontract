FROM registry.access.redhat.com/ubi8/nodejs-16

USER root

COPY deployment/nginx.conf.template /etc/nginx/nginx.conf.template
COPY deployment/entrypoint.sh /
ADD . /opt/visual-qontract

RUN dnf -y update-minimal --security --sec-severity=Important --sec-severity=Critical && \
    dnf install -y nginx && \
    dnf clean all

RUN chmod 777 /var/log/nginx /var/run && \
    chmod -R 777 /var/lib/nginx && \
    chmod 666 /etc/nginx/nginx.conf && \
    rm -rf /var/log/nginx/*

RUN npm install --location=global yarn

WORKDIR /opt/visual-qontract

RUN yarn --production --non-interactive && \
    yarn build && \
    rm -rf node_modules

EXPOSE 8080
USER 1001
ENTRYPOINT ["/entrypoint.sh"]
