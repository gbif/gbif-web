import { useConfig } from '@/config/config';
import type { DatasetType } from '@/gql/graphql';
import { useI18n } from '@/reactRouterPlugins';
import { GraphQLService } from '@/services/graphQLService';
import { useEffect, useMemo, useState } from 'react';

export const DNA_REFERENCE_LIBRARY_CATEGORY = 'DNAReferenceLibrary';
const TARGET_GENE_KEY = 'nucleotideSequence.targetGene';
// Max number of datasets we list. Matches the facet size used for the dataset list.
const MAX_DATASETS = 500;
// Max number of target genes we look up. Matches the facet size used for the gene filter.
const MAX_TARGET_GENES = 200;

export type FacetBucket = { key: string; count: number };

export type DnaReferenceLibraryDataset = {
  key: string;
  title?: string | null;
  description?: string | null;
  excerpt?: string | null;
  type: DatasetType;
  publishingOrganizationTitle?: string | null;
};

type Predicate = Record<string, unknown>;

type DatasetBucket = FacetBucket & { dataset?: DnaReferenceLibraryDataset | null };

type QueryResult = {
  genes: { facet: { targetGene: FacetBucket[] } };
  search: { facet: { datasetKey: DatasetBucket[] } };
};

// Two aliased searches in one request:
// - genes ignores the gene filter, so the other genes stay selectable with their counts
// - search applies the gene filter, and the datasetKey facet resolves each dataset
const QUERY = /* GraphQL */ `
  query DnaReferenceLibraries($taxonPredicate: Predicate, $predicate: Predicate) {
    genes: occurrenceSearch(predicate: $taxonPredicate, size: 0) {
      facet {
        targetGene: nucleotideSequenceTargetGene(size: ${MAX_TARGET_GENES}) {
          key
          count
        }
      }
    }
    search: occurrenceSearch(predicate: $predicate, size: 0) {
      facet {
        datasetKey(size: ${MAX_DATASETS}) {
          key
          count
          dataset {
            key
            title
            description
            excerpt
            type
            publishingOrganizationTitle
          }
        }
      }
    }
  }
`;

// The predicate for all DNA reference libraries, narrowed by taxon keys if any are selected.
export function getBasePredicate(taxonKeys: string[]): Predicate {
  const predicates: Predicate[] = [
    { type: 'equals', key: 'datasetCategory', value: DNA_REFERENCE_LIBRARY_CATEGORY },
  ];
  if (taxonKeys.length > 0) {
    predicates.push({ type: 'in', key: 'taxonKey', values: taxonKeys });
  }
  return { type: 'and', predicates };
}

// The base predicate, narrowed to datasets holding one of the selected target genes.
export function getDatasetPredicate(taxonKeys: string[], targetGenes: string[]): Predicate {
  const predicates: Predicate[] = [
    { type: 'equals', key: 'datasetCategory', value: DNA_REFERENCE_LIBRARY_CATEGORY },
  ];
  if (taxonKeys.length > 0) {
    predicates.push({ type: 'in', key: 'taxonKey', values: taxonKeys });
  }
  if (targetGenes.length > 0) {
    predicates.push({ type: 'in', key: TARGET_GENE_KEY, values: targetGenes });
  }
  return { type: 'and', predicates };
}

/**
 * Loads the DNA reference libraries with one occurrence search.
 * The datasetKey facet resolves each dataset (title, description, publisher), so no separate
 * dataset lookups are needed. Taxon keys and target genes are filtered on the server.
 */
export function useDnaReferenceLibraries({
  taxonKeys,
  targetGenes,
}: {
  taxonKeys: string[];
  targetGenes: string[];
}) {
  const config = useConfig();
  const { locale } = useI18n();
  const localeCode = locale.cmsLocale || locale.code;
  const endpoint = config.graphqlEndpoint;

  // Stable arrays derived from the strings, so they can be used in effect dependencies
  const taxonKeysId = taxonKeys.join(',');
  const taxonKeysList = useMemo(() => (taxonKeysId ? taxonKeysId.split(',') : []), [taxonKeysId]);
  const targetGenesId = targetGenes.join(',');
  const targetGenesList = useMemo(
    () => (targetGenesId ? targetGenesId.split(',') : []),
    [targetGenesId]
  );

  const [result, setResult] = useState<QueryResult | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(undefined);
    const service = new GraphQLService({
      endpoint,
      locale: localeCode,
      abortSignal: controller.signal,
    });
    service
      .query<QueryResult, Record<string, unknown>>(QUERY, {
        taxonPredicate: getBasePredicate(taxonKeysList),
        predicate: getDatasetPredicate(taxonKeysList, targetGenesList),
      })
      .then((response) => response.json())
      .then((json) => {
        // Partial data (e.g. one dataset not found) is still useful, so only fail when there is no data
        if (json.errors?.length && !json.data) throw new Error(json.errors[0].message);
        if (!controller.signal.aborted) setResult(json.data);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [endpoint, localeCode, taxonKeysList, targetGenesList]);

  const datasets = useMemo(
    () =>
      (result?.search.facet.datasetKey ?? [])
        .map((bucket) => bucket.dataset)
        .filter((dataset): dataset is DnaReferenceLibraryDataset => Boolean(dataset)),
    [result]
  );

  return {
    loading,
    error,
    // true when a facet hit its size cap, so the list may be incomplete
    truncated:
      (result?.search.facet.datasetKey?.length ?? 0) >= MAX_DATASETS ||
      (result?.genes.facet.targetGene?.length ?? 0) >= MAX_TARGET_GENES,
    targetGenes: result?.genes.facet.targetGene ?? [],
    datasets,
  };
}
