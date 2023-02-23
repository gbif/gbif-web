FROM nginx:stable-perl

RUN echo "Installing nodejs 16.x"
RUN set -e; \
    apt-get update && \
    apt-get install -qqy --no-install-recommends \
    curl wget nano gnupg2 software-properties-common && \
    rm -rf /var/lib/apt/lists;

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y python3.6 python3-distutils python3-pip python3-apt

RUN echo "NODE Version:" && node --version
RUN echo "NPM Version:" && npm --version

ARG HOST_SERVER
ARG ES_WEB_API
ARG GRAPH_API
ARG EVENT_TILE_API
ARG AUTH_CLIENT_ID

RUN echo "######### Settings ############"
RUN echo "Server: $HOST_SERVER"
RUN echo "ES Server: ${ES_WEB_API}"
RUN echo "GraphQL Server: ${GRAPH_API}"
RUN echo "EVENT Tile : ${EVENT_TILE_API}"
RUN echo "AUTH_CLIENT_ID : ${AUTH_CLIENT_ID}"


WORKDIR /src
ADD . .

#### Update .env.json ######
RUN cp ./docker/.env.json .env.json
RUN sed -i "s|{{ES_WEB_API}}|$ES_WEB_API|g" .env.json
RUN sed -i "s|{{GRAPH_API}}|$GRAPH_API|g" .env.json
RUN sed -i "s|{{EVENT_TILE_API}}|$EVENT_TILE_API|g" .env.json

#### Update config.js used by index.html ####
RUN cp ./docker/config.js config.js
RUN sed -i "s|{{HOST_SERVER}}|$HOST_SERVER|g" config.js
RUN sed -i "s|{{AUTH_CLIENT_ID}}|$AUTH_CLIENT_ID|g" config.js

#### build ####
RUN npm install
RUN npm run build

#### Deploy to Nginx ####
RUN cp ./ala-demo.html /usr/share/nginx/html/index.html
RUN cp ./config.js /usr/share/nginx/html/config.js
RUN mkdir -p /usr/share/nginx/html/dist/lib
RUN cp ./docker/oidc-client-ts.js /usr/share/nginx/html/dist/lib/
RUN cp ./docker/oidc-client-ts.js.map /usr/share/nginx/html/dist/lib/
RUN cp ./dist/lib/gbif-react-components.js /usr/share/nginx/html/dist/lib/
RUN cp ./dist/lib/gbif-react-components.js.map /usr/share/nginx/html/dist/lib/
