import { ErrorBlock } from '@/components/ErrorBoundary';
import { Alert } from '@/components/ui/alert';
import { useConfig } from '@/config/config';
import {
  DatasetEventQuery,
  DatasetEventQueryVariables,
  DatasetType,
  EventQuery,
  EventQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { DATASET_EVENT_QUERY } from '../datasetEventQuery';
import { EVENT_KEY_QUERY } from './eventKeyQuery';
import { SamplingEventDetail, SamplingEventDetailSkeleton } from './samplingEventDetail';

/**
 * Drawer-side view for an event opened from the global event search.
 *
 * Drawer entityKey format: `e_{datasetKey}_{eventId}`. The `e_` prefix is
 * stripped before this component is rendered. Dataset keys are UUIDs (no
 * underscores), so the first `_` cleanly separates them from the eventId,
 * which may itself contain underscores.
 *
 * This is the third event-details view in the app (alongside the sampling-
 * event detail page and the inferred-event detail page). It is intentionally
 * limited to proper sampling-event datasets — events inferred from occurrence
 * records are not surfaced through the event search and therefore have no
 * drawer entry point.
 */
export default function SamplingEventDrawerView({ entityKey }: { entityKey?: string }) {
  const sepIdx = entityKey?.indexOf('_') ?? -1;
  const datasetKey = entityKey && sepIdx > 0 ? entityKey.slice(0, sepIdx) : undefined;
  const eventId = entityKey && sepIdx > 0 ? entityKey.slice(sepIdx + 1) : undefined;
  const { defaultChecklistKey } = useConfig();

  const {
    data: occData,
    error: occError,
    load: occLoad,
  } = useQuery<DatasetEventQuery, DatasetEventQueryVariables>(DATASET_EVENT_QUERY, {
    lazyLoad: true,
    notifyOnErrors: true,
  });

  const {
    data: eventData,
    error,
    load,
  } = useQuery<EventQuery, EventQueryVariables>(EVENT_KEY_QUERY, {
    lazyLoad: true,
    notifyOnErrors: true,
  });

  useEffect(() => {
    if (datasetKey && eventId) {
      occLoad({
        variables: {
          key: datasetKey,
          limit: 1,
          offset: 0,
          eventID: eventId,
        },
      });
    }
  }, [datasetKey, eventId, occLoad]);

  useEffect(() => {
    if (occData?.dataset?.type === DatasetType.SamplingEvent && datasetKey && eventId) {
      load({
        variables: {
          eventId,
          datasetKey,
          checklistKey: defaultChecklistKey,
        },
      });
    }
  }, [occData?.dataset?.type, datasetKey, eventId, defaultChecklistKey, load]);

  const isSamplingEvent = occData?.dataset?.type === DatasetType.SamplingEvent;

  // `loading` is not a usable signal here - useQuery clears it when it aborts a request
  // that a newer one superseded. A query has settled once its response has landed,
  // whether as data or as an error. The event query is only fired once the dataset type
  // is known, so it counts as settled until that decides it is needed at all.
  const datasetSettled = occData || occError;
  const eventSettled = !isSamplingEvent || eventData || error;

  // A malformed entityKey leaves both parts undefined, so the queries never fire -
  // bail out before the loading check rather than spinning on a skeleton forever.
  if (!datasetKey || !eventId) {
    return null;
  }

  if (!datasetSettled || !eventSettled) {
    return (
      <div className="g-p-4 g-bg-slate-100">
        <SamplingEventDetailSkeleton narrow />
      </div>
    );
  }

  // Partial GraphQL errors are expected - a field that fails to serialize should
  // render blank, the way the event page does. Only give up when the dataset
  // record itself is missing, since without it we cannot pick a view.
  if (!occData?.dataset) {
    return (
      <div className="g-p-4">
        <ErrorBlock error={occError ?? error} />
      </div>
    );
  }

  if (!isSamplingEvent) {
    return (
      <div className="g-p-4 g-bg-slate-100">
        <Alert variant="warning">
          <FormattedMessage
            id="eventDetails.eventDrawerSamplingEventOnly"
            defaultMessage="Event details in this drawer are only available for sampling event datasets."
          />
        </Alert>
      </div>
    );
  }

  const datasetTitle = occData?.dataset?.title;

  return (
    <div className="g-p-4 g-bg-slate-100">
      {datasetTitle && (
        <div className="g-mb-2 g-text-sm g-text-slate-600">
          <DynamicLink
            pageId="datasetKey"
            variables={{ key: datasetKey }}
            className="g-text-primary hover:g-underline"
          >
            {datasetTitle}
          </DynamicLink>
        </div>
      )}
      <SamplingEventDetail data={occData} eventData={eventData} datasetKey={datasetKey} narrow />
    </div>
  );
}
