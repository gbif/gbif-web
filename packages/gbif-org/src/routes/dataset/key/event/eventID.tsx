import EmptyTab from '@/components/EmptyTab';
import {
  DatasetEventQuery,
  DatasetEventQueryVariables,
  DatasetType,
  EventQuery,
  EventQueryVariables,
} from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { required } from '@/utils/required';
import { useLoaderData } from 'react-router-dom';
import { useDatasetKeyContext } from '../datasetKey';
import { DATASET_EVENT_QUERY } from './datasetEventQuery';
import { InferredEventDetail } from './inferredFromOccurrence/inferredEventDetail';
import { EVENT_KEY_QUERY } from './samplingEvent/eventKeyQuery';
import { SamplingEventDetail } from './samplingEvent/samplingEventDetail';

type EventLoaderResult = {
  data: DatasetEventQuery;
  eventData: EventQuery | null;
};

export async function eventLoader({ params, graphql, config }: LoaderArgs): Promise<EventLoaderResult> {
  const key = required(params.key, 'No key was provided in the URL');
  const eventID = required(params.eventID, 'No Event ID was provided in the URL');

  // Fetch the dataset-events row + the event API record in parallel. The event
  // API query only resolves for SAMPLING_EVENT datasets, but we kick it off
  // unconditionally so the response is ready before render — for non-sampling
  // datasets the result is simply unused (and any error is swallowed).
  const [datasetEventsRes, eventRes] = await Promise.all([
    graphql.query<DatasetEventQuery, DatasetEventQueryVariables>(DATASET_EVENT_QUERY, {
      key,
      limit: 1,
      offset: 0,
      eventID,
    }),
    graphql
      .query<EventQuery, EventQueryVariables>(EVENT_KEY_QUERY, {
        eventId: eventID,
        datasetKey: key,
        checklistKey: config.defaultChecklistKey,
      })
      .catch(() => null),
  ]);

  const datasetEventsJson = await datasetEventsRes.json();
  const eventJson = eventRes ? await eventRes.json().catch(() => null) : null;

  return {
    data: datasetEventsJson.data as DatasetEventQuery,
    eventData: (eventJson?.data as EventQuery | undefined) ?? null,
  };
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
  const { data, eventData } = useLoaderData() as EventLoaderResult;
  const { datasetKey } = useDatasetKeyContext();
  const isSamplingEvent = data?.dataset?.type === DatasetType.SamplingEvent;

  return (
    <div className="g-bg-slate-100 g-px-4 lg:g-px-8">
      <ArticleTextContainer className="g-max-w-screen-xl g-pb-6">
        {isSamplingEvent ? (
          <SamplingEventDetail
            data={data}
            eventData={eventData ?? undefined}
            datasetKey={datasetKey}
          />
        ) : (
          <InferredEventDetail data={data} datasetKey={datasetKey} />
        )}
      </ArticleTextContainer>
    </div>
  );
};

export default DatasetEventID;
