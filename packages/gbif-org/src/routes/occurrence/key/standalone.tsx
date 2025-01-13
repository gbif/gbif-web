import { StandaloneWrapper } from '@/components/standaloneWrapper';
import { useConfig } from '@/config/config';
import { dataRoutes } from '@/config/routes';
import { useMemo } from 'react';
import { OccurrenceKeySkeleton } from './occurrenceKey';

type Props = {
  occurrenceKey?: string | null;
};

export function StandaloneOccurrenceKeyPage({ occurrenceKey }: Props) {
  const rootConfig = useConfig();
  const standaloneConfig = useMemo(
    () => ({ ...rootConfig, availableCatalogues: [], pages: [{ id: 'occurrenceKey' }] }),
    [rootConfig]
  );

  return (
    <StandaloneWrapper
      config={standaloneConfig}
      loadingElement={<OccurrenceKeySkeleton />}
      routes={dataRoutes}
      url={`/occurrence/${occurrenceKey}`}
    />
  );
}
