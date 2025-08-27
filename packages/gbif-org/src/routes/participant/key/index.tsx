import { ParticipantDetailsQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { ParticipantKeyAbout } from './about';
import { ParticipantPage, ParticipantPageSkeleton, participantLoader } from './participantKey';

const id = 'participantKey';

export const participantKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: ({ key } = {}, { gbifOrgLocalePrefix = '' }) => {
    if (typeof key !== 'string' && typeof key !== 'number')
      throw new Error(`'Invalid key (key is of type ${typeof key})`);
    if (key === 'search') return null;
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/participant/${key}`;
  },
  path: 'participant/:key',
  loader: participantLoader,
  loadingElement: <ParticipantPageSkeleton />,
  element: <ParticipantPage />,
  children: [
    {
      index: true,
      element: <ParticipantKeyAbout />,
    },
  ],
};

export function useParticipantKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: ParticipantDetailsQuery };
}
