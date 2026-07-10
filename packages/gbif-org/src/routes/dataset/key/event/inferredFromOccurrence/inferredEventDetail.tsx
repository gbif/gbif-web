import { Classification } from '@/components/classification';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { OccurrenceTaxonomySunburst, Taxa } from '@/components/dashboard';
import EmptyValue from '@/components/emptyValue';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Globe from '@/components/globe';
import { GeoJsonMap } from '@/components/maps/geojsonMap';
import { generatePointGeoJson } from '@/components/maps/geojsonMap/generatePointGeoJson';
import { AdHocMapThumbnail } from '@/components/maps/mapThumbnail';
import { FormattedDateRange } from '@/components/message';
import Properties from '@/components/properties';
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { TocLi as Li } from '@/components/TocHelp';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DatasetEventQuery,
  EventInsightsQuery,
  EventInsightsQueryVariables,
  PredicateType,
} from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { Group } from '@/routes/occurrence/key/About/groups';
import { MediaGallery, MediaGalleryItem } from '@/routes/occurrence/media/MediaGallery';
import { Aside, AsideSticky, SidebarLayout } from '@/routes/occurrence/key/pagelayouts';
import { cn } from '@/utils/shadcn';
import { truncateMiddle } from '@/utils/truncateString';
import { useEffect, useMemo, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { EVENT_INSIGHTS_QUERY } from '../eventInsightsQuery';
import InferredEventList from './inferredEventList';
import { InferredEventsNotice } from './inferredEventsDatasetEvents';

/**
 * Detail page for a single event inferred from occurrence records on a
 * non-sampling-event dataset. There is no event API record to fetch; everything
 * is derived from occurrences carrying eventID / parentEventID.
 *
 * Layout mirrors `SamplingEventDetail`: breadcrumb + sticky-sidebar TOC and a
 * stack of `Group` cards on the right. Differences come from the data we
 * actually have here — no methodology / Humboldt / extensions, but we do show
 * the inferred-specific record-quality bars.
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
  const hideGlobe = useBelow(800);
  const location = useLocation();
  const [parentEventIdFromPath, setParentEventIdFromPath] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const parts = location?.pathname?.split('/') ?? [];
    if (parts[parts.length - 2] === 'parentevent') {
      setParentEventIdFromPath(parts[parts.length - 1]);
    } else {
      setParentEventIdFromPath('');
    }
  }, [location.pathname]);

  const { eventId, firstOccurrence } = data?.dataset?.events?.results?.[0] ?? {};
  const decimalLatitude = firstOccurrence?.decimalLatitude ?? null;
  const decimalLongitude = firstOccurrence?.decimalLongitude ?? null;
  const eventID = firstOccurrence?.eventID ?? eventId ?? '';
  const parentEventID = firstOccurrence?.parentEventID;
  const countryCode = firstOccurrence?.countryCode;
  const eventDate = firstOccurrence?.eventDate;
  const samplingProtocol = (firstOccurrence?.samplingProtocol ?? [])
    .filter((p): p is string => !!p)
    .join(', ');
  const isParentView = !!parentEventIdFromPath;
  const displayId = isParentView ? parentEventIdFromPath : eventID;

  const { data: insights, load } = useQuery<EventInsightsQuery, EventInsightsQueryVariables>(
    EVENT_INSIGHTS_QUERY,
    {
      throwAllErrors: false,
      lazyLoad: true,
      notifyOnErrors: true,
    }
  );

  useEffect(() => {
    if (!datasetKey) return;
    const datasetPredicate: { type: PredicateType; predicates: Array<Record<string, unknown>> } = {
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
        datasetPredicate,
        imagePredicate: {
          type: PredicateType.And,
          predicates: [
            datasetPredicate,
            { type: PredicateType.Equals, key: 'mediaType', value: 'StillImage' },
          ],
        },
      },
    });
  }, [load, datasetKey, eventID, parentEventIdFromPath]);

  const total = insights?.unfiltered?.documents?.total;
  const insightImages = insights?.images?.documents?.results ?? [];
  const mediaItems: MediaGalleryItem[] = useMemo(() => {
    const items: MediaGalleryItem[] = [];
    insightImages.forEach((occ) => {
      occ?.stillImages?.forEach((img, i) => {
        if (!img?.identifier) return;
        items.push({
          id: `occ-${occ.key}-${i}`,
          content: (
            <img
              src={img.identifier}
              alt=""
              className="g-max-h-[400px] g-max-w-full g-object-contain"
            />
          ),
          thumbnail: (
            <img src={img.identifier} alt="" className="g-w-full g-h-full g-object-cover" />
          ),
          thumbnailAriaLabel: `Image ${i + 1}`,
        });
      });
    });
    return items;
  }, [insightImages]);

  const hasLocation = !isParentView && (decimalLatitude != null || countryCode);
  const hasMedia = mediaItems.length > 0;

  const occurrenceSearchParams = isParentView
    ? { datasetKey, parentEventId: parentEventIdFromPath }
    : { datasetKey, eventId: eventID };
  const gallerySearchParams = { ...occurrenceSearchParams, view: 'GALLERY' };

  const sections = useMemo(() => {
    const list: Array<{ id: string; label: React.ReactNode }> = [
      {
        id: 'summary',
        label: <FormattedMessage id="occurrenceDetails.groups.summary" defaultMessage="Summary" />,
      },
    ];
    if (hasMedia) {
      list.push({
        id: 'media',
        label: <FormattedMessage id="eventDetails.media" defaultMessage="Media" />,
      });
    }
    if (hasLocation) {
      list.push({
        id: 'location',
        label: (
          <FormattedMessage id="occurrenceDetails.groups.location" defaultMessage="Location" />
        ),
      });
    }
    list.push({
      id: 'events',
      label: isParentView ? (
        <FormattedMessage id="dataset.childEvents" defaultMessage="Child events" />
      ) : (
        <FormattedMessage id="dataset.siblingEvents" defaultMessage="Sibling events" />
      ),
    });
    if ((total ?? 0) > 1) {
      list.push({
        id: 'occurrence-summary',
        label: (
          <FormattedMessage
            id="eventDetails.occurrenceSummary"
            defaultMessage="Occurrence summary"
          />
        ),
      });
    }
    return list;
  }, [hasMedia, hasLocation, total, isParentView]);

  // The internal `eventId` aggregate key is enough to *display* the URL value,
  // but it doesn't let us relate this event to siblings/children — only the
  // DwC eventID on a real occurrence does. So "unresolved" means we have no
  // DwC eventID, no DwC parentEventID, and we're not in a parentevent view.
  const isUnresolved =
    !firstOccurrence?.eventID && !parentEventID && !parentEventIdFromPath;
  if (isUnresolved) {
    return (
      <div className={cn('g-pt-8', className)}>
        <Alert variant="warning" className="g-mb-4">
          <FormattedMessage
            id="eventDetails.unresolvedInferredEvent"
            defaultMessage="We couldn't find a matching event. This dataset is not modelled as an event dataset — events are inferred from occurrence records, and no occurrence on this dataset carries this URL's value as its eventID."
          />
        </Alert>
      </div>
    );
  }

  return (
    <div className={className}>
      <Classification className="g-m-auto g-max-w-screen-xl g-p-3 g-text-sm g-text-slate-600 g-flex g-items-center g-flex-wrap">
        <span className="g-inline-flex g-items-center">
          <DynamicLink
            pageId={'datasetKey'}
            variables={{ key: `${datasetKey}/event` }}
            className="g-inline-flex g-items-center g-gap-1 g-bg-slate-100 hover:g-bg-slate-200 g-text-slate-700 g-rounded g-px-2 g-py-0.5 g-leading-none"
          >
            <FaChevronLeft aria-hidden className="g-text-xs" />
            <FormattedMessage id="eventDetails.allEvents" defaultMessage="All events" />
          </DynamicLink>
        </span>
        <span>{truncateMiddle(displayId, 30) || displayId}</span>
      </Classification>
      <InferredEventsNotice />
      <SidebarLayout
        reverse
        className={cn(
          'g-grid-cols-1',
          'lg:g-grid-cols-[250px_minmax(0,1fr)] xl:g-grid-cols-[300px_minmax(0,1fr)]'
        )}
      >
        <Aside className="g-hidden lg:g-block">
          <AsideSticky>
            <Card>
              <nav>
                <ul className="g-list-none g-m-0 g-p-0 g-my-2">
                  {sections.map((s) => (
                    <Li key={s.id} to={`#${s.id}`}>
                      {s.label}
                    </Li>
                  ))}
                </ul>
              </nav>
            </Card>
          </AsideSticky>
        </Aside>
        <div>
          {/* Summary card — toned-down header lives here */}
          <Group
            id="summary"
            label="occurrenceDetails.groups.summary"
            className="g-mb-4 g-scroll-mt-24"
          >
            <div className="g-flex g-items-start g-gap-3 g-flex-wrap">
              <div className="g-flex-1 g-min-w-0">
                <div className="g-text-xs g-font-semibold g-uppercase g-tracking-wide g-text-slate-500 g-mb-1">
                  {isParentView ? (
                    <FormattedMessage id="occurrenceFieldNames.parentEventID" />
                  ) : (
                    <FormattedMessage id="occurrenceFieldNames.eventID" />
                  )}
                </div>
                <h2 className="g-text-xl g-font-semibold g-leading-tight g-text-slate-900 g-break-words">
                  {displayId}
                </h2>
                <div className="g-flex g-flex-wrap g-gap-2 g-mt-2">
                  {!!total && (
                    <DynamicLink
                      pageId="occurrenceSearch"
                      searchParams={occurrenceSearchParams}
                      className="g-inline-flex g-items-center g-gap-1 g-bg-slate-100 hover:g-bg-slate-200 g-text-slate-700 g-text-xs g-rounded g-px-2 g-py-1"
                    >
                      <FormattedMessage id="counts.nOccurrences" values={{ total }} />
                      <MdLink aria-hidden />
                    </DynamicLink>
                  )}
                </div>
              </div>
            </div>

            <div className="g-mt-4">
              <Properties breakpoint={800} className="[&>dt]:g-w-52">
                {eventDate && (
                  <SimpleProperty label="occurrenceFieldNames.eventDate">
                    <FormattedDateRange date={eventDate as string} />
                  </SimpleProperty>
                )}
                {(countryCode || decimalLatitude != null) && (
                  <SimpleProperty label="eventDetails.sampledAt">
                    <SampledAt
                      countryCode={countryCode}
                      latitude={decimalLatitude}
                      longitude={decimalLongitude}
                    />
                  </SimpleProperty>
                )}
                <SimpleProperty label="occurrenceFieldNames.samplingProtocol">
                  {samplingProtocol || <EmptyValue id="phrases.notProvided" />}
                </SimpleProperty>
              </Properties>
            </div>
          </Group>

          {/* Media — promoted up so the visual hook sits right under Summary */}
          {hasMedia && (
            <Group
              id="media"
              label="eventDetails.media"
              defaultMessage="Media"
              className="g-mb-4 g-scroll-mt-24"
            >
              <MediaGallery
                items={mediaItems}
                renderBottomRight={(activeIndex, t) => (
                  <span className="g-absolute g-bottom-2 g-end-2 g-bg-neutral-800/70 g-text-white g-text-xs g-rounded g-px-2 g-py-0.5 g-pointer-events-none">
                    {activeIndex + 1} / {t}
                  </span>
                )}
              />
              {insights?.images?.documents?.total ? (
                <div className="g-mt-3 g-text-sm">
                  <DynamicLink
                    pageId="occurrenceSearch"
                    searchParams={gallerySearchParams}
                    className="g-text-primary g-underline"
                  >
                    <FormattedMessage
                      id="phrases.viewAllImages"
                      defaultMessage="View all {total} images"
                      values={{ total: insights.images.documents.total }}
                    />
                  </DynamicLink>
                </div>
              ) : null}
            </Group>
          )}

          {/* Location */}
          {hasLocation && (
            <Group
              id="location"
              label="occurrenceDetails.groups.location"
              defaultMessage="Location"
              className="g-mb-4 g-scroll-mt-24"
            >
              {decimalLatitude != null && decimalLongitude != null && (
                <div className="g-mb-4 g-min-w-64 g-relative">
                  <StaticRenderSuspence fallback={<div>Loading map...</div>}>
                    <GeoJsonMap
                      geoJson={generatePointGeoJson({
                        lat: decimalLatitude,
                        lon: decimalLongitude,
                      })}
                      className="g-w-full g-rounded g-overflow-hidden"
                      initialCenter={[decimalLongitude, decimalLatitude]}
                      initialZoom={1}
                      rasterStyle="gbif-natural"
                    />
                  </StaticRenderSuspence>
                  {!hideGlobe && firstOccurrence?.volatile?.globe && (
                    <div className="g-absolute g-top-2 g-end-2 g-pointer-events-none g-bg-slate-200/90 g-rounded-full g-shadow-md">
                      <Globe
                        {...firstOccurrence.volatile.globe}
                        className="g-w-14 g-h-14 md:g-w-20 md:g-h-20"
                      />
                    </div>
                  )}
                </div>
              )}
              <Properties breakpoint={800} className="[&>dt]:g-w-52">
                {decimalLatitude != null && (
                  <SimpleProperty label="occurrenceFieldNames.decimalLatitude">
                    {decimalLatitude}
                  </SimpleProperty>
                )}
                {decimalLongitude != null && (
                  <SimpleProperty label="occurrenceFieldNames.decimalLongitude">
                    {decimalLongitude}
                  </SimpleProperty>
                )}
                {countryCode && (
                  <SimpleProperty label="occurrenceFieldNames.country">
                    <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                  </SimpleProperty>
                )}
              </Properties>
            </Group>
          )}

          {/* Parent-event view: a small centroid map to give a sense of spread */}
          {isParentView && (
            <Group
              id="location"
              label="occurrenceDetails.groups.location"
              defaultMessage="Location"
              className="g-mb-4 g-scroll-mt-24"
            >
              <AdHocMapThumbnail
                filter={{ datasetKey, parentEventId: parentEventIdFromPath } as unknown as JSON}
                className="g-rounded g-overflow-hidden"
                params={{
                  mode: 'GEO_CENTROID',
                  hexPerTile: '16',
                  bin: 'hex',
                  style: 'classic-noborder.poly',
                }}
              />
            </Group>
          )}

          {/* Sibling or child events */}
          <ErrorBoundary
            type="BLOCK"
            errorMessage={<FormattedMessage id="eventDetails.errors.eventList" />}
          >
            <InferredEventList
              id="events"
              datasetKey={datasetKey}
              parentEventID={parentEventIdFromPath || parentEventID}
              eventID={eventID || parentEventIdFromPath}
              isParentEvent={isParentView}
            />
          </ErrorBoundary>

          {/* Occurrence summary — opt-in, matches the sampling event page.
              Hidden for events with 0 or 1 occurrence — a breakdown isn't meaningful. */}
          {(total ?? 0) > 1 && (() => {
            const summaryEventPredicate = isParentView
              ? {
                  type: PredicateType.Equals,
                  key: 'parentEventId',
                  value: parentEventIdFromPath,
                }
              : {
                  type: PredicateType.Equals,
                  key: 'eventId',
                  value: eventID,
                };
            const summaryPredicate = {
              type: PredicateType.And,
              predicates: [
                { type: PredicateType.Equals, key: 'datasetKey', value: datasetKey },
                summaryEventPredicate,
              ],
            };
            return (
              <div id="occurrence-summary" className="g-mb-4 g-scroll-mt-24">
                <ClientSideOnly>
                  <ErrorBoundary
                    type="BLOCK"
                    errorMessage={<FormattedMessage id="eventDetails.errors.taxa" />}
                  >
                    {showSummary ? (
                      <div className="g-space-y-4">
                        <Taxa defaultRank={'species'} predicate={summaryPredicate} />
                        <OccurrenceTaxonomySunburst predicate={summaryPredicate} />
                      </div>
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            <FormattedMessage
                              id="eventDetails.occurrenceSummary"
                              defaultMessage="Occurrence summary"
                            />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="g-flex g-items-start g-gap-4">
                            <p className="g-flex-auto g-min-w-0 g-text-sm g-text-slate-500">
                              <FormattedMessage
                                id="eventDetails.occurrenceSummaryHint"
                                defaultMessage="A breakdown by taxa and a taxonomic sunburst for this event. The underlying queries can be slow — generate on demand."
                              />
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="g-flex-none"
                              onClick={() => setShowSummary(true)}
                            >
                              <FormattedMessage
                                id="eventDetails.generateOccurrenceSummary"
                                defaultMessage="Generate summary"
                              />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </ErrorBoundary>
                </ClientSideOnly>
              </div>
            );
          })()}

        </div>
      </SidebarLayout>
    </div>
  );
};

