# Fallback data

The site loads its **translations** from a remote endpoint
(`PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT`) and its **header / menu** from the GraphQL
endpoint (via the `/unstable-api/cached-response/header` proxy). If either of
those is unreachable — a network outage, a deploy, upstream downtime — the site
should still be able to render a usable front page, a menu and translated
strings.

This directory contains committed, bundled snapshots that act as a safety net:

| File | Used by | Purpose |
| --- | --- | --- |
| `translations.json` | `src/reactRouterPlugins/i18n/plugin.tsx` | Fallback translations entry map |
| `messages/<locale>.json` | `src/config/fallback/index.ts` (lazy) | Fallback messages per configured locale |
| `header.en.json` | `src/gbif/gbifRootLayout.tsx` and the server proxy `gbif/routes/proxy/proxy.mjs` | Fallback header / menu |
| `meta.json` | — | When and from where the snapshot was last generated |

## How the fallback kicks in

- **Translations:** the i18n loader fetches the live translations first. If the
  fetch fails it logs an error and falls back to these bundled files instead of
  failing the whole app. The per-locale message files are loaded lazily (their
  own chunks) so they cost nothing unless an outage occurs.
- **Header:** both the server proxy (cold-cache + GraphQL down) and the client
  loader (endpoint not OK / network rejection) fall back to `header.en.json`.

The live data is always preferred; these snapshots are only a last resort.

## Updating

These files are **generated** — do not edit them by hand. Refresh them now and
then (e.g. when the menu or translation keys change meaningfully):

```sh
npm run update-fallbacks
```

The script reads the endpoints from your environment (the same
`PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT` / `PUBLIC_GRAPHQL_ENDPOINT` variables the
app uses, via `.env.local` / `.env`) and falls back to the public production
endpoints when they are not set. Only locales that are configured in
`src/config/languagesOptions.tsx` are bundled.
