import { getAsQuery } from '@/components/filters/filterTools';
import { NoRecords } from '@/components/noDataMessages';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import useQuery from '@/hooks/useQuery';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { LuSettings2 as FilterIcon } from 'react-icons/lu';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { searchConfig } from '../../searchConfig';
import { useEntityDrawer } from '../browseList/useEntityDrawer';
import { GalleryItem } from './mediaPresentation';
import { GROUP_FIELDS, GroupField } from './mediaSort';
import { Formatted } from 'maplibre-gl';

const INITIAL_GROUPS = 20;
const GROUPS_INCREMENT = 20;
const MAX_GROUPS = 200;
const IMAGES_PER_GROUP = 16;
const GROUP_IMAGE_HEIGHT = 180;

type GroupResult = {
  key: string;
  count: number;
  occurrences?: {
    documents: {
      total: number;
      results: Array<{
        key: number;
        primaryImage?: { identifier?: string } | null;
        verbatimScientificName?: string;
        eventDate?: string;
        countryCode?: string;
        classification?: {
          usage?: { name?: string };
          taxonMatch?: { usage?: { canonicalName?: string } };
        } | null;
      } | null>;
    };
  } | null;
};

function buildGroupedQuery(field: GroupField): string {
  return /* GraphQL */ `
    query occurrenceMediaGrouped_${field.id}(
      $q: String
      $predicate: Predicate
      $unspecifiedPredicate: Predicate
      $facetSize: Int
      $imageSize: Int
      $checklistKey: ID
    ) {
      occurrenceSearch(q: $q, predicate: $predicate) {
        cardinality {
          ${field.id}
        }
        facet {
          ${field.id}(size: $facetSize) {
            count
            key
            occurrences {
              documents(size: $imageSize) {
                total
                results {
                  key
                  primaryImage {
                    identifier: thumbor(height: 400)
                  }
                  verbatimScientificName
                  eventDate
                  countryCode
                  classification(checklistKey: $checklistKey) {
                    usage {
                      name
                    }
                    taxonMatch {
                      usage {
                        canonicalName
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      unspecified: occurrenceSearch(q: $q, predicate: $unspecifiedPredicate) {
        documents(size: $imageSize) {
          total
          results {
            key
            primaryImage {
              identifier: thumbor(height: 400)
            }
            verbatimScientificName
            eventDate
            countryCode
            classification(checklistKey: $checklistKey) {
              usage {
                name
              }
              taxonMatch {
                usage {
                  canonicalName
                }
              }
            }
          }
        }
      }
    }
  `;
}

type Props = {
  groupBy: string;
};

