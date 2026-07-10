import { useChecklistKey } from '@/hooks/useChecklistKey';
import ChartClickWrapper from './ChartClickWrapper';
import { OneDimensionalChart } from './OneDimensionalChart';

type EnumChartGeneratorProps = {
  predicate?: unknown;
  q?: string;
  detailsRoute?: string;
  fieldName: string;
  enumKeys?: Array<string | number>;
  translationTemplate?: string; // will fallback to "enums.{fieldName}.{key}"
  facetSize?: number;
  disableOther?: boolean;
  disableUnknown?: boolean;
  currentFilter?: Record<string, unknown>; //excluding root predicate
  searchType?: string;
  includeMapPredicate?: boolean;
  [key: string]: unknown;
};

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
  includeMapPredicate,
  ...props
}: EnumChartGeneratorProps) {
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

type ChartWrapperProps = {
  predicate?: unknown;
  checklistKey?: string;
  translationTemplate?: string;
  gqlQuery: string;
  enumKeys?: Array<string | number>;
  predicateKey: string;
  facetSize?: number;
  disableOther?: boolean;
  disableUnknown?: boolean;
  q?: string;
  applyChecklistKey?: boolean;
  currentFilter?: Record<string, unknown>; //excluding root predicate
  detailsRoute?: string;
  interactive?: boolean;
  [key: string]: unknown;
};

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
}: ChartWrapperProps) {
  const defaultChecklistKey = useChecklistKey();
  const hasPredicates: Array<Record<string, unknown>> = [
    {
      type: 'isNotNull',
      key: predicateKey,
    },
  ];
  if (applyChecklistKey) {
    hasPredicates[0].checklistKey = checklistKey ?? defaultChecklistKey;
  }
  if (predicate) {
    hasPredicates.push(predicate as Record<string, unknown>);
  }
  const facetQuery: {
    size?: number;
    keys?: Array<string | number>;
    translationTemplate?: string;
    predicate?: unknown;
    query: string;
    otherVariables: Record<string, unknown>;
  } = {
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
    <ChartClickWrapper
      detailsRoute={props.detailsRoute as string | undefined}
      interactive={props.interactive as boolean | undefined}
    >
      <OneDimensionalChart
        {...{ facetQuery, disableOther, disableUnknown, predicateKey, currentFilter }}
        {...props}
      />
    </ChartClickWrapper>
  );
}
