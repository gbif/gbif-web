import { getAsQuery } from '@/components/filters/filterTools';
import { NoRecords } from '@/components/noDataMessages';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import useQuery from '@/hooks/useQuery';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { LuSettings2 as FilterIcon } from 'react-icons/lu';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { searchConfig } from '../../searchConfig';
import { useEntityDrawer } from '../browseList/useEntityDrawer';
import { GalleryItem } from './mediaPresentation';
import { GROUP_FIELDS, GroupField, getFormattedName } from './mediaGroupConfig';
import { Card } from '@/components/ui/largeCard';

const INITIAL_GROUPS = 20;
const GROUPS_INCREMENT = 20;
const MAX_GROUPS = 200;
const IMAGES_PER_GROUP = 16;
const GROUP_IMAGE_HEIGHT = 180;
const SHUFFLE_SEED = 12345;

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
          usage?: { name?: string; key?: string | number };
          taxonMatch?: { usage?: { canonicalName?: string } };
        } | null;
        recordedBy?: (string | null)[] | null;
        datasetKey?: string | null;
        datasetTitle?: string | null;
      } | null>;
    };
  } | null;
};

function buildGroupedQuery(field: GroupField): string {
  const ckArg = field.supportsChecklistKey ? '(checklistKey: $checklistKey)' : '';
  return /* GraphQL */ `
    query occurrenceMediaGrouped_${field.id}(
      $q: String
      $predicate: Predicate
      $unspecifiedPredicate: Predicate
      $facetSize: Int
      $imageSize: Int
      $shuffle: Int
      $checklistKey: ID
    ) {
      occurrenceSearch(q: $q, predicate: $predicate) {
        cardinality {
          ${field.id}${ckArg}
        }
        facet {
          ${field.id}(size: $facetSize${field.supportsChecklistKey ? ', checklistKey: $checklistKey' : ''}) {
            count
            key
            occurrences {
              documents(size: $imageSize, shuffle: $shuffle) {
                total
                results {
                  key
                  primaryImage {
                    identifier: thumbor(height: 400)
                  }
                  verbatimScientificName
                  eventDate
                  countryCode
                  datasetKey
                  datasetTitle
                  recordedBy
                  classification(checklistKey: $checklistKey) {
                    usage {
                      name
                      key
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
        documents(size: $imageSize, shuffle: $shuffle) {
          total
          results {
            key
            primaryImage {
              identifier: thumbor(height: 400)
            }
            verbatimScientificName
            eventDate
            countryCode
            recordedBy
            datasetKey
            datasetTitle
            classification(checklistKey: $checklistKey) {
              usage {
                name
                key
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
  onGroupByChange?: (groupBy: string) => void;
};

export function MediaGrouped({ groupBy, onGroupByChange }: Props) {
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const checklistKey = useChecklistKey();
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
      predicates: [
        q.predicate,
        stillImagePredicate,
        { type: 'isNull', key: field.id, checklistKey },
      ].filter((x) => x),
    };
    loadingForRef.current = currentKey;
    load({
      variables: {
        q: q.q,
        predicate,
        unspecifiedPredicate,
        checklistKey,
        facetSize,
        imageSize: IMAGES_PER_GROUP,
        shuffle: SHUFFLE_SEED,
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
          onGroupByChange={onGroupByChange}
        />
      ))}
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
            variant="outline"
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
      {unspecifiedTotal > 0 && (
        <UnspecifiedGroupCard
          field={field}
          total={unspecifiedTotal}
          results={unspecifiedResults}
          onSelect={(key) => setPreviewKey(`o_${key}`)}
        />
      )}
    </div>
  );
}

type GroupOccurrence = NonNullable<
  NonNullable<GroupResult['occurrences']>['documents']['results'][number]
>;

function GroupCard({
  group,
  field,
  onSelect,
  onGroupByChange,
}: {
  group: GroupResult;
  field: GroupField;
  onSelect: (key: number) => void;
  onGroupByChange?: (groupBy: string) => void;
}) {
  const { setFullField } = useContext(FilterContext);
  const results: GroupOccurrence[] = (group.occurrences?.documents?.results ?? []).filter(
    Boolean
  ) as GroupOccurrence[];
  const filterField = field.filterField ?? field.id;

  return (
    <div>
      <CardHeader
        title={<GroupLabel group={group} field={field} />}
        count={group.count}
        onUseAsFilter={() => {
          setFullField(filterField, [group.key], []);
          if (field.drillDownTo && onGroupByChange) {
            onGroupByChange(field.drillDownTo);
          }
        }}
      />
      <Card className="g-overflow-hidden">
        <CardImages dense>
          {results.map((occ) => (
            <GalleryItem
              key={occ.key}
              identifier={occ.primaryImage?.identifier ?? ''}
              formattedName={getFormattedName(occ)}
              taxonKey={occ.classification?.usage?.key}
              countryCode={occ.countryCode ?? ''}
              eventDate={occ.eventDate ?? ''}
              recordedBy={occ.recordedBy}
              datasetKey={occ.datasetKey}
              datasetTitle={occ.datasetTitle}
              height={GROUP_IMAGE_HEIGHT}
              minWidth={0}
              dense
              onClick={() => onSelect(occ.key)}
            />
          ))}
        </CardImages>
      </Card>
    </div>
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
    <div>
      <CardHeader
        title={
          <span className="g-text-slate-500">
            <FormattedMessage id={field.labelId} />
            {': '}
            <FormattedMessage id="search.group.unspecified" />
          </span>
        }
        count={total}
        // Drill-down: replace any existing values for this field with just the
        // "no value" predicate.
        onUseAsFilter={() => setFullField(filterField, [{ type: 'isNull' }], [])}
      />
      <Card className="g-overflow-hidden">
        <CardImages dense>
          {results.map((occ) => (
            <GalleryItem
              key={occ.key}
              identifier={occ.primaryImage?.identifier ?? ''}
              formattedName={getFormattedName(occ)}
              countryCode={occ.countryCode ?? ''}
              eventDate={occ.eventDate ?? ''}
              taxonKey={occ?.classification?.usage?.key}
              datasetKey={occ.datasetKey}
              datasetTitle={occ.datasetTitle}
              recordedBy={occ.recordedBy}
              height={GROUP_IMAGE_HEIGHT}
              minWidth={0}
              dense
              onClick={() => onSelect(occ.key)}
            />
          ))}
        </CardImages>
      </Card>
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
    <div className="g-flex g-items-center g-justify-between g-gap-3 g-ps-4 g-py-2 ">
      <div className="g-flex g-items-baseline g-gap-2 g-min-w-0">
        <h3 className="g-text-base g-font-semibold g-truncate g-text-slate-800 g-m-0">{title}</h3>
        <span className="g-text-xs g-text-slate-500 g-flex-shrink-0">
          <FormattedNumber value={count} />
        </span>
      </div>
      <button
        aria-label={label}
        className="g-text-xs g-ms-1 g-text-slate-600 g-inline-flex g-items-center g-gap-1 g-flex-shrink-0"
        onClick={() => {
          onUseAsFilter();
          document.getElementById('gbif-media-view-top')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="g-hidden sm:g-inline">{label}</span>
        <FilterIcon className="g-text-sm" />
      </button>
    </div>
  );
}

function CardImages({ children, dense }: { children: React.ReactNode; dense?: boolean }) {
  if (dense) {
    return (
      <div className="g-flex g-flex-nowrap g-overflow-x-auto g-px-2 g-py-2 g-gap-0">{children}</div>
    );
  }
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
  const checklistKey = useChecklistKey();
  if (!ValueLabel) {
    // Fields without a label component (e.g. year) — render the bucket key directly.
    return <>{group.key}</>;
  }
  return <ValueLabel id={group.key} checklistKey={checklistKey} />;
}

function GroupCardSkeleton() {
  return (
    <div>
      <div className="g-flex g-items-center g-justify-between g-gap-3 g-px-4 g-py-2">
        <div className="g-flex g-items-baseline g-gap-2 g-min-w-0 g-flex-1">
          <div className="g-h-5 g-w-48 g-bg-slate-200 g-rounded g-animate-pulse" />
          <div className="g-h-3 g-w-10 g-bg-slate-200 g-rounded g-animate-pulse" />
        </div>
        <div className="g-h-3 g-w-20 g-bg-slate-200 g-rounded g-animate-pulse" />
      </div>
      <Card className="g-overflow-hidden">
        <div className="g-flex g-flex-nowrap g-overflow-x-auto g-px-2 g-py-2 g-animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`g-flex-shrink-0 g-m-2 g-rounded-lg g-bg-slate-200/70${i >= 3 ? ' g-hidden sm:g-block' : ''}`}
              style={{
                height: GROUP_IMAGE_HEIGHT,
                // Vary the widths a little so it reads as a row of mixed-aspect images.
                width: GROUP_IMAGE_HEIGHT * (0.8 + ((i * 37) % 100) / 100),
              }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