/**
 * Skeleton placeholder for `InferredEventDetail`.
 */
export function InferredEventDetailSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <div className="g-m-auto g-max-w-screen-xl g-p-3">
        <Skeleton className="g-h-4 g-w-64" />
      </div>
      <SidebarLayout
        reverse
        className={cn(
          'g-grid-cols-1',
          'lg:g-grid-cols-[250px_minmax(0,1fr)] xl:g-grid-cols-[300px_minmax(0,1fr)]'
        )}
      >
        <Aside className="g-hidden lg:g-block">
          <AsideSticky>
            <Card>
              <div className="g-p-3 g-space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="g-h-4 g-w-3/4" />
                ))}
              </div>
            </Card>
          </AsideSticky>
        </Aside>
        <div>
          <Card className="g-mb-4">
            <div className="g-p-4 g-space-y-3">
              <Skeleton className="g-h-3 g-w-24" />
              <Skeleton className="g-h-6 g-w-1/2" />
              <div className="g-flex g-gap-2 g-mt-2">
                <Skeleton className="g-h-5 g-w-28" />
              </div>
              <div className="g-mt-4 g-space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="g-flex g-gap-4">
                    <Skeleton className="g-h-4 g-w-40" />
                    <Skeleton className="g-h-4 g-flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Skeleton className="g-h-40 g-mb-4" />
          <Skeleton className="g-h-32 g-mb-4" />
        </div>
      </SidebarLayout>
    </div>
  );
}

// ---------- helper components ----------

function humanize(id: string): string {
  const last = id.split('.').pop() ?? id;
  return last
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function SimpleProperty({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <dt className="g-text-slate-600 g-leading-tight">
        <FormattedMessage id={label} defaultMessage={humanize(label)} />
      </dt>
      <dd className="g-leading-tight g-break-words">{children}</dd>
    </>
  );
}

function SampledAt({
  countryCode,
  latitude,
  longitude,
}: {
  countryCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}) {
  const pieces: React.ReactNode[] = [];
  if (latitude != null && longitude != null) pieces.push(`${latitude}, ${longitude}`);
  if (countryCode) {
    pieces.push(<FormattedMessage key="country" id={`enums.countryCode.${countryCode}`} />);
  }
  return (
    <span>
      {pieces.map((p, i) => (
        <span key={i}>
          {p}
          {i < pieces.length - 1 ? <span className="g-text-slate-400"> · </span> : null}
        </span>
      ))}
    </span>
  );
}

