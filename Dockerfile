### base image
FROM registry.access.redhat.com/ubi9/nodejs-20@sha256:a30f4d8b632eb048c294b1e1fc71c1e574e14ee89cef73101d76d561420f6504 AS base

USER root
ENV CI=1

# Install pnpm
RUN npm install -g pnpm

WORKDIR /opt/visual-qontract
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY . .
RUN pnpm run build

### test image
FROM base AS test

# install dev deps as well
RUN pnpm install --frozen-lockfile
RUN pnpm run lint && pnpm test -- --coverage --ci --watchAll=false

### prod image
FROM registry.access.redhat.com/ubi9/nginx-124@sha256:7acbb277f6922c47e55b5f65c39d7352e58de3dc6ecc2a7259011c88bf4d2249 AS prod

# Copy deployment files
COPY deployment/entrypoint.sh /
COPY deployment/nginx.conf.template /etc/nginx/nginx.conf.template

# Copy built application
COPY --from=base /opt/visual-qontract/build /opt/visual-qontract/build

# Create necessary directories and fix permissions
USER root
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R 1001:1001 /opt/visual-qontract/build \
    /var/cache/nginx \
    /var/log/nginx \
    /var/run \
    /etc/nginx && \
    chmod +x /entrypoint.sh

# Set up nginx to run as non-root
RUN sed -i 's/listen 80/listen 8080/' /etc/nginx/nginx.conf || true

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Labels for better container management
LABEL name="visual-qontract" \
    version="2.0" \
    description="Visual Qontract - React frontend with nginx (PatternFly v6)" \
    maintainer="AppSRE Team"

# Environment variables with defaults
ENV REACT_APP_GRAPHQL_ENDPOINT="http://localhost:4000/graphql" \
    REACT_APP_DATA_DIR_URL="https://path/to/data" \
    REACT_APP_DOCS_DIR_URL="https://path/to/docs" \
    REACT_APP_SCHEMAS_DIR="https://path/to/schemas" \
    REACT_APP_GRAFANA_URL="https://path/to/grafana" \
    AUTHORIZATION=""

EXPOSE 8080
USER 1001
ENTRYPOINT ["/entrypoint.sh"]
