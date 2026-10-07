# Run locally and take screenshots

For seeing a change in the real app, e.g. in a cloud agent session without the private
`gbif-configuration/gbif-web` env files. With dummy secrets, login, OAuth and forms do not work.

## gbif-org against deployed GraphQL

```
npm ci
```

`cp .env.example .env`: public production endpoints and placeholder secrets.

`NODE_ENV=development node gbif/server.js` serves http://localhost:3000 (SSR + Vite HMR).
`npm run develop` does the same plus codegen watch.

## Against local graphql-api

In `packages/graphql-api`: `cp .env.example .env`, then `npx tsx src/index.ts` (port 4123). Start
gbif-org with `PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4123/graphql` on the command line; it
overrides `.env`.

REST-backed fields work. Elasticsearch-backed ones (occurrence search, facets) return 403 unless
`apiEsKey` is the real key: `hp-search.gbif.org` is public, only the key is missing. Thumbor URLs it
signs are invalid without the real `thumborSecurityKey`, so CMS images 400.

## Screenshots

Playwright (in gbif-org `node_modules`) with the preinstalled Chromium.

- Layout, text, data: default `chromium.launch()` (headless shell). Faster; use it.
- Images matter: `chromium.launch({ channel: 'chromium' })`. GBIF's image service
  (`api.gbif.org/v1/image/…`, Thumbor) answers 400 to the headless shell regardless of user agent
  or headers, likely fingerprint-based bot filtering. Full Chromium gets 200.
- CMS assets also load straight from `images.ctfassets.net`; a sandbox must allow that host.
- Wait for `networkidle` plus a few seconds; maps and charts render late.
- Never pass the sandbox `HTTPS_PROXY` to Chromium explicitly: it only accepts CONNECT and captures
  localhost. Chromium picks it up from the environment already.
