import { useChecklistKey } from '@/hooks/useChecklistKey';
import ChartClickWrapper from './ChartClickWrapper';
import { OneDimensionalChart } from './OneDimensionalChart';
// import ChartClickWrapper from './ChartClickWrapper';

export function EnumChartGenerator({
  predicate,
  q,
  detailsRoute,
  fieldName,
  enumKeys,
  translationTemplate, // will fallback to "enums.{fieldName}.{key}"
  facetSize,
  disableOther,
  disableUnknown,
  currentFilter = {}, //excluding root predicate
  searchType = 'occurrenceSearch',
  ...props
}) {
  const GQL_QUERY = `
    query summary($q: String, $predicate: Predicate${
      !disableUnknown ? ', $hasPredicate: Predicate' : ''
    }, $size: Int, $from: Int){
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
        q,
        detailsRoute,
        gqlQuery: GQL_QUERY,
        currentFilter,
        translationTemplate: translationTemplate ?? `enums.${fieldName}.{key}`,
        enumKeys,
        disableOther,
        disableUnknown,
        predicateKey: fieldName,
        facetSize,
      }}
      {...props}
    />
  );
}

export function ChartWrapper({
  predicate,
  checklistKey,
  translationTemplate,
  gqlQuery,
  enumKeys,
  predicateKey,
  facetSize,
  disableOther,
  disableUnknown,
  q,
  applyChecklistKey,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  const defaultChecklistKey = useChecklistKey();
  const hasPredicates = [
    {
      type: 'isNotNull',
      key: predicateKey,
    },
  ];
  if (applyChecklistKey) {
    hasPredicates[0].checklistKey = checklistKey ?? defaultChecklistKey;
  }
  if (predicate) {
    hasPredicates.push(predicate);
  }
  const facetQuery = {
    size: facetSize,
    keys: enumKeys,
    translationTemplate,
    predicate,
    query: gqlQuery,
    otherVariables: {
      q,
      hasPredicate: {
        type: 'and',
        predicates: hasPredicates,
      },
    },
  };
  if (applyChecklistKey) {
    facetQuery.otherVariables.checklistKey = checklistKey ?? defaultChecklistKey;
  }

  return (
    <ChartClickWrapper detailsRoute={props.detailsRoute} interactive={props.interactive}>
      <OneDimensionalChart
        {...{ facetQuery, disableOther, disableUnknown, predicateKey, currentFilter }}
        {...props}
      />
    </ChartClickWrapper>
  );
}
