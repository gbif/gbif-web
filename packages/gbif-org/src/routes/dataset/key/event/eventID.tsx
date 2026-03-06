import {
  DatasetEventQuery,
  DatasetEventQueryVariables,
  EventQuery,
  EventQueryVariables,
  DatasetType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs } from '@/reactRouterPlugins';

import { required } from '@/utils/required';
import { useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import { Event } from './event';
import { GRAPHQL_EVENT } from '../../../events/key/EventDrawer';

export function eventLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');
  const eventID = required(params.eventID, 'No Event ID was provided in the URL');

  return graphql.query<DatasetEventQuery, DatasetEventQueryVariables>(EVENT_QUERY, {
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

  return graphql.query<DatasetEventQuery, DatasetEventQueryVariables>(EVENT_QUERY, {
    optParentEventID: parentEventID,
    key,
    limit: 1,
    offset: 0,
  });
}

export const DatasetEventID = () => {
  const { data } = useLoaderData() as { data: DatasetEventQuery };
  const { eventID } = useParams<{ eventID: string }>();

  const {
    data: eventData,
    loading,
    error,
    load,
  } = useQuery<EventQuery, EventQueryVariables>(GRAPHQL_EVENT, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  useEffect(() => {
    if (data?.dataset?.type == DatasetType.SamplingEvent) {
      load({
        variables: {
          eventId: eventID,
          datasetKey: data?.dataset?.key,
        },
      });
    }
  }, [data?.dataset?.type, data?.dataset?.key, eventID, load]);

  return <Event data={data} eventData={eventData} eventDataLoading={loading} />;
};
export default DatasetEventID;

export const EVENT_QUERY = /* GraphQL */ `
  query DatasetEvent($key: ID!, $limit: Int, $offset: Int, $eventID: ID, $optParentEventID: ID) {
    dataset(key: $key) {
      key
      type
      samplingDescription {
        studyExtent
        methodSteps
        sampling
      }
      events(
        key: $key
        limit: $limit
        offset: $offset
        eventID: $eventID
        optParentEventID: $optParentEventID
      ) {
        endOfRecords
        results {
          eventId
          firstOccurrence {
            volatile {
              globe {
                svg
              }
            }
            countryCode
            eventDate
            key
            datasetKey
            decimalLatitude
            decimalLongitude
            parentEventID
            eventID
          }
        }
      }
    }
  }
`;
