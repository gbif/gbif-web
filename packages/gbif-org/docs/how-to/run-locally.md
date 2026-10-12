# Run locally and take screenshots

How to run gbif.org on your own machine when you don't have access to the private
`gbif-configuration/gbif-web` environment files, for example as an external contributor. The
example configuration uses placeholder secrets, so login, OAuth and forms will not work, but you can
browse the site and see your changes.

## Against the deployed GraphQL API

Install the dependencies and copy the example configuration, which points at the public production
endpoints:

```
CYPRESS_INSTALL_BINARY=0 npm ci   # the Cypress binary is not needed to run the site
cp .env.example .env
```

Then start the site with `npm run develop`. It serves http://localhost:3000 with server-side
rendering and hot reloading, and regenerates the GraphQL types as you edit queries. If you only need
the server, `NODE_ENV=development node gbif/server.js` does the same without the type generation.

## Against a local graphql-api

If you are changing the GraphQL API as well, run it locally. In `packages/graphql-api`, copy
`.env.example` to `.env` and start the server with `npx tsx src/index.ts`; it listens on port 4123.
Then start gbif-org with `PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4123/graphql` set on the command
line, which takes precedence over the value in `.env`.

With the example configuration, fields that come from the GBIF REST APIs work. Fields backed by
Elasticsearch (occurrence search and facets) return 403 errors, because `hp-search.gbif.org` needs
the real `apiEsKey`. Images from the CMS also fail with 400 errors, because the image URLs are
signed with `thumborSecurityKey`, which is a placeholder in the example.

## Taking screenshots with a script

Playwright is installed with gbif-org's development dependencies, so you can use it to script
screenshots, for example to compare a page before and after a change.

- The default headless browser (`chromium.launch()`) is the fastest and is fine for checking layout,
  text and data.
- If the images matter, launch full Chromium with `chromium.launch({ channel: 'chromium' })`. GBIF's
  image service (`api.gbif.org/v1/image/…`) answers the headless browser with 400 errors whatever
  user agent or headers it sends, probably because of bot filtering. Full Chromium gets the images.
- CMS images load directly from `images.ctfassets.net`, so that host needs to be reachable.
- Maps and charts render late. Wait for the network to go idle, and then a few seconds more, before
  taking the screenshot.
- If you are behind an HTTP proxy, let Chromium pick it up from the `HTTPS_PROXY` environment
  variable. Passing the proxy to Chromium explicitly can also route requests to localhost through it,
  which breaks the local site.
