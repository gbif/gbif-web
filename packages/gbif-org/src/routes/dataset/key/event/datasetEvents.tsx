import EmptyTab from '@/components/EmptyTab';
import { DatasetType } from '@/gql/graphql';
import { useDatasetKeyContext } from '../datasetKey';
import InferredEventsDatasetEvents from './inferredFromOccurrence/inferredEventsDatasetEvents';
import SamplingEventDatasetEvents from './samplingEvent/samplingEventDatasetEvents';

/**
 * Dispatcher for the dataset "Events" tab.
 *
 * Two distinct flows live behind this single route, each with their own
 * folder of components:
 *   - Sampling-event datasets render `SamplingEventDatasetEvents`
 *     (event-API powered browser, with a feature-flag fallback).
 *   - Other dataset types render `InferredEventsDatasetEvents`, which derives
 *     events from `eventID`/`parentEventID` on occurrence records.
 */
const DatasetEvents = () => {
  const { showEventsTab, datasetType } = useDatasetKeyContext();

  if (!showEventsTab) return <EmptyTab />;

  if (datasetType === DatasetType.SamplingEvent) {
    return <SamplingEventDatasetEvents />;
  }

  return <InferredEventsDatasetEvents />;
};

export default DatasetEvents;
