This folder contains some ALA specific configs

.env.json provides links used by the events-web.

config.js has links used by ALA index page.  Those links need to be changed if we deploy it to the different server.

oidc-client-ts.js is required by ALA index page 

## Settings

The following variables need to passed in via ARGS

```
HOST_SERVER
ES_WEB_API
GRAPH_API
EVENT_TILE_API
AUTH_CLIENT_ID
```

For example

````
docker build --build-arg HOST_SERVER=https://events-test.ala.org.au --build-arg ES_WEB_API=https://events-test.ala.org.au/es
````

Or, load from a external file directly:

```
docker build $(cat docker.env | awk -F "=" '{ print "--build-arg " $1"="$2;}' | xargs)
```