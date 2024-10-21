import { StandaloneWrapper } from '@/components/standaloneWrapper';
import { occurrenceKeyRoutes } from '.';

type Props = {
  occurrenceKey?: string | null;
};

export function StandaloneOccurrenceKeyPage({ occurrenceKey }: Props) {
  return (
    <StandaloneWrapper
      routes={occurrenceKeyRoutes}
      url={`/occurrence/${occurrenceKey ?? 'loading'}`}
    />
  );
}
