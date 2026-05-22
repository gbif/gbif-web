import { Alert } from '@/components/ui/alert';
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
import { SamplingEventDetail } from './samplingEventDetail';

/**
 * Drawer-side view for an event opened from the global event search.
 *
 * Drawer entityKey format: `e_{datasetKey}___{eventId}`. The `e_` prefix is
 * stripped before this component is rendered.
 *
 * This is the third event-details view in the app (alongside the sampling-
 * event detail page and the inferred-event detail page). It is intentionally
 * limited to proper sampling-event datasets — events inferred from occurrence
 * records are not surfaced through the event search and therefore have no
 * drawer entry point.
 */
export default function SamplingEventDrawerView({ entityKey }: { entityKey?: string }) {
  const datasetKey = entityKey?.split('___')[0];
  const eventId = entityKey?.split('___')[1];

  const {
    data: occData,
    loading: occLoading,
    error: occError,
    load: occLoad,
  } = useQuery<DatasetEventQuery, DatasetEventQueryVariables>(DATASET_EVENT_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  const {
    data: eventData,
    loading,
    error,
    load,
  } = useQuery<EventQuery, EventQueryVariables>(EVENT_KEY_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
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
        },
      });
    }
  }, [occData?.dataset?.type, datasetKey, eventId, load]);

  if (!entityKey) {
    return null;
  }

  if (loading || occLoading) {
    return (
      <div className="g-p-4">
        <div>
          <FormattedMessage id="phrases.loading" defaultMessage="Loading…" />
        </div>
      </div>
    );
  }

  if (error || occError) {
    return (
      <div className="g-p-4">
        <div>Error loading event: {(error ?? occError)?.message}</div>
      </div>
    );
  }

  if (occData?.dataset?.type !== DatasetType.SamplingEvent) {
    return (
      <div className="g-p-4 g-bg-slate-100">
        <Alert variant="warning">
          <FormattedMessage
            id="dataset.eventDrawerSamplingEventOnly"
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
            variables={{ key: datasetKey! }}
            className="g-text-primary hover:g-underline"
          >
            {datasetTitle}
          </DynamicLink>
        </div>
      )}
      <SamplingEventDetail
        data={occData}
        eventData={eventData}
        datasetKey={datasetKey!}
        narrow
      />
    </div>
  );
}
