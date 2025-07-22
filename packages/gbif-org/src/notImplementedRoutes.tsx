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
    id: 'participantKey',
    path: 'participant/:key',
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
      <h1 className="g-pt-48 g-text-4xl g-font-bold g-text-slate-400 g-min-h-[80dvh]">
        Not implemented yet
      </h1>
    </main>
  );
}
