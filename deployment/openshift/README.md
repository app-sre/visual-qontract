# OpenShift Deployment Guide

This directory contains OpenShift/Kubernetes manifests for deploying the Visual App Interface application.

## Overview

The deployment uses a runtime environment variable injection approach that allows the same container image to be used across different environments (dev, staging, production) with different configurations.

## Architecture

- **Container**: Nginx serving the React build with runtime environment injection
- **Configuration**: Environment variables are injected at container startup
- **Secrets**: Sensitive data (API tokens) stored in Kubernetes secrets
- **ConfigMaps**: Non-sensitive configuration stored in ConfigMaps

## Files

- `deployment.yaml` - Main application deployment
- `service.yaml` - Kubernetes service
- `route.yaml` - OpenShift route for external access
- `configmap.yaml` - Configuration for different environments
- `secret.yaml` - Secrets (API tokens, etc.)
- `kustomization.yaml` - Kustomize configuration
- `deployment-patches.yaml` - Environment-specific patches

## Deployment Steps

### 1. Create Namespace (if needed)

```bash
oc new-project visual-app-interface
```

### 2. Create Secrets

Replace the placeholder tokens with your actual API tokens:

```bash
# Production
oc create secret generic visual-app-interface-secrets \
  --from-literal=authorization-token="Bearer your-production-token"

# Staging
oc create secret generic visual-app-interface-secrets-staging \
  --from-literal=authorization-token="Bearer your-staging-token"

# Development
oc create secret generic visual-app-interface-secrets-dev \
  --from-literal=authorization-token="Bearer your-dev-token"
```

### 3. Update ConfigMaps

Edit `configmap.yaml` to match your environment URLs:

```yaml
data:
  graphql-endpoint: "https://your-api.example.com/graphql"
  data-dir-url: "https://your-data.example.com"
  docs-dir-url: "https://your-docs.example.com"
  schemas-dir: "https://your-schemas.example.com"
  grafana-url: "https://your-grafana.example.com"
```

### 4. Deploy Application

```bash
# Apply all manifests
oc apply -f .

# Or use kustomize
oc apply -k .
```

### 5. Verify Deployment

```bash
# Check deployment status
oc get deployment visual-app-interface

# Check pods
oc get pods -l app=visual-app-interface

# Check logs
oc logs -l app=visual-app-interface

# Get route URL
oc get route visual-app-interface
```

## Environment Variables

The application supports the following environment variables:

### Required
- `REACT_APP_GRAPHQL_ENDPOINT` - GraphQL API endpoint URL
- `AUTHORIZATION` - API authorization token

### Optional
- `REACT_APP_DATA_DIR_URL` - Data directory URL
- `REACT_APP_DOCS_DIR_URL` - Documentation URL
- `REACT_APP_SCHEMAS_DIR` - Schemas directory URL
- `REACT_APP_GRAFANA_URL` - Grafana dashboard URL

## Environment-Specific Deployments

### Development
```bash
# Use development ConfigMap and Secret
oc patch deployment visual-app-interface -p '{"spec":{"template":{"spec":{"containers":[{"name":"visual-app-interface","env":[{"name":"REACT_APP_GRAPHQL_ENDPOINT","valueFrom":{"configMapKeyRef":{"name":"visual-app-interface-config-dev","key":"graphql-endpoint"}}},{"name":"AUTHORIZATION","valueFrom":{"secretKeyRef":{"name":"visual-app-interface-secrets-dev","key":"authorization-token"}}}]}]}}}}'
```

### Staging
```bash
# Use staging ConfigMap and Secret
oc patch deployment visual-app-interface -p '{"spec":{"template":{"spec":{"containers":[{"name":"visual-app-interface","env":[{"name":"REACT_APP_GRAPHQL_ENDPOINT","valueFrom":{"configMapKeyRef":{"name":"visual-app-interface-config-staging","key":"graphql-endpoint"}}},{"name":"AUTHORIZATION","valueFrom":{"secretKeyRef":{"name":"visual-app-interface-secrets-staging","key":"authorization-token"}}}]}]}}}}'
```

## Health Checks

The application includes health check endpoints:

- `/health` - Simple health check that returns "healthy"
- Container liveness and readiness probes are configured

## Security

- Runs as non-root user (UID 1001)
- Security context configured with minimal privileges
- Secrets are properly mounted and not exposed in logs
- HTTPS termination at the route level

## Troubleshooting

### Check Environment Variables
```bash
oc exec deployment/visual-app-interface -- env | grep REACT_APP
```

### Check Configuration Injection
```bash
oc exec deployment/visual-app-interface -- cat /opt/visual-app-interface/build/env-config.js
```

### Check Nginx Configuration
```bash
oc exec deployment/visual-app-interface -- cat /etc/nginx/nginx.conf
```

### View Logs
```bash
# Application logs
oc logs -l app=visual-app-interface -f

# Previous container logs (if crashed)
oc logs -l app=visual-app-interface --previous
```

## Scaling

```bash
# Scale up
oc scale deployment visual-app-interface --replicas=3

# Scale down
oc scale deployment visual-app-interface --replicas=1
```

## Building and Pushing Images

### Using Podman

```bash
# Build the image
podman build -t visual-qontract-v2:latest .

# Tag for registry
podman tag visual-qontract-v2:latest registry.example.com/visual-qontract-v2:latest

# Login to registry
podman login registry.example.com

# Push to registry
podman push registry.example.com/visual-qontract-v2:latest
```

### Using OpenShift Build Configs

```bash
# Create build config from Dockerfile
oc new-build --strategy docker --binary --name visual-app-interface

# Start build from local directory
oc start-build visual-app-interface --from-dir . --follow

# Tag the built image
oc tag visual-app-interface:latest visual-app-interface:v1.0.0
```

## Updates

To update the application:

1. Build and push new container image
2. Update the image tag in the deployment
3. Apply the changes

```bash
# Using Podman
podman build -t visual-qontract-v2:new-tag .
podman push registry.example.com/visual-qontract-v2:new-tag

# Update image in OpenShift
oc set image deployment/visual-app-interface visual-app-interface=registry.example.com/visual-qontract-v2:new-tag

# Check rollout status
oc rollout status deployment/visual-app-interface
```
