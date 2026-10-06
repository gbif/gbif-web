# gbif-web

This repo is essentially the website for [gbif.org](https://www.gbif.org), as a Lerna monorepo.
This file is the always-loaded orientation for agents. Each package has its own `CLAUDE.md` with
package-specific rules, and the package READMEs hold the long-form docs. Read those on demand.

## Packages

| Package | Status | What it is |
|---|---|---|
| `packages/gbif-org` | active, where most work happens | gbif.org frontend, a small Node backend (auth, redirects, SSR), and the browser library used by hosted portals |
| `packages/graphql-api` | active | GraphQL layer that gbif-org loads nearly all its data from. Wraps the public GBIF REST APIs and es-api |
| `packages/es-api` | active | Wrapper around several Elasticsearch indices, called by graphql-api. Needs the GBIF VPN |
| `packages/react-components` | legacy | Old component library. Only `locales/` is still live: it is the translation source for everything |

## Architecture

Data flows top to bottom:

```
browser → gbif-org (SSR, auth, redirects) → graphql-api → GBIF public REST APIs + es-api → Elasticsearch
```

The twist that makes gbif-org more complex than a normal site: it has **two build targets from one
`src/`**. The `gbif/` target is gbif.org itself, server-rendered. The `hp/` target is a client-only
browser library consumed by **hosted portals**: Jekyll sites run by publishers, countries, or
networks that mount a React widget to show a subset of GBIF data (for example only the records a
publisher has published). The same components serve gbif.org and many differently configured
portals, so almost everything is configurable through the global `Config` object
(`packages/gbif-org/src/config/config.tsx`): pages, theme, languages, occurrence predicate,
endpoints. This configurability is the main source of complexity. When you change shared code,
assume the hosted-portal case too: it must work without SSR and must respect `useConfig()`.

## Where to start

- Most tasks: `packages/gbif-org`. Read `packages/gbif-org/CLAUDE.md` first. For a concrete task
  (new route, new translated string, lazy loading) read the matching guide in
  `packages/gbif-org/docs/how-to/` before starting. The README holds the long-form reference.
- Schema or data-shape changes: `packages/graphql-api/CLAUDE.md`, and
  `packages/graphql-api/docs/how-to/add-a-resource.md` for adding fields or resources.
- Search or aggregation behaviour that the GraphQL layer only passes through: `packages/es-api`.
- A new occurrence search filter or facet touches all three active packages. Follow
  `packages/gbif-org/docs/how-to/add-an-occurrence-filter.md`, which covers each package's part.

## Cross-cutting conventions

- Node version is in each package's `.nvmrc` (24.x everywhere except react-components, which is 16).
- Each package has its own `package-lock.json`. Run `npm install` inside the package, not at the
  root. The root only holds Lerna and husky.
- Husky is installed but the pre-commit hook is empty. Nothing runs on commit, so run the package's
  type-check, lint, and tests yourself before pushing.
- Commit messages use `feat:` / `fix:` prefixes and reference issues as
  `close https://github.com/gbif/gbif-web/issues/N`.
- Prettier settings differ per package (width 100 in gbif-org, 120 in graphql-api). Use the local
  config, never a global one.

## Translations

- Source strings live in `packages/react-components/locales/source/en-developer/` (JSON, split into
  `components/` and `enums/`). Add new keys there.
- Translations are done in Crowdin (`crowdin.yml`, `crowdin-en.yml` at the root) and land in
  `packages/react-components/locales/translations/`. Never edit translated files by hand.
- gbif-org fetches the built translations at runtime from `PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT`.
  Bundled fallbacks for the build live in `packages/gbif-org/src/config/fallback/`.

## Network and VPN

- gbif-org needs a reachable GraphQL endpoint and translations endpoint, local or deployed.
- graphql-api builds part of its schema from the live GBIF enumeration API at startup.
- es-api needs the GBIF VPN to reach Elasticsearch.
- Works offline: `npm run type-check` and `npm run vitest` in gbif-org, `npm test` in graphql-api
  (given a `.env`). Prefer these for verification when you cannot run the servers.
- `.env` files are not in the repo. The canonical copies live in the private
  `gbif-configuration/gbif-web` repo. Ask for them rather than inventing values.
