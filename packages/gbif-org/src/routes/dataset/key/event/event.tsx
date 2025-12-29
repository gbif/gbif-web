import { Classification } from '@/components/classification';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { Taxa } from '@/components/dashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Globe from '@/components/globe';
import { OccurrenceIcon } from '@/components/highlights';
import { HyperText } from '@/components/hyperText';
import { AdHocMapThumbnail } from '@/components/maps/mapThumbnail';
import { FormattedDateRange } from '@/components/message';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/smallCard';
import { GenericEventExtension } from './eventExtensions';
import {
  DatasetEventQuery,
  EventQuery,
  EventInsightsQuery,
  EventInsightsQueryVariables,
  PredicateType,
  DatasetType,
} from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { SidebarLayout, Aside } from '@/routes/occurrence/key/pagelayouts';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import formatAsPercentage from '@/utils/formatAsPercentage';
import { Progress } from '@radix-ui/react-progress';
import { useContext, useState, useEffect } from 'react';
import { FaGlobeAfrica } from 'react-icons/fa';
import { MdImage, MdEvent } from 'react-icons/md';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useLocation, useLoaderData, Link } from 'react-router-dom';
import { Images } from '../about/Images';
import { DatasetKeyContext } from '../datasetKey';
import EventList from './eventList';
import EventTaxonomy from './eventTaxonomy';
import Properties, { Property } from '@/components/properties';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/shadcn';
export const Event = ({
  data,
  eventData,
  className = '',
}: {
  data?: DatasetEventQuery;
  eventData?: EventQuery;
  className?: string;
}) => {
  const { datasetKey, datasetType } = useContext(DatasetKeyContext);
  const hideSidebar = useBelow(1000);
  const hideGlobe = useBelow(800);
  const location = useLocation();
  const [parentEventIdFromPath, setParentEventIdFromPath] = useState('');

  const { eventId, firstOccurrence } = data?.dataset?.events?.results?.[0] ?? {};
  const decimalLatitude =
    eventData?.event?.decimalLatitude || firstOccurrence?.decimalLatitude || null;
  const decimalLongitude =
    eventData?.event?.decimalLongitude || firstOccurrence?.decimalLongitude || null;
  const eventID = firstOccurrence?.eventID;
  const countryCode = firstOccurrence?.countryCode;
  const eventDate = firstOccurrence?.eventDate;

  const occDynamicLinkProps = {
    pageId: 'occurrenceSearch',
    searchParams: { datasetKey: data?.dataset?.key },
  };
  const { data: insights, load } = useQuery<EventInsightsQuery, EventInsightsQueryVariables>(
    EVENT_SLOW,
    {
      throwAllErrors: false,
      lazyLoad: true,
      notifyOnErrors: true,
    }
  );
  useEffect(() => {
    const splitted = location?.pathname?.split('/');
    if (splitted[splitted.length - 2] === 'parentevent') {
      setParentEventIdFromPath(splitted[splitted.length - 1]);
    } else {
      setParentEventIdFromPath('');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (datasetKey === null) return;
    const datasetPredicate = {
      type: PredicateType.And,
      predicates: [{ type: PredicateType.Equals, key: 'datasetKey', value: datasetKey }],
    };
    if (parentEventIdFromPath) {
      datasetPredicate.predicates.push({
        type: PredicateType.Equals,
        key: 'parentEventId',
        value: parentEventIdFromPath,
      });
    } else if (eventID) {
      datasetPredicate.predicates.push({
        type: PredicateType.Equals,
        key: 'eventId',
        value: eventID,
      });
    }
    load({
      variables: {
        datasetPredicate: datasetPredicate,
        imagePredicate: {
          type: PredicateType.And,
          predicates: [
            datasetPredicate,
            { type: PredicateType.Equals, key: 'mediaType', value: 'StillImage' },
          ],
        },
        coordinatePredicate: {
          type: PredicateType.And,
          predicates: [
            datasetPredicate,
            { type: PredicateType.Equals, key: 'hasCoordinate', value: 'true' },
            { type: PredicateType.Equals, key: 'hasGeospatialIssue', value: 'false' },
          ],
        },
        taxonPredicate: {
          type: PredicateType.And,
          predicates: [
            datasetPredicate,
            { type: PredicateType.Equals, key: 'issue', value: 'TAXON_MATCH_NONE' },
          ],
        },
        yearPredicate: {
          type: PredicateType.And,
          predicates: [datasetPredicate, { type: PredicateType.IsNotNull, key: 'year' }],
        },
      },
    });
  }, [load, datasetKey, eventID, parentEventIdFromPath]);

  const withCoordinates = insights?.withCoordinates?.documents?.total;
  const withYear = insights?.withYear?.documents?.total;
  const withTaxonMatch =
    insights?.unfiltered?.documents?.total - insights?.withTaxonMatch?.documents?.total;

  const total = insights?.unfiltered?.documents?.total;
  const withCoordinatesPercentage = formatAsPercentage(withCoordinates / total);
  const withYearPercentage = formatAsPercentage(withYear / total);
  const withTaxonMatchPercentage = formatAsPercentage(withTaxonMatch / total);
  const overviewZoom = 8;
  const sateliteZoom = 12;

  return (
    <div className={cn('g-bg-slate-100', className)}>
      <Classification className="g-m-auto g-max-w-screen-xl g-p-3">
        <span>
          <DynamicLink
            pageId={'datasetKey'}
            variables={{ key: `${datasetKey}/events` }}
            className="g-text-inherit hover:g-underline"
          >
            <FormattedMessage id="dataset.events" defaultMessage={`Events`} />
          </DynamicLink>
        </span>
        {!!parentEventIdFromPath && (
          <span>
            <FormattedMessage id="occurrenceFieldNames.parentEventID" />: {parentEventIdFromPath}
          </span>
        )}
        {!parentEventIdFromPath && (
          <span>
            <FormattedMessage id="occurrenceFieldNames.eventID" />: {eventId}
          </span>
        )}
      </Classification>
      <ArticleTextContainer className="g-max-w-screen-xl g-pb-6">
        <SidebarLayout
          reverse
          className="g-grid-cols-[250px_1fr] xl:g-grid-cols-[300px_1fr]"
          stack={hideSidebar}
        >
          <div className="g-order-last">
            <Card className="g-mb-4">
              <div className="g-pt-4 g-pl-4 g-pr-4 g-pb-0">
                <div className="g-flex g-items-center">
                  <div className="g-p-0 md:g-p-4 g-pt-0 md:g-pt-4">
                    <h2 className="g-text-2xl g-font-semibold g-leading-none g-tracking-tight">
                      {' '}
                      {!!parentEventIdFromPath && (
                        <>
                          <FormattedMessage id="occurrenceFieldNames.parentEventID" />:{' '}
                          {parentEventIdFromPath}
                        </>
                      )}
                      {!parentEventIdFromPath && (
                        <>
                          <FormattedMessage id="occurrenceFieldNames.eventID" />: {eventId}
                        </>
                      )}
                    </h2>
                  </div>
                  <div className="g-flex g-justify-end g-flex-1"></div>
                  {!hideGlobe && firstOccurrence?.volatile?.globe && (
                    <div className="g-flex">
                      <Globe
                        lat={decimalLatitude}
                        lon={decimalLongitude}
                        {...firstOccurrence?.volatile?.globe}
                        className="g-w-16 g-h-16 g-me-4 g-mb-4"
                      />
                    </div>
                  )}
                </div>
              </div>
              {!!data?.dataset?.samplingDescription?.sampling && (
                <>
                  <div className="g-p-0 md:g-p-8 g-pt-0 md:g-pt-8">
                    <h2 className="g-text-2xl g-font-semibold g-leading-none g-tracking-tight">
                      <FormattedMessage id="dataset.sampling" />
                    </h2>
                  </div>
                  <CardContent>
                    <HyperText
                      text={data?.dataset?.samplingDescription?.sampling}
                      disableMarkdownParsing
                    />
                  </CardContent>
                </>
              )}
            </Card>
            {insights?.images?.documents?.total > 0 && (
              <>
                <Images
                  images={insights?.images}
                  className="g-mb-4"
                  link={
                    <DynamicLink
                      pageId="occurrenceSearch"
                      searchParams={
                        parentEventIdFromPath
                          ? {
                              datasetKey: datasetKey,
                              parentEventId: parentEventIdFromPath,
                              view: 'gallery',
                            }
                          : { datasetKey: datasetKey, eventId: eventID, view: 'gallery' }
                      }
                    >
                      <SimpleTooltip title={<span>Records with images</span>} placement="auto">
                        <div className="g-flex g-place-items-center">
                          <MdImage style={{ marginRight: 8 }} />{' '}
                          <span>
                            <FormattedNumber value={insights?.images?.documents?.total} />
                          </span>
                        </div>
                      </SimpleTooltip>
                    </DynamicLink>
                  }
                />
              </>
            )}
            {datasetType === DatasetType.Occurrence && (
              <ErrorBoundary
                type="BLOCK"
                errorMessage={<FormattedMessage id="dataset.errors.eventList" />}
              >
                <EventList
                  datasetKey={data?.dataset?.key}
                  parentEventID={parentEventIdFromPath || firstOccurrence?.parentEventID}
                  eventID={firstOccurrence?.eventID || parentEventIdFromPath}
                  isParentEvent={!!parentEventIdFromPath}
                />
              </ErrorBoundary>
            )}

            <ErrorBoundary
              type="BLOCK"
              errorMessage={<FormattedMessage id="dataset.errors.eventList" />}
            >
              <EventTaxonomy
                datasetKey={data?.dataset?.key}
                parentEventID={parentEventIdFromPath || firstOccurrence?.parentEventID}
                eventID={firstOccurrence?.eventID || parentEventIdFromPath}
                isParentEvent={!!parentEventIdFromPath}
              />
            </ErrorBoundary>
            <ClientSideOnly>
              <ErrorBoundary
                type="BLOCK"
                errorMessage={<FormattedMessage id="dataset.errors.taxa" />}
              >
                <Taxa
                  defaultRank={'species'}
                  predicate={{
                    type: PredicateType.And,
                    predicates: [
                      {
                        type: PredicateType.Equals,
                        key: 'datasetKey',
                        value: data?.dataset?.key,
                      },
                      parentEventIdFromPath
                        ? {
                            type: PredicateType.Equals,
                            key: 'parentEventId',
                            value: parentEventIdFromPath,
                          }
                        : {
                            type: PredicateType.Equals,
                            key: 'eventId',
                            value: eventID,
                          },
                    ],
                  }}
                />
              </ErrorBoundary>
            </ClientSideOnly>
            {eventData?.event?.extensions && (
              <div className="g-mt-4">
                {Object.keys(eventData?.event?.extensions)
                  .filter((ext) => !!eventData?.event?.extensions?.[ext])
                  .map((ext) => (
                    <GenericEventExtension
                      key={ext}
                      event={eventData?.event}
                      label={`occurrenceDetails.extensions.${ext}.name`}
                      extensionName={ext}
                      id={ext}
                    />
                  ))}
              </div>
            )}
          </div>
          {!hideSidebar && (
            <Aside className="">
              {!parentEventIdFromPath && decimalLongitude && (
                <div className="g-block g-relative g-group">
                  <Card className="g-mb-0">
                    <img
                      src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${decimalLongitude},${decimalLatitude})/${decimalLongitude},${decimalLatitude},${overviewZoom},0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
                    />
                    <img
                      className="g-absolute g-opacity-0 g-top-0 group-hover:g-opacity-100 g-transition-opacity gb-on-hover"
                      src={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s-circle+285A98(${decimalLongitude},${decimalLatitude})/${decimalLongitude},${decimalLatitude},${sateliteZoom},0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
                    />
                  </Card>
                </div>
              )}
              {!!parentEventIdFromPath && (
                <Card className="g-mb-4">
                  {' '}
                  <AdHocMapThumbnail
                    filter={{ parentEventId: parentEventIdFromPath }}
                    className="g-rounded g-border"
                    params={{
                      mode: 'GEO_CENTROID',
                      hexPerTile: '16',
                      bin: 'hex',
                      style: 'classic-noborder.poly',
                    }}
                  />
                </Card>
              )}
              {!parentEventIdFromPath && (
                <Card className="g-mb-4">
                  {
                    <CardContent className="g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
                      <div className="g-flex g-items-center">
                        {countryCode && (
                          <div className="g-flex g-overflow-hidden g-text-ellipsis g-flex g-items-center g-opacity-60">
                            <FaGlobeAfrica className="g-flex-shrink-0" />
                            <span className="g-ms-1 g-flex-grow g-overflow-hidden g-text-ellipsis">
                              <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                            </span>
                          </div>
                        )}
                        <div className="g-flex-auto g-justify-end g-flex-1"></div>
                        {eventDate && (
                          <div className="g-flex g-overflow-hidden g-text-ellipsis g-flex g-items-center g-opacity-60">
                            <MdEvent className="g-flex-shrink-0" />
                            <span className="g-ms-1 g-flex-grow g-overflow-hidden g-text-ellipsis">
                              <FormattedDateRange date={eventDate} />
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  }
                </Card>
              )}
              <ErrorBoundary
                type="BLOCK"
                errorMessage={<FormattedMessage id="dataset.errors.occurrenceInfo" />}
              >
                <Card>
                  {(total === 0 || !!total) && (
                    <CardContent className="g-flex g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
                      <div className="g-flex-none g-me-2">
                        <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                          <OccurrenceIcon />
                        </div>
                      </div>
                      <div className="g-flex-auto g-mt-0.5 g-mb-2">
                        <DynamicLink {...occDynamicLinkProps} className="g-text-inherit">
                          <h5 className="g-font-bold">
                            <FormattedMessage id="counts.nOccurrences" values={{ total }} />
                          </h5>
                        </DynamicLink>
                        {total > 0 && (
                          <div className="g-text-slate-500">
                            <div className="g-mt-2">
                              <FormattedMessage
                                id="counts.percentWithCoordinates"
                                values={{ percent: withCoordinatesPercentage }}
                              />
                            </div>
                            <Progress value={(100 * withCoordinates) / total} className="g-h-1" />

                            <div className="g-mt-2">
                              <FormattedMessage
                                id="counts.percentWithYear"
                                values={{ percent: withYearPercentage }}
                              />
                            </div>
                            <Progress value={(100 * withYear) / total} className="g-h-1" />

                            <div className="g-mt-2">
                              <FormattedMessage
                                id="counts.percentWithTaxonMatch"
                                values={{ percent: withTaxonMatchPercentage }}
                              />
                            </div>
                            <Progress value={(100 * withTaxonMatch) / total} className="g-h-1" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </ErrorBoundary>
            </Aside>
          )}
        </SidebarLayout>
      </ArticleTextContainer>
    </div>
  );
};

export function EventLink({ eventId, className }: { eventId?: string; className?: string }) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete('entity');
  if (eventId) {
    searchParams.set('eventId', eventId);
  }

  return (
    <Link
      to={{
        pathname: window.location.pathname,
        search: searchParams.toString(),
      }}
      className={className}
    >
      <FormattedMessage id="event.viewEvent" defaultMessage="View child events" />
    </Link>
  );
}

const EVENT_SLOW = /* GraphQL */ `
  query EventInsights(
    $imagePredicate: Predicate
    $coordinatePredicate: Predicate
    $taxonPredicate: Predicate
    $yearPredicate: Predicate
    $datasetPredicate: Predicate
  ) {
    unfiltered: occurrenceSearch(predicate: $datasetPredicate) {
      documents(size: 0) {
        total
      }
      cardinality {
        eventId
      }
      facet {
        dwcaExtension {
          key
          count
        }
      }
    }
    images: occurrenceSearch(predicate: $imagePredicate) {
      documents(size: 10) {
        total
        results {
          key
          stillImages {
            identifier: thumbor(height: 400)
          }
        }
      }
    }
    withCoordinates: occurrenceSearch(predicate: $coordinatePredicate) {
      documents(size: 10) {
        total
      }
    }
    withTaxonMatch: occurrenceSearch(predicate: $taxonPredicate) {
      documents(size: 10) {
        total
      }
    }
    withYear: occurrenceSearch(predicate: $yearPredicate) {
      documents(size: 10) {
        total
      }
    }
  }
`;
