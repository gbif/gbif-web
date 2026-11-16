import {
  filterEnumConfig,
  filterTaxonConfig,
  Filters,
  generateFilters,
} from '@/components/filters/filterTools';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { SearchMetadata } from '@/contexts/search';
import { taxonKeyConfig } from '@/routes/occurrence/search/filters/keySuggest';
import { nucleotideSequenceTargetGeneConfig } from '@/routes/occurrence/search/filters/vocabulary';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export const DNA_REFERENCE_LIBRARY_CATEGORY = 'DNAReferenceLibrary';

// Only the taxon and target gene filters are offered. Negations and existence checks are off,
// as they make no sense for a list of reference libraries.
const taxonConfig: filterTaxonConfig = {
  ...taxonKeyConfig,
  allowExistence: false,
  allowNegations: false,
};

const targetGeneConfig: filterEnumConfig = {
  ...nucleotideSequenceTargetGeneConfig,
  allowExistence: false,
  allowNegations: false,
};

// URL params match the occurrence search (taxonKey and nucleotideSequence.targetGene).
// The free text is not a filter here: the filter popovers pass a q on to their occurrence facet
// queries, which would narrow the counts by occurrence text.
export const dnaSearchConfig: FilterConfigType = {
  fields: {
    // The taxon is resolved in the site's checklist, as on the occurrence search
    taxonKey: {
      takesChecklistKey: true,
    },
    nucleotideSequenceTargetGene: {
      defaultKey: 'nucleotideSequence.targetGene',
    },
  },
};

// The fixed part of every search: only DNA reference libraries. It is the scope of the search
// context, so it is part of every query but never in the filter or the url.
export const dnaSearchContext: SearchMetadata = {
  queryType: 'PREDICATE',
  // Shown as buttons in the filter bar. Without this they all go into "More".
  highlightedFilters: ['taxonKey', 'nucleotideSequenceTargetGene'],
  scope: {
    type: 'equals',
    key: 'datasetCategory',
    value: DNA_REFERENCE_LIBRARY_CATEGORY,
  },
};

export function useDnaFilters(): Filters {
  const { formatMessage } = useIntl();
  return useMemo(
    () => ({
      taxonKey: generateFilters({
        config: taxonConfig,
        searchConfig: dnaSearchConfig,
        formatMessage,
      }),
      nucleotideSequenceTargetGene: generateFilters({
        config: targetGeneConfig,
        searchConfig: dnaSearchConfig,
        formatMessage,
      }),
    }),
    [formatMessage]
  );
}
