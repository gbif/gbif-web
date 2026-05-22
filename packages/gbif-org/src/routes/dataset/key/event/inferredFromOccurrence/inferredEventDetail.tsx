import { Classification } from '@/components/classification';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { Taxa } from '@/components/dashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Globe from '@/components/globe';
import { OccurrenceIcon } from '@/components/highlights';
import { AdHocMapThumbnail } from '@/components/maps/mapThumbnail';
import { FormattedDateRange } from '@/components/message';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Card, CardContent } from '@/components/ui/smallCard';
import {
  DatasetEventQuery,
  EventInsightsQuery,
  EventInsightsQueryVariables,
  PredicateType,
} from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { Aside, SidebarLayout } from '@/routes/occurrence/key/pagelayouts';
import formatAsPercentage from '@/utils/formatAsPercentage';
import { Progress } from '@radix-ui/react-progress';
import { useEffect, useState } from 'react';
import { FaGlobeAfrica } from 'react-icons/fa';
import { MdEvent, MdImage } from 'react-icons/md';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { Images } from '../../about/Images';
import { EVENT_INSIGHTS_QUERY } from '../eventInsightsQuery';
import InferredEventList from './inferredEventList';
import { InferredEventsNotice } from './inferredEventsDatasetEvents';

/**
 * Detail page for a single event that has been inferred from occurrence
 * records on a non-sampling-event dataset. There is no event-API record to
 * fetch here — everything is derived from occurrences carrying eventID /
 * parentEventID.
 */
export const InferredEventDetail = ({
  data,
  datasetKey,
  className = '',
}: {
  data?: DatasetEventQuery;
  datasetKey: string;
  className?: string;
}) => {
  const hideSidebar = useBelow(1000);
  const hideGlobe = useBelow(800);
  const location = useLocation();
  const [parentEventIdFromPath, setParentEventIdFromPath] = useState('');

  const { eventId, firstOccurrence } = data?.dataset?.events?.results?.[0] ?? {};
  const decimalLatitude = firstOccurrence?.decimalLatitude || null;
  const decimalLongitude = firstOccurrence?.decimalLongitude || null;
  const eventID = firstOccurrence?.eventID;
  const countryCode = firstOccurrence?.countryCode;
  const eventDate = firstOccurrence?.eventDate;

  const occDynamicLinkProps = {
    pageId: 'occurrenceSearch',
    searchParams: { datasetKey: data?.dataset?.key, eventId },
  };
  const { data: insights, load } = useQuery<EventInsightsQuery, EventInsightsQueryVariables>(
    EVENT_INSIGHTS_QUERY,
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
    <div className={className}>
      <Classification className="g-m-auto g-max-w-screen-xl g-p-3 g-text-sm g-text-slate-600">
        <span>
          <DynamicLink
            pageId={'datasetKey'}
            variables={{ key: `${datasetKey}/event` }}
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
      <InferredEventsNotice />
      <SidebarLayout
        reverse
        className="g-grid-cols-[250px_1fr] xl:g-grid-cols-[300px_1fr]"
        stack={hideSidebar}
      >
        <div className="g-order-last">
          <Card className="g-mb-4">
            <div className="g-pt-4 g-ps-4 g-pe-4 g-pb-0">
              <div className="g-flex g-items-center">
                <div className="g-p-0 md:g-p-4 g-pt-0 md:g-pt-4">
                  <h2 className="g-text-2xl g-font-semibold g-leading-none g-tracking-tight">
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
          </Card>
          {insights?.images?.documents?.total > 0 && (
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
                      <MdImage style={{ marginInlineEnd: 8 }} />{' '}
                      <span>
                        <FormattedNumber value={insights?.images?.documents?.total} />
                      </span>
                    </div>
                  </SimpleTooltip>
                </DynamicLink>
              }
            />
          )}
          <ErrorBoundary
            type="BLOCK"
            errorMessage={<FormattedMessage id="dataset.errors.eventList" />}
          >
            <InferredEventList
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
        </div>
        {!hideSidebar && (
          <Aside className="">
            {!parentEventIdFromPath && decimalLongitude && (
              <div className="g-block g-relative g-group">
                <Card className="g-mb-0">
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${decimalLongitude},${decimalLatitude})/${decimalLongitude},${decimalLatitude},${overviewZoom},0/250x180@2x?access_token=${import.meta.env.PUBLIC_MAPBOX_ACCESS_TOKEN}`}
                  />
                  <img
                    className="g-absolute g-opacity-0 g-top-0 group-hover:g-opacity-100 g-transition-opacity gb-on-hover"
                    src={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s-circle+285A98(${decimalLongitude},${decimalLatitude})/${decimalLongitude},${decimalLatitude},${sateliteZoom},0/250x180@2x?access_token=${import.meta.env.PUBLIC_MAPBOX_ACCESS_TOKEN}`}
                  />
                </Card>
              </div>
            )}
            {!!parentEventIdFromPath && (
              <Card className="g-mb-4">
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
    </div>
  );
};
