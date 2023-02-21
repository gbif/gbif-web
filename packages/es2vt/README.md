# A small wrapper around ES vector tiles

# Install
requires node v16.13.1
`npm i`

# env file
The `.env`-file should be placed in root and can be found in `gbif-configuration/gbif-web`

Environment file example:
```yml
apiKey: something # this is a fixed key that needs to be added in requests. Since it is all behind vpn we could consider removing it

event:
  hosts: [http://some.elastic.instance:9200]
  requestTimeout: 30000
  maxRetries: 3
  maxResultWindow: 100000
  index: event

port: 4002
```

# Start
for development with Nodemon: `npm start` else `node src/index.js --port=4002`

# Docker

Docker images can be built and published to docker hub using the following command
```
docker buildx build . --push --platform linux/amd64,linux/arm64 --tag "$DOCKER_HUB_ORG/es2vt:$(git rev-parse --short HEAD)"
```

To run use:
```
docker run -p 4002:4002 --mount type=bind,source="$(pwd)"/.env,target=/usr/src/.env -d <DOCKER_HUB_OR_OR_USER>/es2vt
```