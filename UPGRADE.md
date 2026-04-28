# Visual-Qontract Upgrade: PatternFly 3 → PatternFly 6

## Overview

This document describes the major upgrade of visual-qontract from PatternFly 3 to PatternFly 6, including migrations to React 19, TypeScript, modern Apollo Client, and updated build infrastructure.

## Upgrade Summary

### Version Changes

| Component | Before | After |
|-----------|--------|-------|
| **UI Framework** | PatternFly 3.16.10 (patternfly-react) | PatternFly 6.3.1 (@patternfly/react-core) |
| **React** | 16.8.6 | 19.1.1 |
| **React Router** | 5.0.0 | 7.9.0 |
| **GraphQL Client** | apollo-boost 0.4.1 + react-apollo 2.5.3 | @apollo/client 4.0.5 |
| **Language** | JavaScript | TypeScript 4.9.5 |
| **Package Manager** | Yarn Classic | npm |
| **Build Tools** | react-scripts 2.1.8 | Custom webpack 5 + modern tooling |

## What Was Upgraded

### 1. UI Framework: PatternFly 3 → 6

#### Major Changes
- **Complete component API rewrite**: All PatternFly components have new APIs
- **New component library**: `patternfly-react` → `@patternfly/react-core`, `@patternfly/react-table`, `@patternfly/react-icons`
- **Layout system**: VerticalNav → Page/Masthead/PageSidebar/PageSection components
- **Icon system**: Font-based icons → React icon components from `@patternfly/react-icons`
- **Theming**: Built-in dark mode support with ThemeContext

#### Breaking Changes
- All component prop names and structures changed
- Navigation components completely redesigned
- Table components have new API
- Form components have new validation system

### 2. React 16 → 19

#### Changes
- **Hooks-based**: All class components migrated to functional components with hooks
- **Concurrent Features**: Support for React 19's concurrent rendering
- **New JSX Transform**: Automatic JSX runtime (no need to import React)
- **Improved TypeScript**: Better type inference and stricter types

#### Migration Impact
- Replaced class components with functional components
- Used `useState`, `useEffect`, `useCallback` instead of lifecycle methods
- Removed `PropTypes` (replaced with TypeScript types)
- Removed `withRouter` (replaced with hooks like `useNavigate`, `useParams`)

### 3. Apollo Client Upgrade

#### Changes
- **Unified Package**: `apollo-boost` + `react-apollo` → `@apollo/client` (all-in-one)
- **New Hooks API**: `<Query>` components → `useQuery` hook
- **Better TypeScript**: Full TypeScript support with generated types
- **Improved Caching**: New InMemoryCache API

#### Migration
```javascript
// Before (apollo-boost + react-apollo)
import ApolloClient from 'apollo-boost';
import { Query } from 'react-apollo';

const client = new ApolloClient({
  uri: window.GRAPHQL_URI || '/graphql'
});

// After (@apollo/client)
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: getEnv('REACT_APP_GRAPHQL_ENDPOINT'),
  cache: new InMemoryCache()
});
```

### 4. TypeScript Migration

#### Changes
- All `.js` files converted to `.ts`/`.tsx`
- Added type definitions for all components
- Added TypeScript configuration (`tsconfig.json`)
- Type-safe props, state, and hooks

#### Benefits
- Compile-time type checking
- Better IDE support and autocomplete
- Reduced runtime errors
- Self-documenting code

### 5. React Router 5 → 7

#### Changes
- **New API**: `<Switch>` → `<Routes>`, `<Route>` API changed
- **Hooks**: `withRouter` → `useNavigate`, `useParams`, `useLocation`
- **Data Loading**: Support for data loaders (not used yet)

#### Migration Example
```javascript
// Before (React Router 5)
import { Route, Switch } from 'react-router-dom';
<Switch>
  <Route exact path="/services" component={ServicesPage} />
</Switch>

// After (React Router 7)
import { Routes, Route } from 'react-router-dom';
<Routes>
  <Route path="/services" element={<Services />} />
</Routes>
```

### 6. Build System Modernization

#### Changes
- **Webpack 5**: Updated from webpack 4
- **Modern Babel**: Updated babel presets and plugins
- **CSS Handling**: Improved CSS loader configuration
- **Asset Handling**: Better static asset handling
- **TypeScript Support**: Full TypeScript compilation pipeline

#### Build Scripts
```json
{
  "start": "node scripts/start.js",
  "build": "node scripts/build.js",
  "test": "node scripts/test.js",
  "lint": "eslint src --ext .ts,.tsx,.js,.jsx"
}
```

### 7. Deployment Infrastructure

#### New Features
- **Runtime Environment Injection**: Environment variables injected at container startup
- **Multi-stage Docker Build**: Separate build, test, and production stages
- **Nginx Proxy**: GraphQL API proxy with authorization headers
- **Health Checks**: Built-in health check endpoint
- **OpenShift/Kubernetes**: Ready-to-use manifests

