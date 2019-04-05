FROM centos:7

# Set PATH, because "scl enable" does not have any effects to "docker build"
ENV PATH /opt/rh/rh-nodejs10/root/usr/bin:$PATH

RUN yum install -y centos-release-scl-rh epel-release && \
    yum install -y rh-nodejs10 rh-nodejs10-npm nginx && \
    yum clean all && \
    npm install -g yarn

RUN chmod 777 /var/log/nginx /var/run && \
    rm -rf /var/log/nginx/*

COPY deployment/nginx.conf.template /etc/nginx/nginx.conf.template
COPY deployment/entrypoint.sh /
ADD . /opt/visual-qontract

WORKDIR /opt/visual-qontract

RUN yarn --production --non-interactive && \
    yarn build && \
    rm -rf node_modules

EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
