# How to add a route

A route is a `RouteObjectWithPlugins` (`src/reactRouterPlugins/index.ts`): a react-router route plus
`loader` (injected args), `loadingElement`, `gbifRedirect`, `overrideConfig`. `applyReactRouterPlugins`
adds locale prefixes, portal page config, slugs, and loader injection.

**Reference:** `src/routes/dataset/key/index.tsx` (route object, child tabs) and `datasetKey.tsx`
(query, loader, page, skeleton).

## First decide who serves the route

| Option | Register in | Needs |
|---|---|---|
| gbif.org only (tools, custom pages, user pages, anything needing the Node backend) | `src/gbif/routes.tsx` | nothing extra |
| gbif.org and hosted portals (entity detail and search pages) | `dataRoutes` in `src/config/routes.tsx` | `gbifRedirect` + `DynamicLink` |

Portals opt in to shared pages by route id in `config.pages` (optionally with their own `path`), or
opt out via `excludedPages`. `applyPagePathsPlugin` removes pages a portal did not enable and marks
them `redirect: true`. So every shared route needs a fallback: `gbifRedirect(params, locale,
searchParams)` returns the full gbif.org URL (`import.meta.env.PUBLIC_GBIF_ORG` + locale prefix) or
`null` when nothing sensible exists (see the `key === 'search'` guard). Example: a portal without
`datasetKey` turns dataset links into `https://www.gbif.org/dataset/<key>`.

The fallback only fires for links rendered with **`DynamicLink`** (or `useDynamicNavigate`) and a
`pageId`, from `@/reactRouterPlugins`. A hardcoded `<Link to="/dataset/123">` 404s on the portal.
The loader also redirects direct hits, but that is a safety net.

## Checklist

1. Folder `src/routes/<entity>/<kind>/`.
2. Query as a `/* GraphQL */` string with a unique operation name; codegen generates `FooQuery` /
   `FooQueryVariables` in `@/gql/graphql`.
3. `async function fooLoader({ params, graphql }: LoaderArgs)`: `graphql.query<FooQuery,
   FooQueryVariables>(QUERY, vars)`, read `{ data, errors }` from `response.json()`,
   `throwCriticalErrors({ path404, errors, requiredObjects })` (`@/routes/rootErrorPage`), return
   `{ errors, foo: data.foo }`, export `type FooLoaderResult = Awaited<ReturnType<typeof fooLoader>>`.
4. Page: `useLoaderData() as FooLoaderResult` (or `useRenderedRouteLoaderData(id)` from a tab),
   `useNotifyOfPartialDataIfErrors(errors)`, `<Helmet>` title, text via `<FormattedMessage>`
   ([add-a-translation.md](./add-a-translation.md)).
5. Skeleton for `loadingElement` (shadcn `Skeleton`, `src/components/ui`).
6. Route object: stable `id`, `path`, `loader`, `loadingElement`, `element`, children for tabs, and
   `gbifRedirect` for shared routes.
7. Register once, in the file chosen above. In `dataRoutes`, search routes precede detail routes and
   `resourceKeyRoutes` stays last. `src/hp/routes.tsx` is not touched for data pages.
8. `npm run codegen`; commit `src/gql/`.
9. `npm run type-check`, `npm run vitest`, open in `npm run develop`; shared pages also via
   `npm run build:hp && npm run start:hp`.

## Caveats

- **`id` is a public contract.** Portals enable and relocate pages by id
  (`pages: [{ id: 'datasetKey', path: 'my-datasets/:key' }]`). Never rename.
- **Links to your page** elsewhere must use `DynamicLink` with your `pageId`. When replacing a page,
  grep for hardcoded paths.
- **Shared routes run without SSR on portals.** No server-only globals; per-site variation via
  `useConfig()` or the `config` loader arg.
- **Keep `loader` static on the route.** A loader returned from react-router `lazy()` bypasses the
  injection of `graphql`, `config`, `locale`, `isPreview`.
- **Operation names must be unique** across `src/`, or codegen fails.
- **Non-critical data** (slow metrics) goes in the component via `useQuery` with `lazyLoad: true`.
- **Client-only routes** have no established pattern: omit `loader` and `loadingElement`, fetch with
  `useQuery`. Prefer a loader when SEO matters.
- **Large pages:** see [code-splitting-and-lazy-loading.md](./code-splitting-and-lazy-loading.md);
  `React.lazy` disables SSR for the page.
- **Loading screens** show only between routes, not on initial render or same-route param changes.
