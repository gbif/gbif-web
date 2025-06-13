import { Table } from '@/components/dashboard/shared';
import { FormattedDateRange } from '@/components/message';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DatasetEventListQuery, DatasetEventListQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Paging } from '../../../taxon/key/VernacularNameTable';

const DEFAULT_LIMIT = 10;

// eventID is used to show sibling events
// parentEventID is used to show child events
// if both are provided, the eventID will be used to show sibling events
const EventList = ({
  datasetKey,
  parentEventID,
  eventID,
  isParentEvent = false,
}: {
  datasetKey: string;
  parentEventID?: string | null;
  eventID?: string | null;
  isParentEvent?: boolean;
}) => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const { data, load, loading } = useQuery<DatasetEventListQuery, DatasetEventListQueryVariables>(
    EVENT_LIST_QUERY,
    {
      lazyLoad: true,
      throwAllErrors: true,
    }
  );

  useEffect(() => {
    if (datasetKey) {
      const variables = {
        key: datasetKey,
        limit,
        offset,
        eventID: null,
        optParentEventID: parentEventID,
      };
      load({
        variables,
      });
    }
  }, [datasetKey, parentEventID, load, offset, limit]);

  const events = data?.dataset?.events?.results || [];
  return (
    <Card className="g-mb-4">
      <CardHeader>
        <CardTitle>
          {eventID && isParentEvent && (
            <FormattedMessage id="dataset.childEvents" defaultMessage={`Child events`} />
          )}
          {eventID && !isParentEvent && (
            <FormattedMessage id="dataset.siblingEvents" defaultMessage={`Sibling events`} />
          )}
          {!eventID && <FormattedMessage id="dataset.events" defaultMessage={`Events`} />}

          {!loading && data?.dataset?.eventCount && (
            <>
              : <FormattedNumber value={data?.dataset?.eventCount} />
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="g-flex g-justify-center g-items-center">
          <div className="g-flex-auto"></div>

          {!!parentEventID && !isParentEvent && (
            <div className="g-flex-none g-font-semibold ">
              <FormattedMessage id="dataset.parentEvent" defaultMessage={`Parent Event`} />:{' '}
              <DynamicLink
                to={`/dataset/${datasetKey}/parentevent/${encodeURIComponent(parentEventID)}`}
                className="g-text-primary"
              >
                {parentEventID}
              </DynamicLink>
            </div>
          )}
        </div>
        <div style={{ overflow: 'auto' }}>
          <Table removeBorder={false}>
            <thead className="[&_th]:g-text-sm [&_th]:g-font-normal [&_th]:g-py-2 [&_th]:g-text-slate-500">
              <tr>
                <th className="g-text-start">
                  <FormattedMessage id={`occurrenceFieldNames.eventID`} />
                </th>
                <th className="g-text-start">
                  <FormattedMessage id={`occurrenceFieldNames.eventDate`} />
                </th>
                <th className="g-text-start">
                  <FormattedMessage id={`occurrenceFieldNames.samplingProtocol`} />
                </th>
                <th className="g-text-start">
                  <FormattedMessage id={`dataset.occurrenceCount`} />
                </th>
              </tr>
            </thead>
            <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
              {!loading
                ? events.map((evt, i) => (
                    <tr key={`${i}}`}>
                      <td>
                        <DynamicLink
                          pageId={'datasetKey'}
                          variables={{
                            key: `${datasetKey}/event/${encodeURIComponent(
                              evt?.firstOccurrence?.eventID
                            )}`,
                          }}
                          className="g-text-primary"
                        >
                          {evt?.firstOccurrence?.eventID}
                        </DynamicLink>
                      </td>
                      <td>
                        <FormattedDateRange date={evt?.firstOccurrence?.eventDate} />
                      </td>
                      <td>{evt?.firstOccurrence?.samplingProtocol}</td>
                      <td>
                        <DynamicLink
                          className="g-text-primary"
                          pageId="occurrenceSearch"
                          searchParams={{
                            eventId: evt?.firstOccurrence?.eventID,
                            datasetKey: datasetKey,
                          }}
                        >
                          <FormattedNumber value={evt?.occurrenceCount} />
                        </DynamicLink>
                      </td>
                    </tr>
                  ))
                : Array.from({ length: 10 }).map((x, i) => (
                    <tr key={i}>
                      <td>
                        <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                      </td>
                      <td>
                        <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                      </td>
                      <td>
                        <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                      </td>
                      <td>
                        <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </Table>
          <Paging
            next={() => setOffset(offset + limit)}
            prev={() => setOffset(offset - limit)}
            isFirstPage={offset === 0}
            isLastPage={offset + limit >= (data?.dataset?.eventCount || 0)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventList;

const EVENT_LIST_QUERY = /* GraphQL */ `
  query DatasetEventList($key: ID!, $limit: Int, $offset: Int, $optParentEventID: ID) {
    dataset(key: $key) {
      eventCount(optParentEventID: $optParentEventID)
      events(key: $key, limit: $limit, offset: $offset, optParentEventID: $optParentEventID) {
        endOfRecords
        results {
          eventId
          occurrenceCount

          firstOccurrence {
            key
            eventDate
            parentEventID
            eventID
            samplingProtocol
          }
        }
      }
    }
  }
`;
