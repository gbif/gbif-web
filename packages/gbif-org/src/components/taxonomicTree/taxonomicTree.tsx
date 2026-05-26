import { FilterContext } from '@/contexts/filter';
import { Predicate } from '@/gql/graphql';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import { cn } from '@/utils/shadcn';
import hash from 'object-hash';
import { useContext, useMemo } from 'react';
import { TaxonTreeContext, TaxonTreeContextValue } from './context';
import { TaxonChildren } from './treeNodes';

const TAXON_FILTER_HANDLE = 'taxonKey';

export type TaxonomicTreeProps = {
  predicate?: Predicate | null;
  q?: string;
  checklistKey?: string;
  className?: string;
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
  selectedKeys: selectedKeysProp,
  onToggleSelect: onToggleSelectProp,
}: TaxonomicTreeProps) {
  const { filter, toggle } = useContext(FilterContext);
  const defaultChecklistKey = useChecklistKey();
  const resolvedChecklistKey = checklistKey ?? defaultChecklistKey;

  const filterSelectedKeys: string[] = (filter?.must?.[TAXON_FILTER_HANDLE] ?? [])
    .filter((v) => typeof v === 'string' || typeof v === 'number')
    .map((v) => v.toString());
  const selectedKeys = selectedKeysProp ?? filterSelectedKeys;
  const onToggleSelect =
    onToggleSelectProp ?? ((taxonKey: string) => toggle(TAXON_FILTER_HANDLE, taxonKey));

  const contextValue: TaxonTreeContextValue = useMemo(
    () => ({
      basePredicate: predicate,
      q,
      checklistKey: resolvedChecklistKey,
      selectedKeys,
      onToggleSelect,
    }),
    [predicate, q, resolvedChecklistKey, selectedKeys, onToggleSelect]
  );

  // When the base query changes the whole tree needs to re-root, so remount the
  // root by changing its key.
  const resetKey = useMemo(
    () => hash({ predicate: predicate ?? null, q: q ?? null, checklistKey: resolvedChecklistKey ?? null }),
    [predicate, q, resolvedChecklistKey]
  );

  return (
    <TaxonTreeContext.Provider value={contextValue}>
      <div className={cn('g-text-sm', className)}>
        <nav aria-label="Taxonomic tree">
          <ul key={resetKey} className="g-m-0 g-p-0 g-list-none">
            <TaxonChildren parentRankIndex={-1} parentConstraints={[]} />
          </ul>
        </nav>
      </div>
    </TaxonTreeContext.Provider>
  );
}
