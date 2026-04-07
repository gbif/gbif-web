import { NonBackboneTaxon } from '@/routes/taxon/key/taxonKey';
import { useDatasetKeyContext } from './datasetKey';
import EmptyTab from '@/components/EmptyTab';

export const DatasetTaxonKey = () => {
  const { showSpeciesTab } = useDatasetKeyContext();
  if (showSpeciesTab) return <NonBackboneTaxon headLess={true} />;
  return <EmptyTab />;
};
