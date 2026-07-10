import { Predicate } from '@/gql/graphql';
import { createContext, useContext } from 'react';
import { RankDef } from './helpers';

export type TaxonTreeContextValue = {
  basePredicate?: Predicate | null;
  q?: string;
  checklistKey?: string;
  ranks: RankDef[];
  selectedKeys: string[];
  onToggleSelect: (taxonKey: string) => void;
};

export const TaxonTreeContext = createContext<TaxonTreeContextValue | undefined>(undefined);

export function useTaxonTree(): TaxonTreeContextValue {
  const context = useContext(TaxonTreeContext);
  if (!context) {
    throw new Error('Taxonomic tree sub-components must be used within a TaxonomicTree');
  }
  return context;
}
