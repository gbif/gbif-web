# gbif-org

gbif.org site and hosted-portal library. Long-form reference: `README.md`. `nvm use` and
`npm install` here, not at the repo root.

## Commands

| Command | Use |
|---|---|
| `npm run develop` | dev server + codegen watch |
| `npm run type-check` | `tsc --noEmit`; run before every push |
| `npm run vitest` | unit tests, colocated `*.test.ts` |
| `npm run codegen` | regenerate `src/gql/` after any query change |
| `npm run build` / `build:hp` | production builds, gbif.org / hosted portals |
| `npm run start:hp` | serve the hosted-portal build |

`npm test` builds first and is slow. No `lint` script: `npx eslint src`. Prettier width 100,
single quotes. Nothing runs on commit.

## Task guides (`docs/how-to/`)

- `add-a-route.md`: page or tab, loader, registration, hosted-portal fallback.
- `code-splitting-and-lazy-loading.md`: before using `React.lazy` on a page.
- `add-a-translation.md`: any user-facing text.
- `add-an-occurrence-filter.md`: search parameter or facet; spans es-api and graphql-api.
- `add-a-filter-type.md`: new filter widget kind (rare).
- `add-a-chart.md`: dashboard chart, standard or custom.
- `run-locally.md`: run without the private `.env`, against deployed or local GraphQL; screenshots.

## Two builds, one source

- `gbif/`: Express `server.js` + Vite SSR. Backend does auth, redirects, proxying, sitemaps.
  `src/gbif/` has entries, config, routes, header, footer.
- `hp/`: client-only library embedded by external Jekyll sites, which pass a config at mount.
  `src/hp/` has entry, routes, `configAdapter.tsx` (normalises older portal configs).
- Everything else in `src/` is shared and **must work in both**: no SSR-only assumptions, nothing
  gbif.org-specific hardcoded. Per-site variation goes through `useConfig()`
  (`src/config/config.tsx`). Check the hp build when touching shared code.

## Routing and data

Reference: `src/routes/dataset/key/index.tsx` + `datasetKey.tsx`.

- Routes are `RouteObjectWithPlugins` (`src/reactRouterPlugins/`). Shared data pages: `dataRoutes`
  in `src/config/routes.tsx`, consumed by both routers. gbif.org-only pages: `src/gbif/routes.tsx`.
- Route `id` is a public contract (portal configs enable pages by id). Never rename. `dataRoutes`
  entries define `gbifRedirect`; link between pages with `DynamicLink pageId="..."`, never hardcoded
  paths, so portals without a page fall back to gbif.org.
- `loader({ params, graphql }: LoaderArgs)` calls `graphql.query<...>()` then `throwCriticalErrors`
  (`src/routes/rootErrorPage.tsx`). Runs server-side on gbif.org, in the browser on portals.
- Queries are `/* GraphQL */` strings; types from `@/gql/graphql`. `src/gql/` is committed: run
  codegen and commit it. Never edit by hand.
- In components: `useQuery` (`src/hooks/useQuery.ts`).
- Dashboards: charts in `src/components/dashboard/`, exported via `lazyChart` in its `index.tsx`;
  occurrence dashboard registry in `src/routes/occurrence/search/views/dashboard/`.

## Styling

- Tailwind with **prefix `g-`** (`g-flex g-gap-2`). Unprefixed classes do nothing.
- shadcn/Radix primitives in `src/components/ui/`; merge classes with `cn()` from `@/utils/shadcn`.
- Theme vars in `src/config/theme/`; portals override them. No hardcoded brand colours.

## Config, env, i18n

- Only `PUBLIC_*` env vars reach the client; `env.ts` throws if a required one is missing. `.env` is
  not in the repo; `.env.example` is the template. gbif.org site config:
  `src/gbif/config.ts`; portals ship their own.
- react-intl; locale from the URL prefix (`src/reactRouterPlugins/i18n/`). Messages fetched at
  runtime. Keys live in `packages/react-components/locales/source/en-developer/`; use
  `<FormattedMessage id="..." />`. No inline English.

## Tests

Vitest via `gbif/vite.config.ts`, colocated.

Playwright e2e in `e2e/` (read `e2e/README.md`): `npm run e2e:build` then `npm run e2e`, offline
against recorded upstream data. Covers gbif.org (SSR) and a hosted portal (client-only). Rebuild
after editing `src/`; the run refuses a stale build. Changed a query or added a page:
`npm run e2e:record`, commit `e2e/recordings/`.
