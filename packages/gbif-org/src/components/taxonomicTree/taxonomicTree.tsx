import { FilterContext } from '@/contexts/filter';
import { Predicate } from '@/gql/graphql';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import { cn } from '@/utils/shadcn';
import hash from 'object-hash';
import { useCallback, useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { TaxonTreeContext, TaxonTreeContextValue } from './context';
import { MAJOR_TAXON_RANKS, RankDef } from './helpers';
import { TaxonChildren } from './treeNodes';

const TAXON_FILTER_HANDLE = 'taxonKey';

export type TaxonomicTreeProps = {
  predicate?: Predicate | null;
  q?: string;
  checklistKey?: string;
  className?: string;
  // The ordered list of ranks to build the tree from. Defaults to the main
  // Linnean ranks (the only ones the occurrence index currently facets on).
  ranks?: RankDef[];
  // The currently selected taxa, used to highlight matching nodes. When omitted
  // the component reads the taxonKey occurrence filter directly.
  selectedKeys?: string[];
  // Called when a node's count is clicked. When omitted the component toggles
  // the taxonKey occurrence filter directly. The component never renders the
  // selection itself — that is left to the surrounding filter UI.
  onToggleSelect?: (taxonKey: string) => void;
};

export function TaxonomicTree({
  predicate,
  q,
  checklistKey,
  className,
  ranks = MAJOR_TAXON_RANKS,
  selectedKeys: selectedKeysProp,
  onToggleSelect: onToggleSelectProp,
}: TaxonomicTreeProps) {
  const intl = useIntl();
  const { filter, toggle } = useContext(FilterContext);
  const defaultChecklistKey = useChecklistKey();
  const resolvedChecklistKey = checklistKey ?? defaultChecklistKey;

  const filterSelectedKeys: string[] = (filter?.must?.[TAXON_FILTER_HANDLE] ?? [])
    .filter((v) => typeof v === 'string' || typeof v === 'number')
    .map((v) => v.toString());
  const selectedKeys = selectedKeysProp ?? filterSelectedKeys;

  const onToggleSelect = useCallback(
    (taxonKey: string) =>
      onToggleSelectProp ? onToggleSelectProp(taxonKey) : toggle(TAXON_FILTER_HANDLE, taxonKey),
    [onToggleSelectProp, toggle]
  );

  // Stable string keys so unrelated re-renders don't rebuild the context value
  // (which would re-render the whole tree).
  const selectedKeysKey = selectedKeys.join('|');
  const ranksKey = ranks.map((r) => r.key).join('|');

  const contextValue = useMemo<TaxonTreeContextValue>(
    () => ({
      basePredicate: predicate,
      q,
      checklistKey: resolvedChecklistKey,
      ranks,
      selectedKeys,
      onToggleSelect,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [predicate, q, resolvedChecklistKey, ranksKey, selectedKeysKey, onToggleSelect]
  );

  // When the base query (or rank set) changes the whole tree needs to re-root,
  // so remount the root by changing its key.
  const resetKey = useMemo(
    () =>
      hash({
        predicate: predicate ?? null,
        q: q ?? null,
        checklistKey: resolvedChecklistKey ?? null,
        ranks: ranksKey,
      }),
    [predicate, q, resolvedChecklistKey, ranksKey]
  );

  return (
    <TaxonTreeContext.Provider value={contextValue}>
      <div className={cn('g-text-sm', className)}>
        <ul
          key={resetKey}
          aria-label={intl.formatMessage({
            id: 'taxonomicTree.label',
            defaultMessage: 'Taxonomic tree',
          })}
          className="g-m-0 g-p-0 g-list-none"
        >
          <TaxonChildren parentRankIndex={-1} parentConstraints={[]} />
        </ul>
      </div>
    </TaxonTreeContext.Provider>
  );
}
