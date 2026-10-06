# How to code-split and lazy load

Vite creates a separate bundle for anything imported with a dynamic `import()`. Use this for
large or rarely used parts of the app so they do not slow down the initial load.

## Code-split a section inside a page

```tsx
import { Suspense, lazy } from 'react';
const MyLazyComponent = lazy(() => import('@/components/MyLazyComponent'));

function Component() {
  return (
    <>
      <p>This text renders immediately</p>
      <Suspense fallback={<p>Loading...</p>}>
        <MyLazyComponent />
      </Suspense>
    </>
  );
}
```

Wrap the `Suspense` in an `ErrorBoundary` (`src/components/ErrorBoundary`) when a failed chunk
load should not take down the whole page.

## Lazy load a whole page (not server-rendered)

Page components can be loaded with `React.lazy` inside `StaticRenderSuspence`
(`src/components/staticRenderSuspence.tsx`). The page's code is then fetched only when the route
is visited.

```tsx
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';

const OccurrenceSearchPage = React.lazy(() => import('@/routes/occurrence/search/Page'));

export const occurrenceSearchRoute: RouteObjectWithPlugins = {
  id: 'occurrenceSearch',
  path: 'occurrence/search',
  loader: occurrenceSearchLoader,
  loadingElement: <OccurrenceSearchPageSkeleton />,
  element: (
    <StaticRenderSuspence fallback={<OccurrenceSearchPageSkeleton />}>
      <OccurrenceSearchPage />
    </StaticRenderSuspence>
  ),
};
```

Keep the lazily imported page `element` in a different file from the `loader` and
`loadingElement`, so the main bundle stays small and the loader can start fetching while the page
chunk downloads.

### Caveat: this disables SSR for the page

The server renders with `renderToString`, which cannot suspend, so `StaticRenderSuspence` renders
its `fallback` on the server. The initial HTML contains only the skeleton and the real content
appears after hydration. That is fine for interactive or low-traffic pages (tools, tabs). For pages
where server-rendered content matters for SEO or first paint (dataset, species, occurrence detail
pages), do not do this. Load those eagerly or use the pattern below.

## Code-split a page and keep SSR

Use react-router's route-level `lazy` instead of `React.lazy`. The server resolves a matched
route's `lazy` import before rendering (`createStaticHandler` in `src/gbif/entry.server.tsx`), and
the client pre-resolves matched lazy routes in `loadLazyRoutes` before `hydrateRoot`
(`src/gbif/entry.client.tsx`), so hydration has no mismatch.

```tsx
{
  id: 'occurrenceSearch',
  path: 'occurrence/search',
  lazy: async () => {
    const { OccurrenceSearchPage } = await import('@/routes/occurrence/search/Page');
    return { element: <OccurrenceSearchPage /> };
  },
  loader: occurrenceSearchLoader,
  loadingElement: <OccurrenceSearchPageLoading />,
}
```

### Caveat: the loader stays on the route object

Never return `loader` from `lazy()`. The route plugins wrap the loader at build time to inject
`config`, `locale`, `graphql`, and `isPreview`; a loader coming out of `lazy` bypasses that and
breaks. Keeping it static also lets it fetch in parallel with the element chunk.
