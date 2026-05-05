import { redirectDocument } from 'react-router-dom';
import { RouteObjectWithPlugins } from './reactRouterPlugins';

export const notImplementedRoutes: RouteObjectWithPlugins[] = [
  {
    path: 'developer/summary',
    loader: () => redirectDocument('https://techdocs.gbif.org/en/openapi'),
  },
  {
    path: 'tools/observation-trends',
    loader: () =>
      redirectDocument(`${import.meta.env.PUBLIC_TOOLS_GBIF_ORG}/tools/observation-trends`),
  },
  {
    path: 'derived-dataset/register',
    loader: () => redirectDocument('../derived-dataset'),
  },
];
