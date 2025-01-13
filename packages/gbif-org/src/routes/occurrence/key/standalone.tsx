import { StandaloneWrapper } from '@/components/standaloneWrapper';
import { useConfig } from '@/config/config';
import { dataRoutes } from '@/config/routes';
import { useMemo } from 'react';
import { OccurrenceKeySkeleton } from './occurrenceKey';

type Props = {
  url: string;
};

export function StandaloneOccurrenceKeyPage({ url }: Props) {
  const rootConfig = useConfig();
  const standaloneConfig = useMemo(
    () => ({
      ...rootConfig,
      availableCatalogues: [],
      pages: [
        { id: 'occurrenceKey' },
        { id: 'datasetKey' },
        { id: 'publisherKey' },
        { id: 'collectionKey' },
        { id: 'institutionKey' },
        { id: 'speciesKey' },
      ],
    }),
    [rootConfig]
  );

  return (
    <StandaloneWrapper
      config={standaloneConfig}
      loadingElement={<OccurrenceKeySkeleton />}
      routes={dataRoutes}
      url={url}
    />
  );
}
