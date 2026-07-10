import { Alert } from '@/components/ui/alert';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage } from 'react-intl';
import { useDatasetKeyContext } from '../../datasetKey';
import InferredEventList from './inferredEventList';

/**
 * Event list for datasets where events are inferred from occurrence records
 * (the dataset is not modelled as a sampling event dataset, but the occurrence
 * records carry eventID / parentEventID). Backed by the dataset events
 * resolver which aggregates occurrence records by eventId.
 */
export default function InferredEventsDatasetEvents() {
  const { datasetKey } = useDatasetKeyContext();

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <InferredEventsNotice />
        <InferredEventList datasetKey={datasetKey} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

export function InferredEventsNotice() {
  return (
    <Alert variant="warning" className="g-mb-4">
      <FormattedMessage
        id="eventDetails.inferredEventsNotice"
        defaultMessage="This dataset is not modelled as an event dataset. The events listed below are inferred from the eventID and parentEventID fields on the occurrence records."
      />
    </Alert>
  );
}
