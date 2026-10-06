# gbif-web

The website for [gbif.org](https://www.gbif.org), as a monorepo. Coding agents load this file
at session start. Each package has its own `AGENTS.md`; READMEs hold the long-form reference.

## Packages

| Package | Status | What it is |
|---|---|---|
| `packages/gbif-org` | active, most work | gbif.org frontend, small Node backend (auth, redirects, SSR), and the hosted-portal browser library |
| `packages/graphql-api` | active | GraphQL layer gbif-org loads nearly all data from. Wraps GBIF REST APIs and es-api |
| `packages/es-api` | active | Wrapper around Elasticsearch indices, called by graphql-api. Needs GBIF VPN |
| `packages/react-components` | legacy | Only `locales/` is live: the translation source for everything |

## Architecture

```
browser → gbif-org (SSR, auth, redirects) → graphql-api → GBIF REST APIs + es-api → Elasticsearch
```

gbif-org has **two build targets from one `src/`**. `gbif/` is gbif.org, server-rendered. `hp/` is
a client-only library for **hosted portals**: Jekyll sites run by publishers, countries, or networks
that mount a React widget showing a subset of GBIF data. One component set serves gbif.org and many
differently configured portals, so nearly everything goes through the global `Config`
(`packages/gbif-org/src/config/config.tsx`): pages, theme, languages, occurrence predicate,
endpoints. That configurability is the main complexity. Shared code must work without SSR and
respect `useConfig()`.

## Where to start

- Most tasks: `packages/gbif-org/AGENTS.md`, then the matching guide in
  `packages/gbif-org/docs/how-to/` (route, translation, lazy loading, filter, filter type, chart).
- Schema or data-shape changes: `packages/graphql-api/AGENTS.md` and
  `packages/graphql-api/docs/how-to/add-a-resource.md`.
- Search or aggregation behaviour passed through by GraphQL: `packages/es-api`.
- New occurrence filter or facet: `packages/gbif-org/docs/how-to/add-an-occurrence-filter.md`
  covers all three packages.

## Conventions

- Node version per package `.nvmrc` (24.x; react-components is 16).
- Each package has its own `package-lock.json`. `npm install` inside the package, not at root.
- The husky pre-commit hook is empty. Run type-check, lint, and tests yourself before pushing.
- Commits: `feat:` / `fix:` prefixes; issues as `close https://github.com/gbif/gbif-web/issues/N`.
- Prettier differs per package (width 100 gbif-org, 120 graphql-api). Use the local config.
- `CLAUDE.md` files are one-line imports of `AGENTS.md`. Edit `AGENTS.md`.
- **Write densely.** Docs, `AGENTS.md` files, how-to guides, and code comments: state the rule or the
  non-obvious reason, not both. A comment says why; the name says what. Never restate the code.

## Translations

- Source: `packages/react-components/locales/source/en-developer/` (JSON, `components/` and `enums/`).
- Crowdin (`crowdin.yml`, `crowdin-en.yml`) writes `locales/translations/`. Never edit those by hand.
- gbif-org fetches built translations at runtime from `PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT`.
  Bundled fallbacks: `packages/gbif-org/src/config/fallback/`.

## Network and VPN

- gbif-org needs reachable GraphQL and translations endpoints. graphql-api fetches enumerations
  from the live GBIF API at startup. es-api needs the VPN.
- Works offline: `npm run type-check`, `npm run vitest` (gbif-org); `npm test` (graphql-api, given
  a `.env`). Prefer these when servers cannot run.
- `.env` files are not in the repo; canonical copies are in the private `gbif-configuration/gbif-web`.
  Ask rather than invent values.
