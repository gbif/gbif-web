import { ChartWrapper } from './EnumChartGenerator';

type KeyChartGeneratorProps = {
  predicate?: unknown;
  detailsRoute?: string;
  fieldName: string;
  translationTemplate?: string; // will fallback to "enums.{fieldName}.{key}"
  facetSize?: number;
  disableOther?: boolean;
  disableUnknown?: boolean;
  currentFilter?: Record<string, unknown>; // excluding root predicate
  gqlEntity?: string; // e.g. `dataset {title}`
  searchType?: string;
  isVocabulary?: boolean;
  includeMapPredicate?: boolean;
  [key: string]: unknown;
};

// this is for generating charts for fields that are foreign keys like taxonKey, collectionKey, datasetKey, etc.
// for some fields there will always be a value like datasetKey, but e.g. collectionKey is only sparsely filled.
export function KeyChartGenerator({
  predicate,
  detailsRoute,
  fieldName,
  facetSize,
  disableOther,
  disableUnknown,
  currentFilter = {}, // excluding root predicate
  gqlEntity, // e.g. `dataset {title}`
  searchType = 'occurrenceSearch',
  isVocabulary = false,
  includeMapPredicate,
  ...props
}: KeyChartGeneratorProps) {
  const GQL_QUERY = `
    query summary($q: String, $predicate: Predicate${
      !disableUnknown ? ', $hasPredicate: Predicate' : ''
    }, ${isVocabulary ? '$vocabularyLocale: String,' : ''} $size: Int, $from: Int){
      search: ${searchType}(q: $q, predicate: $predicate) {
        documents(size: 0) {
          total
        }
        cardinality {
          total: ${fieldName}
        }
        facet {
          results: ${fieldName}(size: $size, from: $from) {
            key
            count
            ${gqlEntity ? `entity: ${gqlEntity}` : ''}
            ${
              includeMapPredicate
                ? `occurrences {
              metaPredicate
              _meta
            }`
                : ''
            }
          }
        }
      }
      ${
        !disableUnknown
          ? `isNotNull: ${searchType}(q: $q, predicate: $hasPredicate) {
        documents(size: 0) {
          total
        }
      }`
          : ''
      }
    }
  `;
  return (
    <ChartWrapper
      {...{
        predicate,
        detailsRoute,
        gqlQuery: GQL_QUERY,
        currentFilter,
        disableOther,
        disableUnknown,
        predicateKey: fieldName,
        facetSize,
      }}
      {...props}
    />
  );
}

type VocabularyChartGeneratorProps = Omit<KeyChartGeneratorProps, 'isVocabulary'> & {
  isVocabulary?: boolean;
};

export function VocabularyChartGenerator({
  isVocabulary: _isVocabulary = false,
  ...props
}: VocabularyChartGeneratorProps) {
  return <KeyChartGenerator {...(props as KeyChartGeneratorProps)} isVocabulary />;
}
