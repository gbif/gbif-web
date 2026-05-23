import { Classification } from '@/components/classification';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { Taxa } from '@/components/dashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { InstallationLabel, PublisherLabel } from '@/components/filters/displayNames';
import { OccurrenceIcon } from '@/components/highlights';
import { FormattedDateRange } from '@/components/message';
import Properties from '@/components/properties';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/largeCard';
import { Card as SmallCard, CardContent as SmallCardContent } from '@/components/ui/smallCard';
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
import formatAsPercentage from '@/utils/formatAsPercentage';
import { cn } from '@/utils/shadcn';
import { Progress } from '@radix-ui/react-progress';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaGlobeAfrica } from 'react-icons/fa';
import { MdEvent, MdLink } from 'react-icons/md';
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

  const decimalLatitude = event?.decimalLatitude ?? firstOccurrence?.decimalLatitude ?? null;
  const decimalLongitude = event?.decimalLongitude ?? firstOccurrence?.decimalLongitude ?? null;
  const eventID = event?.eventID ?? firstOccurrence?.eventID;
  const countryCode = event?.country ?? firstOccurrence?.countryCode;
  const eventDate = event?.eventDate ?? firstOccurrence?.eventDate;
  const eventType = event?.eventType;

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
  }, [load, datasetKey, eventID]);

  const total = insights?.unfiltered?.documents?.total;
  const withCoordinates = insights?.withCoordinates?.documents?.total;
  const withYear = insights?.withYear?.documents?.total;
  const withTaxonMatch =
    (insights?.unfiltered?.documents?.total ?? 0) -
    (insights?.withTaxonMatch?.documents?.total ?? 0);
  const withCoordinatesPercentage = formatAsPercentage(withCoordinates! / total!);
  const withYearPercentage = formatAsPercentage(withYear! / total!);
  const withTaxonMatchPercentage = formatAsPercentage(withTaxonMatch / total!);

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

  const humboldtRecords = (event?.humboldt ?? []).filter(Boolean);
  const hasHumboldt = humboldtRecords.length > 0;

  const hasProvenance = !!(
    event?.license ||
    event?.references ||
    event?.modified ||
    event?.lastCrawled ||
    event?.lastInterpreted ||
    event?.lastParsed ||
    event?.installationKey ||
    event?.publishingOrgKey ||
    (event?.networkKeys ?? []).some(Boolean) ||
    event?.programmeAcronym ||
    event?.projectId ||
    event?.projectTitle ||
    event?.fundingAttribution
  );

  const sections = useMemo(() => {
    const list: Array<{ id: string; label: React.ReactNode }> = [
      {
        id: 'summary',
        label: <FormattedMessage id="occurrenceDetails.groups.summary" defaultMessage="Summary" />,
      },
    ];
    if (childEventCount > 0) {
      list.push({
        id: 'child-events',
        label: <FormattedMessage id="dataset.childEvents" defaultMessage="Child events" />,
      });
    }
    if (!!total) {
      list.push({
        id: 'occurrences',
        label: <FormattedMessage id="dataset.occurrenceCount" defaultMessage="Occurrences" />,
      });
    }
    if (!!total) {
      list.push({
        id: 'taxa',
        label: <FormattedMessage id="occurrenceDetails.groups.taxon" defaultMessage="Taxa" />,
      });
    }
    if (mediaItems.length > 0) {
      list.push({
        id: 'media',
        label: <FormattedMessage id="phrases.media" defaultMessage="Media" />,
      });
    }
    if (hasMethodology) {
      list.push({
        id: 'methodology',
        label: <FormattedMessage id="phrases.methodology" defaultMessage="Methodology" />,
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
        label: <FormattedMessage id="phrases.relations" defaultMessage="Relations" />,
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
    if (hasProvenance) {
      list.push({
        id: 'provenance',
        label: <FormattedMessage id="phrases.provenance" defaultMessage="Provenance" />,
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
    hasProvenance,
  ]);

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
        <span>
          <FormattedMessage id="occurrenceFieldNames.eventID" />: {eventID ?? eventId}
        </span>
      </Classification>
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
                    {sections.map((s) => (
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
                      </>
                    )}
                  </ul>
                </nav>
              </Card>

              {/* Map thumbnail */}
              {decimalLatitude != null && decimalLongitude != null && (
                <SmallCard className="g-mt-4 g-overflow-hidden">
                  <a
                    href={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s-circle+285A98(${decimalLongitude},${decimalLatitude})/${decimalLongitude},${decimalLatitude},12,0/600x400@2x?access_token=${import.meta.env.PUBLIC_MAPBOX_ACCESS_TOKEN}`}
                    target="_blank"
                    rel="noreferrer"
                    className="g-block g-relative g-group"
                  >
                    <img
                      src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${decimalLongitude},${decimalLatitude})/${decimalLongitude},${decimalLatitude},8,0/300x180@2x?access_token=${import.meta.env.PUBLIC_MAPBOX_ACCESS_TOKEN}`}
                      alt=""
                      className="g-w-full g-block"
                    />
                  </a>
                  <SmallCardContent className="g-text-xs g-text-slate-600 g-pt-2 g-pb-2">
                    <div className="g-flex g-items-center g-gap-2">
                      {countryCode && (
                        <span className="g-inline-flex g-items-center g-gap-1">
                          <FaGlobeAfrica />
                          <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                        </span>
                      )}
                      {eventDate && (
                        <span className="g-inline-flex g-items-center g-gap-1 g-ms-auto">
                          <MdEvent />
                          <EventDateText eventDate={eventDate} />
                        </span>
                      )}
                    </div>
                  </SmallCardContent>
                </SmallCard>
              )}

              {/* Geo precision card */}
              {hasGeoPrecision && (
                <SmallCard className="g-mt-4">
                  <SmallCardContent className="g-pt-3 g-text-xs g-text-slate-700">
                    <div className="g-font-semibold g-text-slate-600 g-mb-1">
                      <FormattedMessage
                        id="phrases.geoPrecision"
                        defaultMessage="Geo precision"
                      />
                    </div>
                    <dl className="g-grid g-gap-x-2 g-grid-cols-[auto_1fr] g-gap-y-1">
                      <GeoBit
                        labelId="occurrenceFieldNames.coordinateUncertaintyInMeters"
                        value={event?.coordinateUncertaintyInMeters}
                      />
                      <GeoBit
                        labelId="occurrenceFieldNames.coordinatePrecision"
                        value={event?.coordinatePrecision}
                      />
                      <GeoBit
                        labelId="occurrenceFieldNames.distanceFromCentroidInMeters"
                        value={event?.distanceFromCentroidInMeters}
                      />
                      <GeoBit
                        labelId="occurrenceFieldNames.geodeticDatum"
                        value={event?.geodeticDatum}
                      />
                      <GeoBit
                        labelId="occurrenceFieldNames.depth"
                        value={
                          event?.depth != null
                            ? `${event.depth}${event.depthAccuracy ? ` ± ${event.depthAccuracy}` : ''}`
                            : null
                        }
                      />
                      <GeoBit
                        labelId="occurrenceFieldNames.elevation"
                        value={
                          event?.elevation != null
                            ? `${event.elevation}${
                                event.elevationAccuracy ? ` ± ${event.elevationAccuracy}` : ''
                              }`
                            : null
                        }
                      />
                    </dl>
                  </SmallCardContent>
                </SmallCard>
              )}
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
                </div>
              </div>
            </div>

            <div className="g-mt-4">
              <Properties breakpoint={800} className="[&>dt]:g-w-52">
                <SimpleProperty label="occurrenceDetails.dataset">
                  <DynamicLink
                    pageId="datasetKey"
                    variables={{ key: datasetKey }}
                    className="g-text-inherit g-underline"
                  >
                    {event?.dataset?.title ?? data?.dataset?.title}
                  </DynamicLink>
                </SimpleProperty>
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

          {/* Sub-events */}
          {childEventCount > 0 && eventID && (
            <SamplingEventChildList
              datasetKey={datasetKey}
              eventId={eventID}
              totalCount={childEventCount}
            />
          )}

          {/* Occurrences insights */}
          {!!total && (
            <Group
              id="occurrences"
              label="dataset.occurrenceCount"
              className="g-mb-4 g-scroll-mt-24"
            >
              <ErrorBoundary
                type="BLOCK"
                errorMessage={<FormattedMessage id="dataset.errors.occurrenceInfo" />}
              >
                <div className="g-flex g-text-sm">
                  <div className="g-flex-none g-me-3">
                    <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                      <OccurrenceIcon />
                    </div>
                  </div>
                  <div className="g-flex-auto">
                    <DynamicLink
                      pageId="occurrenceSearch"
                      searchParams={{ datasetKey: datasetKey, eventId }}
                      className="g-text-inherit"
                    >
                      <h5 className="g-font-bold">
                        <FormattedMessage id="counts.nOccurrences" values={{ total }} />
                      </h5>
                    </DynamicLink>
                    {total > 0 && (
                      <div className="g-text-slate-500 g-mt-2 g-space-y-2 g-max-w-md">
                        <ProgressLine
                          label={
                            <FormattedMessage
                              id="counts.percentWithCoordinates"
                              values={{ percent: withCoordinatesPercentage }}
                            />
                          }
                          value={(100 * (withCoordinates ?? 0)) / total}
                        />
                        <ProgressLine
                          label={
                            <FormattedMessage
                              id="counts.percentWithYear"
                              values={{ percent: withYearPercentage }}
                            />
                          }
                          value={(100 * (withYear ?? 0)) / total}
                        />
                        <ProgressLine
                          label={
                            <FormattedMessage
                              id="counts.percentWithTaxonMatch"
                              values={{ percent: withTaxonMatchPercentage }}
                            />
                          }
                          value={(100 * withTaxonMatch) / total}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </ErrorBoundary>
            </Group>
          )}

          {/* Taxa */}
          {!!total && (
            <Group id="taxa" label="occurrenceDetails.groups.taxon" className="g-mb-4 g-scroll-mt-24">
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
                        { type: PredicateType.Equals, key: 'datasetKey', value: datasetKey },
                        { type: PredicateType.Equals, key: 'eventId', value: eventID },
                      ],
                    }}
                  />
                </ErrorBoundary>
              </ClientSideOnly>
            </Group>
          )}

          {/* Media */}
          {mediaItems.length > 0 && (
            <Group
              id="media"
              label="phrases.media"
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

          {/* Methodology */}
          {hasMethodology && (
            <Group
              id="methodology"
              label="phrases.methodology"
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
              label="phrases.relations"
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

          {/* Issues — placed just before Provenance to mirror occurrence-page order */}
          {issues.length > 0 && (
            <Group
              id="issues"
              label="occurrenceDetails.groups.issues"
              description={<FormattedMessage id="occurrenceDetails.issuesHelpText" />}
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
                          <FormattedMessage id={`enums.occurrenceIssue.${issue}`} />
                        </td>
                        <td dir="auto">
                          <FormattedMessage id={`enums.occurrenceIssueDescription.${issue}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Group>
          )}

          {/* Provenance — matches the low-key occurrence-page Debug section */}
          {hasProvenance && (
            <div id="provenance" className="g-mb-4 g-text-sm g-scroll-mt-24">
              <CardContent>
                <Properties breakpoint={800} className="[&>dt]:g-w-52 g-text-slate-700">
                {event?.license && (
                  <SimpleProperty label="occurrenceFieldNames.license">
                    {event.license}
                  </SimpleProperty>
                )}
                {event?.references && (
                  <SimpleProperty label="occurrenceFieldNames.references">
                    <a
                      href={event.references}
                      target="_blank"
                      rel="noreferrer"
                      className="g-text-primary g-underline g-break-all"
                    >
                      {event.references}
                    </a>
                  </SimpleProperty>
                )}
                {event?.modified && (
                  <SimpleProperty label="phrases.modified">{event.modified}</SimpleProperty>
                )}
                {event?.lastCrawled && (
                  <SimpleProperty label="phrases.lastCrawled">{event.lastCrawled}</SimpleProperty>
                )}
                {event?.lastInterpreted && (
                  <SimpleProperty label="phrases.lastInterpreted">
                    {event.lastInterpreted}
                  </SimpleProperty>
                )}
                {event?.installationKey && (
                  <SimpleProperty label="occurrenceFieldNames.installationKey">
                    <DynamicLink
                      to={`/installation/${event.installationKey}`}
                      pageId="installationKey"
                      variables={{ key: event.installationKey }}
                      className="g-text-inherit g-underline"
                    >
                      <InstallationLabel id={event.installationKey} />
                    </DynamicLink>
                  </SimpleProperty>
                )}
                {event?.publishingOrgKey && (
                  <SimpleProperty label="occurrenceFieldNames.publisher">
                    <DynamicLink
                      to={`/publisher/${event.publishingOrgKey}`}
                      pageId="publisherKey"
                      variables={{ key: event.publishingOrgKey }}
                      className="g-text-inherit g-underline"
                    >
                      <PublisherLabel id={event.publishingOrgKey} />
                    </DynamicLink>
                  </SimpleProperty>
                )}
                {(event?.networkKeys ?? []).filter(Boolean).length > 0 && (
                  <SimpleProperty label="occurrenceFieldNames.networkKey">
                    {(event!.networkKeys as string[]).filter(Boolean).join(', ')}
                  </SimpleProperty>
                )}
                {event?.programmeAcronym && (
                  <SimpleProperty label="occurrenceFieldNames.programme">
                    {event.programmeAcronym}
                  </SimpleProperty>
                )}
                {(event?.projectId || event?.projectTitle) && (
                  <SimpleProperty label="occurrenceFieldNames.projectId">
                    {event?.projectTitle ?? ''}
                    {event?.projectTitle && event?.projectId ? ' — ' : ''}
                    {event?.projectId ?? ''}
                  </SimpleProperty>
                )}
                {event?.fundingAttribution && (
                  <SimpleProperty label="phrases.funding">
                    {event.fundingAttribution}
                    {event.fundingAttributionID && (
                      <span className="g-text-slate-500"> ({event.fundingAttributionID})</span>
                    )}
                  </SimpleProperty>
                )}
                </Properties>
              </CardContent>
            </div>
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

function ProgressLine({ label, value }: { label: React.ReactNode; value: number }) {
  return (
    <div>
      <div>{label}</div>
      <Progress value={value} className="g-h-1" />
    </div>
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
  const doy =
    event?.startDayOfYear != null || event?.endDayOfYear != null
      ? `${event?.startDayOfYear ?? ''}${
          event?.endDayOfYear && event.endDayOfYear !== event.startDayOfYear
            ? `–${event.endDayOfYear}`
            : ''
        }`
      : null;
  return (
    <SimpleProperty label="occurrenceFieldNames.eventDate">
      {eventDate ? <EventDateText eventDate={eventDate} /> : ymd}
      {doy && (
        <span className="g-text-slate-500 g-ms-2 g-text-xs">
          (<FormattedMessage id="phrases.dayOfYear" defaultMessage="day of year" />: {doy})
        </span>
      )}
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
    <SimpleProperty label="phrases.sampledAt">
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

function GeoBit({
  labelId,
  value,
}: {
  labelId: string;
  value: number | string | null | undefined;
}) {
  if (value == null || value === '') return null;
  return (
    <>
      <dt className="g-text-slate-500">
        <FormattedMessage id={labelId} defaultMessage={humanize(labelId)} />
      </dt>
      <dd className="g-break-words">{value}</dd>
    </>
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