export function MediaGrouped({ groupBy }: Props) {
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const [, setPreviewKey] = useEntityDrawer();
  const [facetSize, setFacetSize] = useState(INITIAL_GROUPS);

  const field = useMemo(() => GROUP_FIELDS.find((f) => f.id === groupBy), [groupBy]);
  const query = useMemo(() => (field ? buildGroupedQuery(field) : null), [field]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error, loading, load } = useQuery<any, any>(query ?? '', {
    lazyLoad: true,
    keepDataWhileLoading: true,
    throwAllErrors: false,
  });

  // Reset paging when the filter or chosen group field changes.
  useEffect(() => {
    setFacetSize(INITIAL_GROUPS);
  }, [filterContext.filterHash, groupBy]);

  // Track which (filter, groupBy) the currently-held `data` actually belongs to.
  // useQuery keeps prior data while a new request is in flight (which we want
  // for pagination), but for filter/groupBy changes we want to swap to skeletons
  // until fresh data lands.
  const currentKey = `${filterContext.filterHash}|${groupBy}`;
  const [loadedKey, setLoadedKey] = useState<string | undefined>();
  // Captured at the moment `load()` is dispatched, so when fresh data arrives
  // we can adopt the key that the response was actually requested for. Using
  // `currentKey` directly here would race: a filter change re-renders with the
  // new key while `data` is still the old payload, and the loadedKey effect
  // would briefly tag the old data as fresh.
  const loadingForRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!loading && data) setLoadedKey(loadingForRef.current);
  }, [loading, data]);
  const isStale = loadedKey !== undefined && loadedKey !== currentKey;

  useEffect(() => {
    if (!query || !field) return;
    const q = getAsQuery({ filter: filterContext.filter, searchContext, searchConfig }) as {
      predicate?: unknown;
      q?: string;
    };
    const stillImagePredicate = {
      type: 'in',
      key: 'mediaType',
      values: ['StillImage'],
    };
    const predicate = {
      type: 'and',
      predicates: [q.predicate, stillImagePredicate].filter((x) => x),
    };
    const unspecifiedPredicate = {
      type: 'and',
      predicates: [q.predicate, stillImagePredicate, { type: 'isNull', key: field.id }].filter(
        (x) => x
      ),
    };
    loadingForRef.current = currentKey;
    load({
      variables: {
        q: q.q,
        predicate,
        unspecifiedPredicate,
        facetSize,
        imageSize: IMAGES_PER_GROUP,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterContext.filterHash, searchContext, load, facetSize]);

  if (!field) return null;

  if (!data && error) throw error;

  // While a filter/groupBy change is in flight, ignore the stale data so the
  // UI shows skeleton placeholders instead of the previous results.
  const freshData = isStale ? undefined : data;
  const groups: GroupResult[] = (freshData?.occurrenceSearch?.facet?.[field.id] ?? []).filter(
    Boolean
  );
  const totalGroups: number = freshData?.occurrenceSearch?.cardinality?.[field.id] ?? 0;
  const reachedCap = facetSize >= MAX_GROUPS;
  const hasMoreInApi = totalGroups > groups.length;
  const hasMore = hasMoreInApi && !reachedCap;
  const cappedHint = hasMoreInApi && reachedCap;

  const unspecifiedDocs = freshData?.unspecified?.documents;
  const unspecifiedTotal: number = unspecifiedDocs?.total ?? 0;
  const unspecifiedResults = (unspecifiedDocs?.results ?? []).filter(Boolean);

  // Show skeleton cards when we don't yet have fresh data for the current
  // (filter, group-by) combination.
  const showInitialSkeleton = !freshData;

  // Only treat empty results as "no records" once we've actually got a response back.
  if (!loading && freshData && groups.length === 0 && unspecifiedTotal === 0) {
    return <NoRecords />;
  }

  return (
    <div className="g-mt-3 g-space-y-4">
      {groups.map((group) => (
        <GroupCard
          key={group.key}
          group={group}
          field={field}
          onSelect={(key) => setPreviewKey(`o_${key}`)}
        />
      ))}
      {unspecifiedTotal > 0 && (
        <UnspecifiedGroupCard
          field={field}
          total={unspecifiedTotal}
          results={unspecifiedResults}
          onSelect={(key) => setPreviewKey(`o_${key}`)}
        />
      )}
      {showInitialSkeleton && (
        <>
          <GroupCardSkeleton />
          <GroupCardSkeleton />
          <GroupCardSkeleton />
        </>
      )}
      {hasMore && (
        <div className="g-flex g-justify-center g-my-6">
          <Button
            disabled={loading}
            variant="primaryOutline"
            onClick={() => setFacetSize((s) => Math.min(s + GROUPS_INCREMENT, MAX_GROUPS))}
          >
            {loading ? (
              <Spinner />
            ) : (
              <FormattedMessage id="search.group.showMore" values={{ count: GROUPS_INCREMENT }} />
            )}
          </Button>
        </div>
      )}
      {cappedHint && (
        <div className="g-text-center g-text-sm g-text-slate-500 g-my-6">
          <FormattedMessage
            id="search.group.cappedHint"
            values={{
              shown: <FormattedNumber value={groups.length} />,
              total: <FormattedNumber value={totalGroups} />,
            }}
          />
        </div>
      )}
    </div>
  );
}

type GroupOccurrence = NonNullable<
  NonNullable<GroupResult['occurrences']>['documents']['results'][number]
>;

function getFormattedName(occ: GroupOccurrence): string {
  return (
    occ.classification?.taxonMatch?.usage?.canonicalName ??
    occ.classification?.usage?.name ??
    occ.verbatimScientificName ??
    ''
  );
}

function GroupCard({
  group,
  field,
  onSelect,
}: {
  group: GroupResult;
  field: GroupField;
  onSelect: (key: number) => void;
}) {
  const { setFullField } = useContext(FilterContext);
  const results: GroupOccurrence[] = (group.occurrences?.documents?.results ?? []).filter(
    Boolean
  ) as GroupOccurrence[];
  const filterField = field.filterField ?? field.id;

  return (
    <CardShell>
      <CardHeader
        title={<GroupLabel group={group} field={field} />}
        count={group.count}
        // Drill-down: replace any existing values for this field with just this bucket.
        onUseAsFilter={() => setFullField(filterField, [group.key], [])}
      />
      <CardImages>
        {results.map((occ) => (
          <GalleryItem
            key={occ.key}
            identifier={occ.primaryImage?.identifier ?? ''}
            formattedName={getFormattedName(occ)}
            countryCode={occ.countryCode ?? ''}
            eventDate={occ.eventDate ?? ''}
            height={GROUP_IMAGE_HEIGHT}
            minWidth={0}
            onClick={() => onSelect(occ.key)}
          />
        ))}
      </CardImages>
    </CardShell>
  );
}

function UnspecifiedGroupCard({
  field,
  total,
  results,
  onSelect,
}: {
  field: GroupField;
  total: number;
  results: GroupOccurrence[];
  onSelect: (key: number) => void;
}) {
  const { setFullField } = useContext(FilterContext);
  const filterField = field.filterField ?? field.id;
  return (
    <CardShell>
      <CardHeader
        title={
          <span className="g-text-slate-500 g-italic">
            <FormattedMessage id="search.group.unspecified" />
          </span>
        }
        count={total}
        // Drill-down: replace any existing values for this field with just the
        // "no value" predicate.
        onUseAsFilter={() => setFullField(filterField, [{ type: 'isNull' }], [])}
      />
      <CardImages>
        {results.map((occ) => (
          <GalleryItem
            key={occ.key}
            identifier={occ.primaryImage?.identifier ?? ''}
            formattedName={getFormattedName(occ)}
            countryCode={occ.countryCode ?? ''}
            eventDate={occ.eventDate ?? ''}
            height={GROUP_IMAGE_HEIGHT}
            minWidth={0}
            onClick={() => onSelect(occ.key)}
          />
        ))}
      </CardImages>
    </CardShell>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="g-bg-white g-rounded-lg g-shadow-sm g-border g-border-solid g-border-slate-200 g-overflow-hidden">
      {children}
    </div>
  );
}

function CardHeader({
  title,
  count,
  onUseAsFilter,
}: {
  title: React.ReactNode;
  count: number;
  onUseAsFilter: () => void;
}) {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'search.group.useAsFilter' });
  return (
    <div className="g-flex g-items-center g-justify-between g-gap-3 g-px-4 g-py-3 g-border-b g-border-solid g-border-slate-100 g-bg-slate-50/50">
      <div className="g-flex g-items-baseline g-gap-2 g-min-w-0">
        <h3 className="g-text-base g-font-semibold g-truncate g-text-slate-800 g-m-0">{title}</h3>
        <span className="g-text-xs g-text-slate-500 g-flex-shrink-0">
          <FormattedNumber value={count} />
        </span>
      </div>
      <SimpleTooltip title={label} asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={label}
          className="g-inline-flex g-items-center g-gap-1 g-flex-shrink-0"
          onClick={onUseAsFilter}
        >
          <FilterIcon className="g-text-sm" />
          <span className="g-hidden sm:g-inline">{label}</span>
        </Button>
      </SimpleTooltip>
    </div>
  );
}

