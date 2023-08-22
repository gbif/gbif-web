import { jsx } from '@emotion/react';
import React from 'react';
import { ChartWrapper } from './EnumChartGenerator';
import { FormattedMessage } from 'react-intl';

// this is for generating charts for fields that are foreign keys like taxonKey, collectionKey, datasetKey, etc.
// for some fields there will always be a value like datasetKey, but e.g. collectionKey is only sparsely filled.
export function Year({
  predicate,
  detailsRoute,
  fieldName,
  translationTemplate, // will fallback to "enums.{fieldName}.{key}"
  facetSize,
  disableOther,
  disableUnknown,
  currentFilter = {}, // excluding root predicate
  gqlEntity, // e.g. `dataset {title}`
  ...props
}) {
  const GQL_QUERY = `
    query summary($predicate: Predicate${!disableUnknown ? ', $hasPredicate: Predicate' : ''}){
      occurrenceSearch(predicate: $predicate) {
        documents(size: 0) {
          total
        }
        facet: autoDateHistogram {
          results: eventDate(buckets: 50) {
            interval
            buckets {
              key: date
              utc: key
              date
              title: date
              count
            }
          }
        }
      }
      ${!disableUnknown ? `isNotNull: occurrenceSearch(predicate: $hasPredicate) {
        documents(size: 0) {
          total
        }
      }` : ''}
    }
  `;
  return <ChartWrapper {...{
    predicate, detailsRoute, gqlQuery: GQL_QUERY, currentFilter,
    disableOther,
    disableUnknown,
    title: <FormattedMessage id="filters.eventDate.name" defaultMessage="Event date" />,
    predicateKey: 'eventDate',
    facetSize,
    transform: data => {
      return data?.occurrenceSearch?.facet?.results?.buckets?.map(x => {
        return {
          ...x,
          title: x.date
        }
      });
    }
  }} {...props} />
}