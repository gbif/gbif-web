import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { CountryKeyLayout, countryKeyLoader } from './layout';
import { CountryKeySummary } from './summary';
import { CountryKeyAbout } from './about';
import { CountryKeyPublishing } from './publishing';
import { CountryKeyParticipation } from './participation';
import { CountryKeyPublicationsFrom } from './publications/from';
import { CountryKeyPublicationsAbout } from './publications/about';
import { redirectDocument } from 'react-router-dom';
import { ParticipantQuery } from '@/gql/graphql';
import { CountryKeyAlienSpecies } from './alienSpecies';

const id = 'countryKey';

export const countryKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: ({ key } = {}, { gbifOrgLocalePrefix = '' }) => {
    if (typeof key !== 'string' && typeof key !== 'number')
      throw new Error(`'Invalid key (key is of type ${typeof key})`);
    if (key === 'search') return null;
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/country/${key}`;
  },
  path: 'country/:countryCode',
  loader: countryKeyLoader,
  element: <CountryKeyLayout />,
  children: [
    {
      index: true,
      loader: () => redirectDocument('./summary'),
    },
    {
      path: 'summary',
      element: <CountryKeySummary />,
    },
    {
      path: 'about',
      element: <CountryKeyAbout />,
    },
    {
      path: 'publishing',
      element: <CountryKeyPublishing />,
    },
    {
      path: 'participation',
      element: <CountryKeyParticipation />,
    },
    {
      path: 'alien-species',
      element: <CountryKeyAlienSpecies />,
    },
    {
      path: 'publications',
      children: [
        {
          index: true,
          loader: () => redirectDocument('./from'),
        },
        {
          path: 'from',
          element: <CountryKeyPublicationsFrom />,
        },
        {
          path: 'about',
          element: <CountryKeyPublicationsAbout />,
        },
      ],
    },
  ],
};

export function useCountryKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: ParticipantQuery };
}
