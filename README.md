# visual-qontract

visual-qontract is the web UI for the data served by AppSRE's team [qontract-server](https://github.com/app-sre/qontract-server/) instance.

It is written in [React](https://reactjs.org/) and uses [PatternFly 6](https://www.patternfly.org/) as the UI framework.

## Quick Start

### Using Docker/Podman

```sh
$ podman build -t visual-qontract .
$ podman run -d -p 8080:8080 visual-qontract
```

The visual-qontract UI will be available at http://localhost:8080

### Using Compose

```sh
$ podman compose up
```

The visual-qontract UI will be available at http://localhost:8080

## Development Environment

```sh
# Install dependencies
$ npm install --legacy-peer-deps

# Start development server
$ npm start
```

The development server will run on http://localhost:3000 with hot reloading.

## Building for Production

```sh
# Build the application
$ npm run build

# Build artifacts will be in the build/ directory
```

## Environment Configuration

Runtime configuration is injected via ConfigMap mount in Kubernetes/OpenShift deployments. For local development, the application uses sensible defaults.

See `APP_INTERFACE_CHANGES.md` for deployment configuration details.

## Documentation

- `UPGRADE.md` - Complete upgrade guide from PatternFly 3 to PatternFly 6
- `APP_INTERFACE_CHANGES.md` - Deployment configuration changes
- `DEPLOYMENT_SIMPLIFICATION.md` - ConfigMap mount approach explanation
- `deployment/openshift/README.md` - OpenShift deployment guide
