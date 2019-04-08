# visual-qontract

This is the web ui for the data served by AppSRE's team [qontract-server](https://github.com/app-sre/qontract-server/) instance.

It is written in [React](https://reactjs.org/) and uses [PatternFly 3](https://www.patternfly.org/) as the UI framework.

## Usage

```
$ cp public/env/env.js.example public/env/env.js
$ sed -i.bk '/GRAPHQL_URI/d' public/env/env.js
$ docker run --rm -it -p 8080:8080 -e AUTHORIZATION="Basic <TOKEN>" -e GRAPHQL_URI="<URL>" quay.io/app-sre/visual-qontract:latest
```

## Development Environment

```
$ cp public/env/env.js.example public/env/env.js
$ yarn
$ yarn start:dev
```
