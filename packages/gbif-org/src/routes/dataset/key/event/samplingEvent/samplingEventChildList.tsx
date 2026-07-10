import { Table } from '@/components/dashboard/shared';
import { FormattedDateRange } from '@/components/message';
import { Paging } from '@/components/paging';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Card } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { SubEventsQuery, SubEventsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

const DEFAULT_LIMIT = 10;

/**
 * Paged list of sub-events ("Child events") for an event on a sampling-event
 * dataset. Driven by the Event API's `subEvents` resolver (REST /subEvents).
 */
export function SamplingEventChildList({
  datasetKey,
  eventId,
  totalCount,
}: {
  datasetKey: string;
  eventId: string;
  totalCount?: number | null;
}) {
  const [offset, setOffset] = useState(0);
  const [limit] = useState(DEFAULT_LIMIT);
  const { data, load, loading } = useQuery<SubEventsQuery, SubEventsQueryVariables>(
    SUB_EVENTS_QUERY,
    { lazyLoad: true, throwAllErrors: false }
  );

  useEffect(() => {
    if (datasetKey && eventId) {
      load({ variables: { datasetKey, eventId, limit, offset } });
    }
  }, [datasetKey, eventId, limit, offset, load]);

  const events = data?.event?.subEvents?.results ?? [];
  const count = data?.event?.subEvents?.count ?? totalCount ?? 0;

  return (
    <Card className="g-mb-4 g-scroll-mt-24" id="child-events">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="dataset.childEvents" defaultMessage="Child events" />
          {!loading && count > 0 && (
            <>
              : <FormattedNumber value={count} />
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ overflow: 'auto' }}>
          <Table removeBorder={false}>
            <thead className="[&_th]:g-text-sm [&_th]:g-font-normal [&_th]:g-py-2 [&_th]:g-text-slate-500">
              <tr>
                <th className="g-text-start">
                  <FormattedMessage id="occurrenceFieldNames.eventID" defaultMessage="Event ID" />
                </th>
                <th className="g-text-start">
                  <FormattedMessage id="occurrenceFieldNames.eventType" defaultMessage="Event type" />
                </th>
                <th className="g-text-start">
                  <FormattedMessage
                    id="occurrenceFieldNames.eventDate"
                    defaultMessage="Event date"
                  />
                </th>
                <th className="g-text-start">
                  <FormattedMessage
                    id="occurrenceFieldNames.samplingProtocol"
                    defaultMessage="Sampling protocol"
                  />
                </th>
              </tr>
            </thead>
            <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
              {!loading
                ? events.map((evt, i) => (
                    <tr key={evt?.eventID ?? i}>
                      <td>
                        {evt?.eventID && (
                          <DynamicLink
                            pageId="datasetKey"
                            variables={{
                              key: `${datasetKey}/event/${encodeURIComponent(evt.eventID)}`,
                            }}
                            className="g-text-primary"
                          >
                            {evt.eventID}
                          </DynamicLink>
                        )}
                      </td>
                      <td>{evt?.eventType}</td>
                      <td>
                        {evt?.eventDate && (
                          <FormattedDateRange
                            start={evt.eventDate.from ?? undefined}
                            end={evt.eventDate.to ?? undefined}
                          />
                        )}
                      </td>
                      <td>{evt?.samplingProtocol}</td>
                    </tr>
                  ))
                : Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 4 }).map((__, j) => (
                        <td key={j}>
                          <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </Table>
          <Paging
            next={() => setOffset(offset + limit)}
            prev={() => setOffset(offset - limit)}
            isFirstPage={offset === 0}
            isLastPage={offset + limit >= count}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const SUB_EVENTS_QUERY = /* GraphQL */ `
  query subEvents($eventId: ID, $datasetKey: ID, $limit: Int, $offset: Int) {
    event(eventId: $eventId, datasetKey: $datasetKey) {
      eventID
      subEvents(limit: $limit, offset: $offset) {
        count
        endOfRecords
        results {
          eventID
          eventType
          samplingProtocol
          decimalLatitude
          decimalLongitude
          eventDate {
            from
            to
          }
        }
      }
    }
  }
`;
