import { redirectDocument } from 'react-router-dom';
import { RouteObjectWithPlugins } from './reactRouterPlugins';

export const notImplementedRoutes: RouteObjectWithPlugins[] = [
  {
    path: 'developer/summary',
    loader: () => redirectDocument('https://techdocs.gbif.org/en/openapi'),
  },
  {
    path: 'tools/species-lookup',
    loader: () => redirectDocument(`${import.meta.env.PUBLIC_TOOLS_GBIF_ORG}/tools/species-lookup`),
  },
  {
    path: 'tools/name-parser',
    loader: () => redirectDocument(`${import.meta.env.PUBLIC_TOOLS_GBIF_ORG}/tools/name-parser`),
  },
  {
    path: 'tools/sequence-id',
    loader: () => redirectDocument(`${import.meta.env.PUBLIC_TOOLS_GBIF_ORG}/tools/sequence-id`),
  },
  {
    path: 'tools/data-validator',
    loader: () => redirectDocument(`${import.meta.env.PUBLIC_TOOLS_GBIF_ORG}/tools/data-validator`),
  },
  {
    path: 'tools/observation-trends',
    loader: () =>
      redirectDocument(`${import.meta.env.PUBLIC_TOOLS_GBIF_ORG}/tools/observation-trends`),
  },
  {
    path: 'derived-dataset',
    loader: () => redirectDocument(`${import.meta.env.PUBLIC_TOOLS_GBIF_ORG}/derived-dataset`),
    children: [
      {
        index: true,
        loader: () => redirectDocument(`${import.meta.env.PUBLIC_TOOLS_GBIF_ORG}/derived-dataset`),
      },
      {
        path: 'register',
        loader: () =>
          redirectDocument(`${import.meta.env.PUBLIC_TOOLS_GBIF_ORG}/derived-dataset/register`),
      },
      {
        path: 'about',
        loader: () =>
          redirectDocument(`${import.meta.env.PUBLIC_TOOLS_GBIF_ORG}/derived-dataset/about`),
      },
    ],
  },
];
