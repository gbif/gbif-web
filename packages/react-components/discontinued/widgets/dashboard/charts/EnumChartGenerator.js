import { jsx } from '@emotion/react';
import React from 'react';
import { OneDimensionalChart } from './OneDimensionalChart';
import ChartClickWrapper from './ChartClickWrapper';

export function EnumChartGenerator({
  predicate,
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
    query summary($predicate: Predicate${!disableUnknown ? ', $hasPredicate: Predicate' : ''}, $size: Int, $from: Int){
      search: ${searchType}(predicate: $predicate) {
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
      ${!disableUnknown ? `isNotNull: ${searchType}(predicate: $hasPredicate) {
        documents(size: 0) {
          total
        }
      }` : ''}
    }
  `;
  return <ChartWrapper {...{
    predicate, detailsRoute, gqlQuery: GQL_QUERY, currentFilter,
    translationTemplate: translationTemplate ?? `enums.${fieldName}.{key}`,
    enumKeys,
    disableOther,
    disableUnknown,
    predicateKey: fieldName,
    facetSize,
  }} {...props} />
}

export function ChartWrapper({
  predicate,
  translationTemplate,
  gqlQuery,
  enumKeys,
  predicateKey,
  facetSize,
  disableOther,
  disableUnknown,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  const hasPredicates = [
    {
      type: 'isNotNull',
      key: predicateKey
    }
  ];
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
      hasPredicate: {
        type: 'and',
        predicates: hasPredicates
      }
    }
  };

  return <ChartClickWrapper detailsRoute={props.detailsRoute} interactive={props.interactive}>
    <OneDimensionalChart  {...{ facetQuery, disableOther, disableUnknown, predicateKey, currentFilter }} {...props} />
  </ChartClickWrapper>
}