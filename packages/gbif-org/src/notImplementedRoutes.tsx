import { redirectDocument } from 'react-router-dom';
import { RouteObjectWithPlugins } from './reactRouterPlugins';

export const notImplementedRoutes: RouteObjectWithPlugins[] = [
  {
    path: 'login',
    element: <NotImplemented />,
  },
  // TODO: This route does not belong among the not implemented routes
  {
    path: 'developer/summary',
    loader: () => redirectDocument('https://techdocs.gbif.org/en/openapi'),
  },
  {
    id: 'country-key',
    gbifRedirect: (params) => {
      if (typeof params.key !== 'string') throw new Error('Invalid key');
      if (params.key === 'search') return null;
      return `/country/${params.key}`;
    },
    path: 'country/:key',
    element: <NotImplemented />,
  },
  {
    path: 'participant/:key',
    element: <NotImplemented />,
  },
  {
    path: 'species/search',
    element: <NotImplemented />,
  },
  {
    path: 'species/:key',
    element: <NotImplemented />,
  },
  {
    path: 'resource/search',
    element: <NotImplemented />,
  },
  {
    path: 'tools/species-lookup',
    element: <NotImplemented />,
  },
  {
    path: 'tools/name-parser',
    element: <NotImplemented />,
  },
  {
    path: 'tools/sequence-id',
    element: <NotImplemented />,
  },
  {
    path: 'tools/data-validator',
    element: <NotImplemented />,
  },
  {
    path: 'tools/observation-trends',
    element: <NotImplemented />,
  },
  {
    path: 'occurrence-snapshots',
    element: <NotImplemented />,
  },
  {
    path: 'the-gbif-network',
    element: <NotImplemented />,
  },
  {
    path: 'contact-us/directory',
    element: <NotImplemented />,
  },
  {
    path: 'system-health',
    element: <NotImplemented />,
  },
  {
    path: 'derived-dataset',
    element: <NotImplemented />,
    children: [
      {
        index: true,
        element: <NotImplemented />,
      },
      {
        path: 'register',
        element: <NotImplemented />,
      },
      {
        path: 'about',
        element: <NotImplemented />,
      },
    ],
  },
  {
    path: 'analytics/global',
    element: <NotImplemented />,
  },
];

function NotImplemented() {
  return (
    <main className="g-h-full g-text-center">
      <h1 className="g-mt-48 g-text-4xl g-font-bold g-text-slate-400">Not implemented yet</h1>
    </main>
  );
}