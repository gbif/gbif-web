import { ChartWrapper } from './EnumChartGenerator';

// this is for generating charts for fields that are foreign keys like taxonKey, collectionKey, datasetKey, etc.
// for some fields there will always be a value like datasetKey, but e.g. collectionKey is only sparsely filled.
export function KeyChartGenerator({
  predicate,
  detailsRoute,
  fieldName,
  translationTemplate, // will fallback to "enums.{fieldName}.{key}"
  facetSize,
  disableOther,
  disableUnknown,
  currentFilter = {}, // excluding root predicate
  gqlEntity, // e.g. `dataset {title}`
  searchType = 'occurrenceSearch',
  isVocabulary = false,
  ...props
}) {
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

export function VocabularyChartGenerator({ isVocabulary = false, ...props }) {
  return <KeyChartGenerator isVocabulary {...props} />;
}
