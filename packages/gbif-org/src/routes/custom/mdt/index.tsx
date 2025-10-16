import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import MdtData from './MdtData';
import { MdtInstallations } from './MdtInstallations';
import { MdtOccurrences } from './MdtOccurrences';
import { createContext } from 'react';
import { MdtDatasetsQuery } from '@/gql/graphql';
import { MdLink } from 'react-icons/md';

export const mdtRoute: RouteObjectWithPlugins = {
  id: 'mdt',
  path: 'mdt',
  gbifRedirect: (_, { gbifOrgLocalePrefix = '' }) => {
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/mdt`;
  },
  element: <MdtData />,
  children: [
    {
      index: true,
      id: 'mdtOccurrences',
      path: 'occurrences',
      element: <MdtOccurrences />,
    },
    {
      id: 'mdtInstallations',
      path: 'installations',
      element: <MdtInstallations />,
    },
  ],
};
