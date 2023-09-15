# visual-qontract

visual-qontract is the web UI for the data served by AppSRE's team [qontract-server](https://github.com/app-sre/qontract-server/) instance.

It is written in [React](https://reactjs.org/) and uses [PatternFly 3](https://www.patternfly.org/) as the UI framework.

## Usage

```sh
$ cp public/env/env.js.example public/env/env.js
$ make dev-docker-run
```

The visual-qontract UI will be reachable on http://localhost:8080

## Development Environment

```sh
$ cp public/env/env.js.example public/env/env.js
$ yarn
$ yarn build
$ yarn start:dev
```

The server will then run on http://localhost:3000

## Debugging

For debugging start the server locally with:

```sh
$ yarn start:local
```

Add a debugging after the service is started, use `debugger`, anywhere where you want to debug. 

Open the corresponding page in Chrome with the inspection window open. The debugger will stop at the `debugger` statement.