#### Environment Configuration
Previously: Build-time environment variables via `public/env/env.js`
Now: Runtime environment injection via `entrypoint.sh` → `env-config.js`

Supported variables:
- `REACT_APP_GRAPHQL_ENDPOINT`
- `AUTHORIZATION`
- `REACT_APP_DATA_DIR_URL`
- `REACT_APP_DOCS_DIR_URL`
- `REACT_APP_SCHEMAS_DIR`
- `REACT_APP_GRAFANA_URL`

## New Features

### 1. Theme Switching
- Light/dark mode toggle via `ThemeSwitch` component
- Theme preference stored in localStorage
- Smooth theme transitions

### 2. Mobile Responsive Design
- Collapsible sidebar for mobile devices
- Responsive breakpoints
- Touch-friendly navigation

### 3. Improved Search
- Real-time search across resource types
- Better search UI with PatternFly components

### 4. Better Component Organization
```
src/
├── components/      # Reusable UI components
├── contexts/        # React Context providers
├── hooks/          # Custom React hooks
├── lib/            # Utilities and configurations
├── pages/          # Page-level components
└── utils/          # Runtime utilities
```

## Breaking Changes

### For Users
- **No Breaking Changes**: The UI functionality remains the same
- **Improved UX**: Better mobile experience and theme support

### For Developers
1. **TypeScript Required**: All new code must use TypeScript
2. **New Component APIs**: PatternFly components have different props
3. **GraphQL Hooks**: Use `useQuery` instead of `<Query>` component
4. **Router Hooks**: Use hooks instead of `withRouter` HOC
5. **Package Manager**: Uses npm (with `--legacy-peer-deps` flag for React 19)

## Migration Guide

### Local Development Setup

```bash
# Clone and navigate to repo
cd visual-qontract

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

### Building for Production

```bash
npm run build

# Build artifacts will be in build/
```

### Docker/Podman Deployment

```bash
# Build image
podman build -t visual-qontract:v2 .

# Run with environment variables
podman run -d -p 8080:8080 \
  -e REACT_APP_GRAPHQL_ENDPOINT="http://localhost:4000/graphql" \
  -e AUTHORIZATION="Bearer your-token" \
  visual-qontract:v2
```

### OpenShift/Kubernetes Deployment

See `DEPLOYMENT.md` for complete deployment instructions including:
- ConfigMap and Secret setup
- Deployment manifests
- Health checks and monitoring
- Network policies

## Testing the Upgrade

### Functional Testing Checklist

- [ ] Application builds without errors
- [ ] Application starts in development mode
- [ ] All pages are accessible
- [ ] Navigation works correctly
- [ ] GraphQL queries work
- [ ] Data displays correctly on all pages
- [ ] Search functionality works
- [ ] Theme switching works
- [ ] Mobile responsive layout works
- [ ] Docker build succeeds
- [ ] Container runs successfully
- [ ] Health check endpoint responds

### Known Issues

None at this time.

## Rollback Plan

If issues are encountered:

1. **Immediate Rollback**: Switch back to `master` branch
   ```bash
   git checkout master
   ```

2. **Container Rollback**: Use previous container image
   ```bash
   podman run -d -p 8080:8080 visual-qontract:v1
   ```

3. **Gradual Migration**: Deploy v2 alongside v1 and gradually migrate traffic

## Performance Improvements

### Build Performance
- Faster builds with webpack 5
- Better tree-shaking and code splitting
- Smaller bundle sizes with modern compression

### Runtime Performance
- React 19 concurrent rendering
- Better component memoization
- Optimized re-renders

### Network Performance
- Improved nginx caching configuration
- Gzip compression for all text assets
- Long-term caching for static assets

## Security Improvements

1. **Non-root Container**: Runs as user 1001
2. **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
3. **Updated Dependencies**: All dependencies updated to latest secure versions
4. **Runtime Config**: Sensitive data via environment variables, not build-time

## Maintenance Notes

### Updating Dependencies

```bash
# Update all dependencies
npm update

# Update specific package
npm update @patternfly/react-core
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/Navigation.tsx`

### Troubleshooting

#### Build fails with TypeScript errors
- Check `tsconfig.json` configuration
- Ensure all files have proper type annotations
- Run `npm run lint` to see all errors

#### GraphQL queries fail
- Verify `REACT_APP_GRAPHQL_ENDPOINT` is set correctly
- Check authorization token in `AUTHORIZATION` env var
- Test GraphQL endpoint manually with curl

#### Container won't start
- Check logs: `podman logs <container-id>`
- Verify environment variables are set
- Check that entrypoint.sh is executable

## Credits

This upgrade was performed using the visual-app-interface codebase as a reference implementation, bringing PatternFly 6, React 19, and modern development practices to visual-qontract.

## References

- [PatternFly 6 Documentation](https://www.patternfly.org/)
- [React 19 Documentation](https://react.dev/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React Router v7 Documentation](https://reactrouter.com/)