function CardImages({ children }: { children: React.ReactNode }) {
  return (
    <div className="g-flex g-flex-wrap g-px-2 g-py-2">
      {children}
      {/* Spacer: soaks up trailing whitespace so the last image isn't stretched
          to fill the row when it ends up alone on its line. Mirrors the same
          trick in the flat gallery. */}
      <div className="g-flex-1 g-flex-grow-[1000]"></div>
    </div>
  );
}

function GroupLabel({ group, field }: { group: GroupResult; field: GroupField }) {
  const ValueLabel = field.ValueLabel;
  if (!ValueLabel) {
    // Fields without a label component (e.g. year) — render the bucket key directly.
    return <>{group.key}</>;
  }
  return <ValueLabel id={group.key} />;
}

function GroupCardSkeleton() {
  return (
    <CardShell>
      <div className="g-flex g-items-center g-justify-between g-gap-3 g-px-4 g-py-3 g-border-b g-border-solid g-border-slate-100 g-bg-slate-50/50">
        <div className="g-flex g-items-baseline g-gap-2 g-min-w-0 g-flex-1">
          <div className="g-h-5 g-w-48 g-bg-slate-200 g-rounded g-animate-pulse" />
          <div className="g-h-3 g-w-10 g-bg-slate-200 g-rounded g-animate-pulse" />
        </div>
        <div className="g-h-3 g-w-20 g-bg-slate-200 g-rounded g-animate-pulse" />
      </div>
      <div className="g-flex g-flex-wrap g-px-2 g-py-2 g-animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="g-m-2 g-rounded-lg g-bg-slate-200/70"
            style={{
              height: GROUP_IMAGE_HEIGHT,
              // Vary the widths a little so it reads as a row of mixed-aspect images.
              width: GROUP_IMAGE_HEIGHT * (0.8 + ((i * 37) % 100) / 100),
            }}
          />
        ))}
      </div>
    </CardShell>
  );
}
