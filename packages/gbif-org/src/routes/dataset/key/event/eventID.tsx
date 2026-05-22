import EmptyTab from '@/components/EmptyTab';
import {
  DatasetEventQuery,
  DatasetEventQueryVariables,
  DatasetType,
  EventQuery,
  EventQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { useDatasetKeyContext } from '../datasetKey';
import { DATASET_EVENT_QUERY } from './datasetEventQuery';
import { InferredEventDetail } from './inferredFromOccurrence/inferredEventDetail';
import { EVENT_KEY_QUERY } from './samplingEvent/eventKeyQuery';
import { SamplingEventDetail } from './samplingEvent/samplingEventDetail';

export function eventLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');
  const eventID = required(params.eventID, 'No Event ID was provided in the URL');

  return graphql.query<DatasetEventQuery, DatasetEventQueryVariables>(DATASET_EVENT_QUERY, {
    key,
    limit: 1,
    offset: 0,
    eventID,
  });
}

export function parentEventLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');
  const parentEventID = required(
    params.parentEventID,
    'No Parent Event ID was provided in the URL'
  );

  return graphql.query<DatasetEventQuery, DatasetEventQueryVariables>(DATASET_EVENT_QUERY, {
    optParentEventID: parentEventID,
    key,
    limit: 1,
    offset: 0,
  });
}

/**
 * Dispatcher for the dataset event detail route `/dataset/:key/event/:eventID`.
 *
 * Sampling-event datasets get the rich `SamplingEventDetail` view (uses the
 * event API). Other datasets get `InferredEventDetail` which is derived from
 * occurrence records.
 */
export const DatasetEventID = () => {
  const { showEventsTab } = useDatasetKeyContext();
  if (showEventsTab) return <DatasetEventDetailDispatcher />;
  return <EmptyTab />;
};

const DatasetEventDetailDispatcher = () => {
  const { data } = useLoaderData() as { data: DatasetEventQuery };
  const { datasetKey } = useDatasetKeyContext();
  const isSamplingEvent = data?.dataset?.type === DatasetType.SamplingEvent;

  return (
    <div className="g-bg-slate-100 g-px-4 lg:g-px-8">
      <ArticleTextContainer className="g-max-w-screen-xl g-pb-6">
        {isSamplingEvent ? (
          <SamplingEventDetailLoader data={data} datasetKey={datasetKey} />
        ) : (
          <InferredEventDetail data={data} datasetKey={datasetKey} />
        )}
      </ArticleTextContainer>
    </div>
  );
};

const SamplingEventDetailLoader = ({
  data,
  datasetKey,
}: {
  data?: DatasetEventQuery;
  datasetKey: string;
}) => {
  const { eventID } = useParams<{ eventID: string }>();
  const { data: eventData, load } = useQuery<EventQuery, EventQueryVariables>(EVENT_KEY_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  useEffect(() => {
    if (data?.dataset?.key) {
      load({
        variables: {
          eventId: eventID,
          datasetKey: data?.dataset?.key,
        },
      });
    }
  }, [data?.dataset?.key, eventID, load]);

  return <SamplingEventDetail data={data} eventData={eventData} datasetKey={datasetKey} />;
};

export default DatasetEventID;
