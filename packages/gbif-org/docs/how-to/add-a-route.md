# How to add a route

A route is a `RouteObjectWithPlugins` (`src/reactRouterPlugins/index.ts`): a react-router route
object plus a few extra fields (`loader` with injected args, `loadingElement`, `gbifRedirect`,
`overrideConfig`). The route tree is passed through `applyReactRouterPlugins`, which handles
locale prefixes, portal page config, slugs, and loader injection.

**Reference example to copy:** `src/routes/dataset/key/index.tsx` (route object with child tabs)
and `src/routes/dataset/key/datasetKey.tsx` (query, loader, page component, skeleton).

## First decide who serves the route

Not every route exists on hosted portals. Pick one of two options before writing code:

- **gbif.org only.** Tools, custom pages, user pages, anything that needs the Node backend.
  Register in `src/gbif/routes.tsx`. No `gbifRedirect` is needed.
- **gbif.org and hosted portals.** Data pages: entity detail and search. Register in `dataRoutes`
  in `src/config/routes.tsx`, which both routers consume.

For a shared route, remember that a portal chooses which pages it hosts. Its config lists the pages
it wants in `pages` by route id, optionally with its own `path`, or drops some with
`excludedPages`. `applyPagePathsPlugin` (`src/reactRouterPlugins/applyPagePaths/plugin.tsx`)
removes every page the portal did not enable from that portal's router and records it as
`redirect: true`.

So **every shared route needs a fallback destination on gbif.org**: the
`gbifRedirect(params, locale, searchParams)` function on the route object. It must return the full
gbif.org URL for those params, built from `import.meta.env.PUBLIC_GBIF_ORG` plus the locale prefix,
or `null` when there is nothing sensible to redirect to (see the `key === 'search'` guard in the
dataset example). Example: a publisher portal that has not enabled `datasetKey` still shows dataset
titles in occurrence results, and each one links to `https://www.gbif.org/dataset/<key>`.

The fallback only works for links rendered with **`DynamicLink`** (or `useDynamicNavigate`) and a
`pageId`, exported from `@/reactRouterPlugins`. `DynamicLink` looks the page up in the portal's page
list and, when it is marked `redirect`, swaps in the `gbifRedirect` URL as an external href. A
hardcoded `<Link to="/dataset/123">` bypasses this and 404s on the portal. Direct hits on a disabled
URL are also redirected by the loader wrapper, but that is a safety net, not the mechanism to rely on.

## Checklist

1. **Create a folder** under `src/routes/<entity>/<kind>/`, e.g. `src/routes/foo/key/`.
2. **Write the query** as a `/* GraphQL */` string constant with a unique operation name. Codegen
   discovers queries by that comment and generates `FooQuery` / `FooQueryVariables` in
   `@/gql/graphql`.
3. **Write the loader** `async function fooLoader({ params, graphql }: LoaderArgs)`. Call
   `graphql.query<FooQuery, FooQueryVariables>(QUERY, vars)`, read `{ data, errors }` from
   `response.json()`, then `throwCriticalErrors({ path404, errors, requiredObjects })` from
   `@/routes/rootErrorPage` so a missing object becomes a 404. Return `{ errors, foo: data.foo }`
   and export `type FooLoaderResult = Awaited<ReturnType<typeof fooLoader>>`.
4. **Write the page component.** Read data with `useLoaderData() as FooLoaderResult` (or
   `useRenderedRouteLoaderData(id)` from a child tab). Call `useNotifyOfPartialDataIfErrors(errors)`.
   Set the title with `<Helmet>`. All user-facing text goes through `<FormattedMessage>`; see
   [add-a-translation.md](./add-a-translation.md).
5. **Write a skeleton** for `loadingElement`, using the shadcn `Skeleton` in `src/components/ui`.
6. **Export the route object** with a stable `id`, a `path`, `loader`, `loadingElement`, `element`,
   and, for shared routes, `gbifRedirect` (see above). Add child routes for tabs.
7. **Register it once**, in the file chosen above. In `dataRoutes`, search routes go before detail
   routes and the `resourceKeyRoutes` wildcard must stay last. Nothing is added to
   `src/hp/routes.tsx` for ordinary data pages.
8. **Run codegen** (`npm run codegen`, or keep `npm run develop` running). Commit the regenerated
   files in `src/gql/`; they are tracked.
9. **Verify:** `npm run type-check`, `npm run vitest`, open the page in `npm run develop`, and for
   shared pages also build and open the hosted-portal target (`npm run build:hp && npm run start:hp`).

## Caveats

- **The `id` is a public contract.** Hosted portals enable and relocate pages by route id in their
  config (`pages: [{ id: 'datasetKey', path: 'my-datasets/:key' }]`, `excludedPages: ['...']`, see
  `src/reactRouterPlugins/applyPagePaths/plugin.tsx`). Renaming an id breaks existing portal
  configs. Pick a descriptive id (`fooKey`, `fooSearch`) and never change it.
- **Shared routes need `gbifRedirect` and `DynamicLink`.** See "First decide who serves the route"
  above. Links elsewhere in the app that point at your page must use `DynamicLink` with your
  `pageId`; when replacing an old page, grep for hardcoded paths to it.
- **Shared routes run without SSR on portals.** The loader runs in the browser there, so do not
  rely on server-only globals or on `window` being absent. Anything that varies per site must come
  from `useConfig()` or the `config` loader arg, never be hardcoded.
- **Loaders are wrapped by the plugins.** Keep `loader` defined statically on the route object. A
  loader returned from react-router's `lazy()` bypasses the injection of `graphql`, `config`,
  `locale`, and `isPreview`.
- **Query names must be unique across the whole `src/` tree**, otherwise codegen fails.
- **Non-critical data** (slow metrics, counts) belongs in the component via `useQuery` from
  `@/hooks/useQuery` with `lazyLoad: true`, not in the loader, so it does not delay first render.
- **Client-only routes** have no established pattern yet. Omit `loader` and `loadingElement` and
  fetch inside the component with `useQuery`. Prefer a loader whenever the page matters for SEO.
- **Large pages:** see [code-splitting-and-lazy-loading.md](./code-splitting-and-lazy-loading.md)
  before wrapping the element in `React.lazy`, because that disables server rendering for the page.
- **Loading screens** only show when navigating between routes, not on the initial render, and
  not when navigating to the same route with different params (README "Known Issues").
