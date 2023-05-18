# gbif-react-components

## Installation
Make sure you have the correct version on Node installed. We manage node versions with [nvm](https://github.com/nvm-sh/nvm). Type `nvm use` to install the required version. You can also do so manually, see `.nvmrc` for the required version.

```
npm install
```

Run the project with 
```
npm run start
```

During development it can be useful to serve and build translation files continously. To do so you should run `npm run watch-translations` and `npm run serve-translations`

Build a static storybook version with `npm run build-storybook`

Run it with `npx http-server /storybook-static`.
Notice that `serve` instead of `http-server` doesn't really work. The previews do not show then.

## Attribution

**Icons**
<a href="https://www.flaticon.com/free-icons/empty-state" title="empty state icons">Empty state icons created by Freepik - Flaticon</a>

## Build

Build for test environment.
```
npm run build:test
```
It will overwrite .env.json with .env.development.json

Build for prod

```
npm run build
```
It will overwrite .end.json with .env.production.json

## ALA Deployment

**/usr/share/nginx/html/**  is the target folder. It may change

```
copy ./ala-demo.html /usr/share/nginx/`h``tml/index.html
copy ./ala-config.js /usr/share/nginx/html/config.js
create folder: /usr/share/nginx/html/dist/lib
copy ./docker/oidc-client-ts.js /usr/share/nginx/html/dist/lib/
copy ./docker/oidc-client-ts.js.map /usr/share/nginx/html/dist/lib/
copy ./dist/lib/gbif-react-components.js /usr/share/nginx/html/dist/lib/copy
copy ./dist/lib/gbif-react-components.js.map /usr/share/nginx/html/dist/lib/
```
