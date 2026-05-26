import { useQuery } from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { useTaxonTree } from './context';
import {
  buildChildrenQuery,
  buildNodePredicate,
  Constraint,
  LAST_RANK_INDEX,
  TAXON_RANKS,
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
  const { basePredicate, q, checklistKey } = useTaxonTree();
  const childStart = parentRankIndex + 1;
  const [facetIndex, setFacetIndex] = useState(childStart);
  const [size, setSize] = useState(DEFAULT_SIZE);

  // parentConstraints is a fresh array on every ancestor render, so memoize on a
  // stable serialization to avoid refetching expanded nodes unnecessarily.
  const constraintsKey = JSON.stringify(parentConstraints);
  const predicate = useMemo(
    () => buildNodePredicate(basePredicate, parentConstraints, checklistKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [basePredicate, constraintsKey, checklistKey]
  );

  const query = useMemo(
    () => buildChildrenQuery({ cardinalityFromIndex: childStart, facetIndex }),
    [childStart, facetIndex]
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
      ? TAXON_RANKS.findIndex((r, i) => i > facetIndex && Number(cardinality[r.key]) > 0)
      : -1;

  useEffect(() => {
    if (search && buckets.length === 0 && deeperRankWithData !== -1) {
      setFacetIndex(deeperRankWithData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Loading on first fetch, or while we are advancing past an empty rank.
  if ((loading && buckets.length === 0) || deeperRankWithData !== -1) {
    return (
      <li className="g-py-1 g-text-sm g-text-slate-400">
        <FormattedMessage id="phrases.loading" defaultMessage="Loading…" />
      </li>
    );
  }

  if (error && !search) {
    return (
      <li className="g-py-1 g-text-sm g-text-red-500">
        <FormattedMessage id="phrases.error" defaultMessage="Failed to load" />
      </li>
    );
  }

  if (!search) return null;

  const childRankIndex = facetIndex;
  const childRank = TAXON_RANKS[childRankIndex];
  const total = Number(search?.documents?.total ?? 0);
  const sum = buckets.reduce((acc, b) => acc + Number(b.count), 0);
  // With no buckets sum is 0, so the placeholder represents the whole node.
  const placeholderCount = total - sum;
  const truncated = Number(cardinality[childRank.key] ?? 0) > buckets.length;
  const autoExpandSingle = buckets.length === 1 && placeholderCount <= 0;

  if (total <= 0) return null;

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
            className="g-text-sm g-text-primary-500 hover:g-underline"
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
  const { selectedKeys, onToggleSelect } = useTaxonTree();
  const expandable = node.rankIndex < LAST_RANK_INDEX;
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
        </button>

        <button
          type="button"
          onClick={handleName}
          className={cn(
            'g-flex-none g-px-2 g-py-0.5 g-rounded g-border g-border-solid g-bg-white g-text-start',
            'hover:g-bg-slate-50',
            isPlaceholder ? 'g-border-dashed g-text-slate-400 g-italic' : 'g-border-slate-200'
          )}
        >
          {displayName}
        </button>

        <button
          type="button"
          disabled={isPlaceholder}
          onClick={() => node.taxonKey != null && onToggleSelect(node.taxonKey)}
          className={cn(
            'g-flex-none g-ms-1 g-px-2 g-py-0.5 g-rounded g-border g-border-solid g-text-sm g-tabular-nums',
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
