import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { useTaxonTree } from './context';
import {
  buildChildrenQuery,
  buildNodePredicate,
  Constraint,
  TaxonBucket,
  TaxonChildrenResult,
  TaxonChildrenVariables,
} from './helpers';

const DEFAULT_SIZE = 50;

type TaxonNode = {
  taxonKey: string | null; // null => inferred placeholder ("no <rank>")
  name: string;
  rank: string;
  count: number;
  rankIndex: number;
  constraints: Constraint[];
};

// Fetches and renders the children of a node (or the roots when parentRankIndex
// is -1). Handles three behaviours from the spec:
//  - skip ranks that have no data and jump to the first rank that does
//  - infer an expandable placeholder for the records missing the child rank
//  - auto-expand when there is exactly one child and no placeholder
export function TaxonChildren({
  parentRankIndex,
  parentConstraints,
}: {
  parentRankIndex: number;
  parentConstraints: Constraint[];
}) {
  const { basePredicate, q, checklistKey, ranks } = useTaxonTree();
  const isRoot = parentRankIndex < 0;
  const childStart = parentRankIndex + 1;
  const [facetIndex, setFacetIndex] = useState(childStart);
  const [size, setSize] = useState(DEFAULT_SIZE);

  // parentConstraints is a fresh array on every ancestor render, so memoize on a
  // stable serialization to avoid refetching expanded nodes unnecessarily.
  const constraintsKey = JSON.stringify(parentConstraints);
  const predicate = useMemo(
    () => buildNodePredicate(basePredicate, parentConstraints, ranks, checklistKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [basePredicate, constraintsKey, ranks, checklistKey]
  );

  const query = useMemo(
    () => buildChildrenQuery({ ranks, cardinalityFromIndex: childStart, facetIndex }),
    [ranks, childStart, facetIndex]
  );

  const { data, loading, error, load } = useQuery<TaxonChildrenResult, TaxonChildrenVariables>(
    query,
    { lazyLoad: true }
  );

  useEffect(() => {
    load({ variables: { predicate, q, checklistKey, size }, keepDataWhileLoading: true });
  }, [load, predicate, q, checklistKey, size]);

  const search = data?.search;
  const cardinality = search?.cardinality ?? {};
  const buckets = (search?.facet?.children ?? []).filter((b): b is TaxonBucket => b != null);

  // When the faceted rank has no buckets, look for the first deeper rank that
  // does have data. If one exists we skip the empty rank entirely; if none
  // does, the records simply aren't classified below this point and we surface
  // an expandable "No <rank>" placeholder instead of rendering nothing.
  const deeperRankWithData =
    search && buckets.length === 0
      ? ranks.findIndex((r, i) => i > facetIndex && Number(cardinality[r.key]) > 0)
      : -1;

  useEffect(() => {
    if (search && buckets.length === 0 && deeperRankWithData !== -1) {
      setFacetIndex(deeperRankWithData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // While advancing past an empty rank we are still effectively loading.
  if (deeperRankWithData !== -1) {
    return <TreeChildrenSkeleton />;
  }

  if (error && !search) {
    return (
      <li className="g-py-1 g-text-red-500">
        <FormattedMessage id="phrases.error" defaultMessage="Failed to load" />
      </li>
    );
  }

  // No data yet (initial fetch in flight) or reloading with nothing to show.
  // With lazyLoad the query sits in a "not loading, no data" state until the
  // load effect runs, so key the skeleton off the absence of data rather than
  // the loading flag.
  if (!search || (loading && buckets.length === 0)) {
    return <TreeChildrenSkeleton />;
  }

  const childRankIndex = facetIndex;
  const childRank = ranks[childRankIndex];
  const total = Number(search?.documents?.total ?? 0);
  const sum = buckets.reduce((acc, b) => acc + Number(b.count), 0);
  // With no buckets sum is 0, so the placeholder represents the whole node.
  const placeholderCount = total - sum;
  const truncated = Number(cardinality[childRank.key] ?? 0) > buckets.length;
  const autoExpandSingle = buckets.length === 1 && placeholderCount <= 0;

  if (total <= 0) {
    return isRoot ? (
      <li className="g-py-1 g-text-slate-400">
        <FormattedMessage id="phrases.noResults" defaultMessage="No results" />
      </li>
    ) : null;
  }

  return (
    <>
      {buckets.map((bucket) => {
        const node: TaxonNode = {
          taxonKey: bucket.key,
          name: bucket.taxon?.usage?.name ?? bucket.label ?? bucket.key,
          rank: bucket.taxon?.usage?.rank ?? childRank.rank,
          count: Number(bucket.count),
          rankIndex: childRankIndex,
          constraints: [...parentConstraints, { rankIndex: childRankIndex, taxonKey: bucket.key }],
        };
        return <TaxonTreeNode key={bucket.key} node={node} autoExpand={autoExpandSingle} />;
      })}

      {placeholderCount > 0 && (
        <TaxonTreeNode
          key="__placeholder__"
          node={{
            taxonKey: null,
            name: '',
            rank: childRank.rank,
            count: placeholderCount,
            rankIndex: childRankIndex,
            constraints: [...parentConstraints, { rankIndex: childRankIndex, taxonKey: null }],
          }}
          autoExpand={false}
        />
      )}

      {truncated && (
        <li className="g-ps-2 g-py-1">
          <button
            type="button"
            className="g-text-primary-500 hover:g-underline"
            onClick={() => setSize((s) => s + DEFAULT_SIZE)}
          >
            <FormattedMessage id="phrases.loadMore" defaultMessage="Load more" />
          </button>
        </li>
      )}
    </>
  );
}

function TaxonTreeNode({ node, autoExpand }: { node: TaxonNode; autoExpand: boolean }) {
  const { formatMessage } = useIntl();
  const { selectedKeys, onToggleSelect, ranks } = useTaxonTree();
  const expandable = node.rankIndex < ranks.length - 1;
  const [expanded, setExpanded] = useState(autoExpand);

  // A node can become "the only child" after its parent finishes loading.
  useEffect(() => {
    if (autoExpand) setExpanded(true);
  }, [autoExpand]);

  const isPlaceholder = node.taxonKey === null;
  const selected = node.taxonKey != null && selectedKeys.includes(node.taxonKey);

  const rankLabel = formatMessage({
    id: `enums.taxonRank.${node.rank}`,
    defaultMessage: node.rank,
  });

  const displayName = isPlaceholder
    ? formatMessage(
        { id: 'taxonomicTree.unknownRank', defaultMessage: 'Unknown {rank}' },
        { rank: rankLabel }
      )
    : node.name;

  // The name segment expands the node; for leaves (deepest rank) it falls back
  // to toggling the filter so a leaf taxon can still be selected.
  const handleName = () => {
    if (expandable) {
      setExpanded((e) => !e);
    } else if (node.taxonKey != null) {
      onToggleSelect(node.taxonKey);
    }
  };

  return (
    <li className="g-list-none">
      <div className="g-flex g-items-center g-py-0.5">
        <button
          type="button"
          onClick={handleName}
          aria-expanded={expandable ? expanded : undefined}
          title={displayName}
          className="g-flex-none g-flex g-items-center g-text-start"
        >
          <span
            aria-hidden
            className={cn(
              'gbif-rtl-icon g-flex-none g-flex g-items-center g-justify-center g-w-5 g-h-5 g-me-1 g-text-slate-400',
              !expandable && 'g-invisible'
            )}
          >
            <svg
              className={cn('g-w-3 g-h-3 g-transition-transform', expanded && 'g-rotate-90')}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <span
            className={cn(
              'g-px-2 g-py-0.5 g-rounded g-border g-border-solid g-bg-white g-whitespace-nowrap',
              'hover:g-bg-slate-50',
              isPlaceholder
                ? 'g-border-dashed g-text-slate-400 g-italic'
                : selected
                  ? 'g-border-primary-500'
                  : 'g-border-slate-200'
            )}
          >
            {displayName}
          </span>
        </button>

        <button
          type="button"
          disabled={isPlaceholder}
          aria-pressed={isPlaceholder ? undefined : selected}
          aria-label={
            isPlaceholder
              ? undefined
              : formatMessage(
                  { id: 'taxonomicTree.filterBy', defaultMessage: 'Filter by {name}' },
                  { name: node.name }
                )
          }
          onClick={() => node.taxonKey != null && onToggleSelect(node.taxonKey)}
          className={cn(
            'g-flex-none g-ms-1 g-px-2 g-py-0.5 g-rounded g-border g-border-solid g-tabular-nums',
            isPlaceholder && 'g-border-dashed g-border-slate-200 g-text-slate-400 g-cursor-default',
            !isPlaceholder &&
              (selected
                ? 'g-bg-primary-500 g-border-primary-500 g-text-white'
                : 'g-border-slate-200 g-text-slate-500 hover:g-bg-slate-50')
          )}
        >
          <FormattedNumber value={node.count} />
        </button>
      </div>

      {expandable && expanded && (
        <ul className="g-m-0 g-list-none g-ps-3 g-ms-2 g-border-s g-border-slate-200">
          <TaxonChildren parentRankIndex={node.rankIndex} parentConstraints={node.constraints} />
        </ul>
      )}
    </li>
  );
}

const SKELETON_WIDTHS = ['g-w-40', 'g-w-28', 'g-w-32', 'g-w-24'];

function TreeChildrenSkeleton() {
  return (
    <>
      {SKELETON_WIDTHS.map((width, i) => (
        <li key={i} className="g-list-none">
          <div className="g-flex g-items-center g-py-0.5">
            <span className="g-flex-none g-w-5 g-h-5 g-me-1" />
            <Skeleton className={cn('g-flex-none g-h-6', width)} />
            <Skeleton className="g-flex-none g-ms-1 g-h-6 g-w-12" />
          </div>
        </li>
      ))}
    </>
  );
}
