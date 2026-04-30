### base image
FROM registry.access.redhat.com/ubi9/nodejs-20@sha256:2f5b48704fb02bbbd9bfe132b280946b2c09f6cabcb0c5d13216c46aa366ae67 AS base

USER root
ENV CI=1

WORKDIR /opt/visual-qontract
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

### test image
FROM base AS test

# Run linting and tests
RUN npm run lint && npm test -- --coverage --ci --watchAll=false

### prod image
FROM registry.access.redhat.com/ubi9/nginx-124@sha256:6cfc252017036e3a6b5eaff546ac72d1a2fe8d3aec1d3a4305f40cded79331e0 AS prod

# Copy nginx configuration and entrypoint
COPY deployment/nginx.conf /etc/nginx/nginx.conf
COPY deployment/entrypoint.sh /usr/local/bin/entrypoint.sh

# Copy built application
COPY --from=base /opt/visual-qontract/build /opt/visual-qontract/build

# Create necessary directories and fix permissions
USER root
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chmod +x /usr/local/bin/entrypoint.sh && \
    chown -R 1001:1001 /opt/visual-qontract/build \
    /var/cache/nginx \
    /var/log/nginx \
    /var/run \
    /etc/nginx

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Labels for better container management
LABEL name="visual-qontract" \
    version="2.0" \
    description="Visual Qontract - React frontend with nginx (PatternFly v6)" \
    maintainer="AppSRE Team"

EXPOSE 8080
USER 1001

# Use entrypoint script to template nginx config with environment variables
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
