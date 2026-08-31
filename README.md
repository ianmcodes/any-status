# any-status
Simple web server that will return any status code you need.

Request a path containing an HTTP status code and the server responds with that
status code plus a human readable page describing it:

* `/200` -> `200 OK`
* `/404` -> `404 Not Found`
* `/502` -> `502 Bad Gateway`

Any code between `100` and `599` is supported. Non-standard codes are returned
too, just without a description. Anything else responds with `404 Not Found`.

## Running locally

```bash
npm install
npm start          # listens on http://localhost:3000
npm test
```

The port and bind address can be changed with the `PORT` and `HOST` environment
variables.

## Running with Docker

```bash
docker build -t any-status .
docker run --rm -p 3000:3000 any-status
```

Images are also built and published to GitHub Container Registry by the
[CI workflow](.github/workflows/ci.yml) on pushes to `main` and version tags:

```bash
docker run --rm -p 3000:3000 ghcr.io/ianmcodes/any-status:main
```
