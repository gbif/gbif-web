# How to code-split and lazy load

Vite splits anything behind a dynamic `import()`. Use it for large or rarely used code.

## A section inside a page

```tsx
import { Suspense, lazy } from 'react';
const MyLazyComponent = lazy(() => import('@/components/MyLazyComponent'));

<Suspense fallback={<p>Loading...</p>}>
  <MyLazyComponent />
</Suspense>
```

Wrap in `ErrorBoundary` (`src/components/ErrorBoundary`) if a failed chunk should not take down
the page.

## A whole page, not server-rendered

`React.lazy` inside `StaticRenderSuspence` (`src/components/staticRenderSuspence.tsx`) fetches the
page chunk only when the route is visited.

```tsx
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

Keep the lazy `element` in a different file from `loader` and `loadingElement`, so the loader can
fetch while the chunk downloads.

**Caveat: this disables SSR for the page.** `renderToString` cannot suspend, so the server renders
the fallback and content appears after hydration. Fine for tools and tabs. Not for pages where
server-rendered content matters for SEO or first paint (dataset, species, occurrence detail).

## A whole page, keeping SSR

Use react-router's route-level `lazy`. The server resolves it before rendering
(`createStaticHandler`, `src/gbif/entry.server.tsx`); the client pre-resolves in `loadLazyRoutes`
before `hydrateRoot` (`src/gbif/entry.client.tsx`).

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

**Caveat: `loader` stays on the route object.** The plugins wrap it at build time to inject
`config`, `locale`, `graphql`, `isPreview`; a loader returned from `lazy()` bypasses that. Static
also lets it fetch in parallel with the element chunk.
