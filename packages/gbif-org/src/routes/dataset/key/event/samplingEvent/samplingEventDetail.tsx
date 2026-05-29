import { Classification } from '@/components/classification';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { OccurrenceTaxonomySunburst, Taxa } from '@/components/dashboard';
import EmptyValue from '@/components/emptyValue';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Globe from '@/components/globe';
import useBelow from '@/hooks/useBelow';
import { GeoJsonMap } from '@/components/maps/geojsonMap';
import { generatePointGeoJson } from '@/components/maps/geojsonMap/generatePointGeoJson';
import { FormattedDateRange } from '@/components/message';
import Properties from '@/components/properties';
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { TocLi as Li, Separator } from '@/components/TocHelp';
import {
  DatasetEventQuery,
  EventInsightsQuery,
  EventInsightsQueryVariables,
  EventQuery,
  PredicateType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { Group } from '@/routes/occurrence/key/About/groups';
import { MediaGallery, MediaGalleryItem } from '@/routes/occurrence/media/MediaGallery';
import { Aside, AsideSticky, SidebarLayout } from '@/routes/occurrence/key/pagelayouts';
import { cn } from '@/utils/shadcn';
import { truncateMiddle } from '@/utils/truncateString';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { MdLink } from 'react-icons/md';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { EVENT_INSIGHTS_QUERY } from '../eventInsightsQuery';
import { GenericEventExtension } from './eventExtensions';
import { HumboldtSection } from './humboldtSection';
import { SamplingEventChildList } from './samplingEventChildList';
import { SamplingEventExperimentalAlert } from './samplingEventDatasetEvents';

type Event = NonNullable<EventQuery['event']>;
type MediaItem = NonNullable<NonNullable<Event['media']>[number]>;
type Fact = Record<string, unknown>;
type Relation = Record<string, unknown>;

/**
 * Detail page for a single event on a SAMPLING_EVENT dataset.
 *
 * Layout mirrors `/occurrence/:key`: sticky-sidebar TOC on one side and a
 * stack of `Group` cards on the other. The event header is intentionally
 * toned down (lives on a Summary card) because this page renders inside the
 * dataset tab — having a full ArticleTitle would compete with the dataset's
 * own header.
 *
 * `narrow` is set by the drawer view so it gets a single-column layout via
 * CSS, no JS-driven breakpoint flash.
 */
export const SamplingEventDetail = ({
  data,
  eventData,
  datasetKey,
  className = '',
  narrow = false,
}: {
  data?: DatasetEventQuery;
  eventData?: EventQuery;
  datasetKey: string;
  className?: string;
  narrow?: boolean;
}) => {
  const { eventId, firstOccurrence } = data?.dataset?.events?.results?.[0] ?? {};
  const event = eventData?.event;
  const hideGlobe = useBelow(800);

  // 404: neither the event API record exists nor does any occurrence on the
  // dataset reference this eventID. Render a "no such event" panel with a way
  // back to event search instead of an empty-looking summary.
  const eventMissing = !event && !data?.dataset?.events?.results?.[0];

  const decimalLatitude = event?.decimalLatitude ?? firstOccurrence?.decimalLatitude ?? null;
  const decimalLongitude = event?.decimalLongitude ?? firstOccurrence?.decimalLongitude ?? null;
  const eventID = event?.eventID ?? firstOccurrence?.eventID;
  const countryCode = event?.country ?? firstOccurrence?.countryCode;
  const eventDate = event?.eventDate ?? firstOccurrence?.eventDate;
  const eventType = event?.eventType;

  // Occurrence summary (taxa breakdown, ad-hoc map, taxonomy sunburst) is opt-in:
  // the underlying facet queries are expensive on event-heavy datasets.
  const [showSummary, setShowSummary] = useState(false);

  // Track which extension sub-sections actually rendered, so the TOC can list them.
  const [extToc, setExtToc] = useState<Record<string, boolean>>({});
  const updateExtToc = useCallback((id: string, visible: boolean) => {
    setExtToc((prev) => (prev[id] === visible ? prev : { ...prev, [id]: visible }));
  }, []);

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
    const datasetPredicate = {
      type: PredicateType.And,
      predicates: [
        { type: PredicateType.Equals, key: 'datasetKey', value: datasetKey },
        ...(eventID
          ? [{ type: PredicateType.Equals, key: 'eventId', value: eventID }]
          : []),
      ],
    };
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
  }, [load, datasetKey, eventID]);

  const total = insights?.unfiltered?.documents?.total;

  const insightImages = insights?.images?.documents?.results ?? [];
  const eventMedia: MediaItem[] = useMemo(
    () =>
      (event?.media ?? []).filter(
        (m): m is MediaItem => !!m && !!(m.thumbor ?? m.identifier)
      ),
    [event?.media]
  );

  const mediaItems: MediaGalleryItem[] = useMemo(() => {
    const items: MediaGalleryItem[] = [];
    eventMedia.forEach((m, i) => {
      const src = m.thumbor ?? m.identifier;
      if (!src) return;
      items.push({
        id: `evt-${i}`,
        content: (
          <img src={src} alt="" className="g-max-h-[400px] g-max-w-full g-object-contain" />
        ),
        thumbnail: <img src={src} alt="" className="g-w-full g-h-full g-object-cover" />,
        thumbnailAriaLabel: m.title ?? `Event media ${i + 1}`,
        info:
          m.creator || m.license || m.rightsHolder ? (
            <>
              {m.creator && (
                <p>
                  <span className="g-opacity-70">Creator: </span>
                  {m.creator}
                </p>
              )}
              {m.license && (
                <p>
                  <span className="g-opacity-70">License: </span>
                  {m.license}
                </p>
              )}
              {m.rightsHolder && (
                <p>
                  <span className="g-opacity-70">Rights holder: </span>
                  {m.rightsHolder}
                </p>
              )}
            </>
          ) : undefined,
      });
    });
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
  }, [eventMedia, insightImages]);

  const extensionList: string[] = useMemo(() => {
    if (!event?.extensions) return [];
    return Object.entries(event.extensions)
      .filter(([k, v]) => k !== '__typename' && Array.isArray(v) && (v as unknown[]).length > 0)
      .map(([k]) => k);
  }, [event?.extensions]);
  const visibleExtensions = extensionList.filter((ext) => extToc[ext]);

  // REST `childEventCount` is always null; subEvents.count is the source of truth.
  const childEventCount = event?.subEvents?.count ?? 0;
  const parentEvent = event?.parentEvent;
  const facts = (event?.facts ?? []).filter((x): x is Fact => x != null) as Fact[];
  const relations = (event?.relations ?? []).filter((x): x is Relation => x != null) as Relation[];
  const identifiers = (event?.identifiers ?? []).filter(Boolean);
  const issues = (event?.issues ?? []).filter((x): x is string => !!x);
  const gadm = event?.gadm as GadmShape | null | undefined;

  const hasMethodology = !!(
    event?.samplingProtocol ||
    (event?.samplingProtocols ?? []).some(Boolean) ||
    event?.protocol
  );

  const hasGeoPrecision = !!(
    event?.coordinateUncertaintyInMeters ??
    event?.coordinatePrecision ??
    event?.distanceFromCentroidInMeters ??
    event?.geodeticDatum ??
    event?.depth ??
    event?.depthAccuracy ??
    event?.elevation ??
    event?.elevationAccuracy
  );

  const hasLocation = !!(
    decimalLatitude != null ||
    decimalLongitude != null ||
    countryCode ||
    event?.continent ||
    event?.waterBody ||
    event?.stateProvince ||
    event?.locationID ||
    gadm?.level0 ||
    hasGeoPrecision
  );

  const humboldtRecords = (event?.humboldt ?? []).filter(Boolean);
  const hasHumboldt = humboldtRecords.length > 0;

  const sections = useMemo(() => {
    const list: Array<{ id: string; label: React.ReactNode }> = [
      {
        id: 'summary',
        label: <FormattedMessage id="occurrenceDetails.groups.summary" defaultMessage="Summary" />,
      },
    ];
    if (mediaItems.length > 0) {
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
    if (childEventCount > 0) {
      list.push({
        id: 'child-events',
        label: <FormattedMessage id="dataset.childEvents" defaultMessage="Child events" />,
      });
    }
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
    if (hasMethodology) {
      list.push({
        id: 'methodology',
        label: <FormattedMessage id="eventDetails.methodology" defaultMessage="Methodology" />,
      });
    }
    if (facts.length > 0) {
      list.push({
        id: 'facts',
        label: (
          <FormattedMessage
            id="occurrenceDetails.extensions.measurementOrFact.name"
            defaultMessage="Measurements or facts"
          />
        ),
      });
    }
    if (relations.length > 0) {
      list.push({
        id: 'relations',
        label: <FormattedMessage id="eventDetails.relations" defaultMessage="Relations" />,
      });
    }
    if (identifiers.length > 0) {
      list.push({
        id: 'identifiers',
        label: (
          <FormattedMessage
            id="occurrenceDetails.extensions.identifier.name"
            defaultMessage="Identifiers"
          />
        ),
      });
    }
    if (hasHumboldt) {
      list.push({
        id: 'humboldt',
        label: (
          <FormattedMessage
            id="occurrenceDetails.extensions.humboldtEcologicalInventory.name"
            defaultMessage="Humboldt extension"
          />
        ),
      });
    }
    if (issues.length > 0) {
      list.push({
        id: 'issues',
        label: <FormattedMessage id="occurrenceDetails.groups.issues" defaultMessage="Issues" />,
      });
    }
    return list;
  }, [
    total,
    mediaItems.length,
    childEventCount,
    hasMethodology,
    facts.length,
    relations.length,
    identifiers.length,
    issues.length,
    hasHumboldt,
  ]);

  if (eventMissing) {
    return (
      <div className={className}>
        {!narrow && (
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
          </Classification>
        )}
        <div className="g-m-auto g-max-w-screen-xl g-p-3">
          <Alert variant="warning" className="g-mb-4">
            <FormattedMessage
              id="eventDetails.eventNotFound"
              defaultMessage="We couldn't find an event with this ID on this dataset."
            />
          </Alert>
          <DynamicLink
            pageId="datasetKey"
            variables={{ key: `${datasetKey}/event` }}
          >
            <Button variant="outline" size="sm">
              <FaChevronLeft aria-hidden className="g-text-xs g-me-1" />
              <FormattedMessage
                id="eventDetails.backToEventSearch"
                defaultMessage="Back to event search"
              />
            </Button>
          </DynamicLink>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {!narrow && (
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
          {parentEvent?.eventID && (
            <span>
              <DynamicLink
                pageId="datasetKey"
                variables={{
                  key: `${datasetKey}/event/${encodeURIComponent(parentEvent.eventID)}`,
                }}
                className="g-text-inherit hover:g-underline"
              >
                {truncateMiddle(parentEvent.eventID, 30) || parentEvent.eventID}
              </DynamicLink>
            </span>
          )}
          <span>{truncateMiddle((eventID ?? eventId) ?? '', 30) || (eventID ?? eventId)}</span>
        </Classification>
      )}
      <SamplingEventExperimentalAlert />
      <SidebarLayout
        reverse
        className={cn(
          'g-grid-cols-1',
          !narrow && 'lg:g-grid-cols-[250px_minmax(0,1fr)] xl:g-grid-cols-[300px_minmax(0,1fr)]'
        )}
      >
        {!narrow && (
          <Aside className="g-hidden lg:g-block">
            <AsideSticky>
              <Card>
                <nav>
                  <ul className="g-list-none g-m-0 g-p-0 g-my-2">
                    {(() => {
                      // Extensions render on the page just before Issues, so the
                      // TOC must splice extensions in immediately before the Issues
                      // entry — otherwise (e.g. no Humboldt section) Issues would
                      // float above extensions in the TOC but below them on page.
                      const issuesIdx = sections.findIndex((s) => s.id === 'issues');
                      const splitAt = issuesIdx === -1 ? sections.length : issuesIdx;
                      const before = sections.slice(0, splitAt);
                      const after = sections.slice(splitAt);
                      return (
                        <>
                          {before.map((s) => (
                            <Li key={s.id} to={`#${s.id}`}>
                              {s.label}
                            </Li>
                          ))}
                          {visibleExtensions.length > 0 && (
                            <>
                              <Separator />
                              <Li style={{ color: '#888', fontSize: '85%' }}>
                                <FormattedMessage id="occurrenceDetails.groups.extensions" />
                              </Li>
                              {visibleExtensions.map((ext) => (
                                <Li key={ext} to={`#${ext}`}>
                                  <FormattedMessage
                                    id={`occurrenceDetails.extensions.${ext}.name`}
                                    defaultMessage={ext}
                                  />
                                </Li>
                              ))}
                              {after.length > 0 && <Separator />}
                            </>
                          )}
                          {after.map((s) => (
                            <Li key={s.id} to={`#${s.id}`}>
                              {s.label}
                            </Li>
                          ))}
                        </>
                      );
                    })()}
                  </ul>
                </nav>
              </Card>

            </AsideSticky>
          </Aside>
        )}
        <div>
          {/* Summary card — toned-down header lives here */}
          <Group
            id="summary"
            label="occurrenceDetails.groups.summary"
            className="g-mb-4 g-scroll-mt-24"
          >
            <div className="g-flex g-items-start g-gap-3 g-flex-wrap">
              <div className="g-flex-1 g-min-w-0">
                {eventType && (
                  <div className="g-text-xs g-font-semibold g-uppercase g-tracking-wide g-text-slate-500 g-mb-1">
                    {eventType}
                  </div>
                )}
                <h2 className="g-text-xl g-font-semibold g-leading-tight g-text-slate-900 g-break-words">
                  {eventID || eventId}
                </h2>
                <div className="g-flex g-flex-wrap g-gap-2 g-mt-2">
                  {parentEvent?.eventID && (
                    <DynamicLink
                      pageId="datasetKey"
                      variables={{
                        key: `${datasetKey}/event/${encodeURIComponent(parentEvent.eventID)}`,
                      }}
                      className="g-inline-flex g-items-center g-gap-1 g-bg-slate-100 hover:g-bg-slate-200 g-text-slate-700 g-text-xs g-rounded g-px-2 g-py-1"
                    >
                      <FormattedMessage
                        id="dataset.parentEvent"
                        defaultMessage="Parent event"
                      />
                      <MdLink aria-hidden />
                    </DynamicLink>
                  )}
                  {childEventCount > 0 && eventID && (
                    <DynamicLink
                      pageId="datasetKey"
                      variables={{ key: `${datasetKey}/event` }}
                      searchParams={{ parentEventId: eventID }}
                      className="g-inline-flex g-items-center g-gap-1 g-bg-primary-50 hover:g-bg-primary-100 g-text-primary-700 g-text-xs g-rounded g-px-2 g-py-1"
                    >
                      <FormattedNumber value={childEventCount} />{' '}
                      <FormattedMessage
                        id="dataset.childEvents"
                        defaultMessage="Child events"
                      />
                      <MdLink aria-hidden />
                    </DynamicLink>
                  )}
                  {!!total && (
                    <DynamicLink
                      pageId="occurrenceSearch"
                      searchParams={{ datasetKey, eventId: eventID ?? eventId }}
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
                <DateLine event={event} fallbackDate={eventDate} />
                <SampledAtLine
                  event={event}
                  countryCode={countryCode}
                  fallbackLatitude={decimalLatitude ?? undefined}
                  fallbackLongitude={decimalLongitude ?? undefined}
                />
                {gadm?.level0 && (
                  <SimpleProperty label="occurrenceFieldNames.gadmClassification">
                    <GadmRegions gadm={gadm} />
                  </SimpleProperty>
                )}
                <SimpleProperty label="occurrenceFieldNames.samplingProtocol">
                  {event?.samplingProtocol ||
                    (event?.samplingProtocols as string[] | undefined)
                      ?.filter(Boolean)
                      .join(', ') ||
                    (firstOccurrence?.samplingProtocol ?? [])
                      .filter((p): p is string => !!p)
                      .join(', ') || <EmptyValue id="phrases.notProvided" />}
                </SimpleProperty>
                {event?.organismQuantity != null && (
                  <SimpleProperty label="occurrenceFieldNames.organismQuantity">
                    {event.organismQuantity}{' '}
                    {event.organismQuantityType && <em>{event.organismQuantityType}</em>}
                  </SimpleProperty>
                )}
                {event?.preparations && (
                  <SimpleProperty label="occurrenceFieldNames.preparations">
                    {event.preparations}
                  </SimpleProperty>
                )}
              </Properties>
            </div>
          </Group>

          {/* Media — promoted up so the visual hook sits right under Summary */}
          {mediaItems.length > 0 && (
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
            </Group>
          )}

          {/* Location — bigger inline map plus location key/value pairs */}
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
                {event?.coordinateUncertaintyInMeters != null && (
                  <SimpleProperty label="occurrenceFieldNames.coordinateUncertaintyInMeters">
                    {event.coordinateUncertaintyInMeters}
                  </SimpleProperty>
                )}
                {event?.coordinatePrecision != null && (
                  <SimpleProperty label="occurrenceFieldNames.coordinatePrecision">
                    {event.coordinatePrecision}
                  </SimpleProperty>
                )}
                {event?.distanceFromCentroidInMeters != null && (
                  <SimpleProperty label="occurrenceFieldNames.distanceFromCentroidInMeters">
                    {event.distanceFromCentroidInMeters}
                  </SimpleProperty>
                )}
                {event?.geodeticDatum && (
                  <SimpleProperty label="occurrenceFieldNames.geodeticDatum">
                    {event.geodeticDatum}
                  </SimpleProperty>
                )}
                {event?.depth != null && (
                  <SimpleProperty label="occurrenceFieldNames.depth">
                    {event.depth}
                    {event.depthAccuracy != null && ` ± ${event.depthAccuracy}`}
                  </SimpleProperty>
                )}
                {event?.elevation != null && (
                  <SimpleProperty label="occurrenceFieldNames.elevation">
                    {event.elevation}
                    {event.elevationAccuracy != null && ` ± ${event.elevationAccuracy}`}
                  </SimpleProperty>
                )}
                {countryCode && (
                  <SimpleProperty label="occurrenceFieldNames.country">
                    <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                  </SimpleProperty>
                )}
                {event?.continent && (
                  <SimpleProperty label="occurrenceFieldNames.continent">
                    {event.continent}
                  </SimpleProperty>
                )}
                {event?.waterBody && (
                  <SimpleProperty label="occurrenceFieldNames.waterBody">
                    {event.waterBody}
                  </SimpleProperty>
                )}
                {event?.stateProvince && (
                  <SimpleProperty label="occurrenceFieldNames.stateProvince">
                    {event.stateProvince}
                  </SimpleProperty>
                )}
                {event?.locationID && (
                  <SimpleProperty label="occurrenceFieldNames.locationID">
                    {event.locationID}
                  </SimpleProperty>
                )}
                {gadm?.level0 && (
                  <SimpleProperty label="occurrenceFieldNames.gadmClassification">
                    <GadmRegions gadm={gadm} />
                  </SimpleProperty>
                )}
              </Properties>
            </Group>
          )}

          {/* Sub-events */}
          {childEventCount > 0 && eventID && (
            <SamplingEventChildList
              datasetKey={datasetKey}
              eventId={eventID}
              totalCount={childEventCount}
            />
          )}

          {/* Occurrence summary — opt-in to avoid running expensive facets on every page load.
              Hidden for events with 0 or 1 occurrence — a breakdown isn't meaningful. */}
          {(total ?? 0) > 1 && (
            <div id="occurrence-summary" className="g-mb-4 g-scroll-mt-24">
              <ClientSideOnly>
                <ErrorBoundary
                  type="BLOCK"
                  errorMessage={<FormattedMessage id="eventDetails.errors.taxa" />}
                >
                  {showSummary ? (
                    <div className="g-space-y-4">
                      <Taxa
                        defaultRank={'species'}
                        predicate={{
                          type: PredicateType.And,
                          predicates: [
                            { type: PredicateType.Equals, key: 'datasetKey', value: datasetKey },
                            { type: PredicateType.Equals, key: 'eventId', value: eventID },
                          ],
                        }}
                      />
                      <OccurrenceTaxonomySunburst
                        predicate={{
                          type: PredicateType.And,
                          predicates: [
                            { type: PredicateType.Equals, key: 'datasetKey', value: datasetKey },
                            { type: PredicateType.Equals, key: 'eventId', value: eventID },
                          ],
                        }}
                      />
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
          )}

          {/* Methodology */}
          {hasMethodology && (
            <Group
              id="methodology"
              label="eventDetails.methodology"
              defaultMessage="Methodology"
              className="g-mb-4 g-scroll-mt-24"
            >
              <Properties breakpoint={800} className="[&>dt]:g-w-52">
                {event?.samplingProtocol && (
                  <SimpleProperty label="occurrenceFieldNames.samplingProtocol">
                    {event.samplingProtocol}
                  </SimpleProperty>
                )}
                {(event?.samplingProtocols ?? []).filter(Boolean).length > 0 &&
                  event?.samplingProtocols?.join(', ') !== event?.samplingProtocol && (
                    <SimpleProperty label="occurrenceFieldNames.samplingProtocol">
                      {(event!.samplingProtocols as string[]).filter(Boolean).join(', ')}
                    </SimpleProperty>
                  )}
                {event?.sampleSizeValue != null && (
                  <SimpleProperty label="occurrenceFieldNames.sampleSizeValue">
                    {event.sampleSizeValue} {event.sampleSizeUnit}
                  </SimpleProperty>
                )}
                {event?.protocol && (
                  <SimpleProperty label="occurrenceFieldNames.protocol">
                    {event.protocol}
                  </SimpleProperty>
                )}
              </Properties>
            </Group>
          )}

          {/* Facts */}
          {facts.length > 0 && (
            <Group
              id="facts"
              label="occurrenceDetails.extensions.measurementOrFact.name"
              className="g-mb-4 g-scroll-mt-24"
            >
              <FactsTable facts={facts} />
            </Group>
          )}

          {/* Relations */}
          {relations.length > 0 && (
            <Group
              id="relations"
              label="eventDetails.relations"
              defaultMessage="Relations"
              className="g-mb-4 g-scroll-mt-24"
            >
              <RelationsTable relations={relations} />
            </Group>
          )}

          {/* Identifiers */}
          {identifiers.length > 0 && (
            <Group
              id="identifiers"
              label="occurrenceDetails.extensions.identifier.name"
              className="g-mb-4 g-scroll-mt-24"
            >
              <table className="gbif-table-style g-text-sm">
                <thead>
                  <tr>
                    <th className="g-min-w-32">
                      <FormattedMessage id="filters.type.name" defaultMessage="Type" />
                    </th>
                    <th>
                      <FormattedMessage
                        id="occurrenceFieldNames.identifier"
                        defaultMessage="Identifier"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {identifiers.map((i, idx) => (
                    <tr key={idx}>
                      <td>{i?.type}</td>
                      <td className="g-break-all">{i?.identifier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Group>
          )}

          {/* Humboldt */}
          {hasHumboldt && <HumboldtSection humboldt={event?.humboldt} />}

          {/* Extensions */}
          {extensionList.length > 0 && (
            <div className="g-mb-4">
              {extensionList.map((ext) => (
                <GenericEventExtension
                  key={ext}
                  event={event}
                  label={`occurrenceDetails.extensions.${ext}.name`}
                  extensionName={ext}
                  id={ext}
                  updateToc={updateExtToc}
                />
              ))}
            </div>
          )}

          {issues.length > 0 && (
            <Group
              id="issues"
              label="occurrenceDetails.groups.issues"
              description={
                <>
                  <FormattedMessage id="occurrenceDetails.issuesHelpText" />{' '}
                  <a
                    href="https://techdocs.gbif.org/en/data-use/occurrence-issues-and-flags"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="g-underline"
                  >
                    <FormattedMessage id="occurrenceDetails.issuesLearnMore" />
                  </a>
                </>
              }
              className="g-mb-4 g-scroll-mt-24"
            >
              <div className="g-w-full g-max-w-full g-overflow-auto g-pb-2">
                <table className="gbif-table-style g-text-sm">
                  <thead>
                    <tr>
                      <th className="g-min-w-48">
                        <FormattedMessage id="occurrenceFieldNames.issue" />
                      </th>
                      <th className="g-min-w-96">
                        <FormattedMessage id="phrases.description" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue) => (
                      <tr key={issue}>
                        <td>
                          <FormattedMessage id={`enums.eventIssue.${issue}`} />
                        </td>
                        <td dir="auto">
                          <FormattedMessage id={`enums.eventIssueDescription.${issue}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Group>
          )}

        </div>
      </SidebarLayout>
    </div>
  );
};

/**
 * Skeleton placeholder for `SamplingEventDetail`. Shown while the event/data
 * queries resolve — in the drawer and during in-app navigation from search.
 * Mirrors the real layout (sidebar + stacked cards) so the page doesn't
 * reflow once data arrives.
 */
export function SamplingEventDetailSkeleton({
  className = '',
  narrow = false,
}: {
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div className={className}>
      <div className="g-m-auto g-max-w-screen-xl g-p-3">
        <Skeleton className="g-h-4 g-w-64" />
      </div>
      <SidebarLayout
        reverse
        className={cn(
          'g-grid-cols-1',
          !narrow && 'lg:g-grid-cols-[250px_minmax(0,1fr)] xl:g-grid-cols-[300px_minmax(0,1fr)]'
        )}
      >
        {!narrow && (
          <Aside className="g-hidden lg:g-block">
            <AsideSticky>
              <Card>
                <div className="g-p-3 g-space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="g-h-4 g-w-3/4" />
                  ))}
                </div>
              </Card>
            </AsideSticky>
          </Aside>
        )}
        <div>
          <Card className="g-mb-4">
            <div className="g-p-4 g-space-y-3">
              <Skeleton className="g-h-3 g-w-24" />
              <Skeleton className="g-h-6 g-w-1/2" />
              <div className="g-flex g-gap-2 g-mt-2">
                <Skeleton className="g-h-5 g-w-28" />
                <Skeleton className="g-h-5 g-w-24" />
              </div>
              <div className="g-mt-4 g-space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
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
          <Skeleton className="g-h-48 g-mb-4" />
        </div>
      </SidebarLayout>
    </div>
  );
}

// ---------- helper components ----------

type GadmShape = {
  level0?: { name?: string; gid?: string } | null;
  level1?: { name?: string; gid?: string } | null;
  level2?: { name?: string; gid?: string } | null;
  level3?: { name?: string; gid?: string } | null;
  level4?: { name?: string; gid?: string } | null;
};

// human-readable fallback for ids that don't (yet) have a translation registered
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

function EventDateText({
  eventDate,
}: {
  eventDate?: string | { from?: string | null; to?: string | null } | null;
}) {
  if (!eventDate) return null;
  if (typeof eventDate === 'string') return <FormattedDateRange date={eventDate} />;
  return (
    <FormattedDateRange
      start={eventDate.from ?? undefined}
      end={eventDate.to ?? undefined}
    />
  );
}

function DateLine({
  event,
  fallbackDate,
}: {
  event?: Event | null;
  fallbackDate?: string | { from?: string | null; to?: string | null } | null;
}) {
  const eventDate = event?.eventDate ?? fallbackDate;
  const hasYmd = event?.year != null || event?.month != null || event?.day != null;
  if (!eventDate && !hasYmd) return null;
  const ymd = [event?.year, event?.month, event?.day].filter((x) => x != null).join('-');
  return (
    <SimpleProperty label="occurrenceFieldNames.eventDate">
      {eventDate ? <EventDateText eventDate={eventDate} /> : ymd}
    </SimpleProperty>
  );
}

function SampledAtLine({
  event,
  countryCode,
  fallbackLatitude,
  fallbackLongitude,
}: {
  event?: Event | null;
  countryCode?: string | null;
  fallbackLatitude?: number;
  fallbackLongitude?: number;
}) {
  const pieces: React.ReactNode[] = [];
  if (event?.formattedCoordinates) pieces.push(event.formattedCoordinates);
  else if (fallbackLatitude != null && fallbackLongitude != null)
    pieces.push(`${fallbackLatitude}, ${fallbackLongitude}`);
  if (countryCode) {
    pieces.push(<FormattedMessage key="country" id={`enums.countryCode.${countryCode}`} />);
  }
  if (event?.continent) pieces.push(event.continent);
  if (event?.waterBody) pieces.push(event.waterBody);
  if (event?.stateProvince) pieces.push(event.stateProvince);
  if (event?.locationID) pieces.push(event.locationID);
  if (pieces.length === 0) return null;
  return (
    <SimpleProperty label="eventDetails.sampledAt">
      {pieces.map((p, i) => (
        <span key={i}>
          {p}
          {i < pieces.length - 1 ? <span className="g-text-slate-400"> · </span> : null}
        </span>
      ))}
    </SimpleProperty>
  );
}

function GadmRegions({ gadm }: { gadm: GadmShape }) {
  const levels = [gadm.level0, gadm.level1, gadm.level2, gadm.level3, gadm.level4].filter(
    (l): l is { name?: string; gid?: string } => !!l
  );
  return (
    <span>
      {levels.map((l, i) => (
        <span key={l.gid ?? i}>
          {l.name ?? l.gid}
          {i < levels.length - 1 ? <span className="g-text-slate-400"> / </span> : null}
        </span>
      ))}
    </span>
  );
}

function FactsTable({ facts }: { facts: Fact[] }) {
  const columns = Array.from(
    facts.reduce<Set<string>>((set, f) => {
      Object.keys(f).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );
  return (
    <div className="g-overflow-auto">
      <table className="gbif-table-style g-text-sm">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {facts.map((f, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c} className="g-align-top">
                  {formatCell(f[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RelationsTable({ relations }: { relations: Relation[] }) {
  const columns = Array.from(
    relations.reduce<Set<string>>((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );
  return (
    <div className="g-overflow-auto">
      <table className="gbif-table-style g-text-sm">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {relations.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c} className="g-align-top g-break-words">
                  {formatCell(r[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(v: unknown): React.ReactNode {
  if (v == null) return null;
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}
