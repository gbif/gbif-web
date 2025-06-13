import { FormattedMessage } from 'react-intl';
import { ChartWrapper } from './EnumChartGenerator';

// this is for generating charts for fields that are foreign keys like taxonKey, collectionKey, datasetKey, etc.
// for some fields there will always be a value like datasetKey, but e.g. collectionKey is only sparsely filled.
export function EventDate({
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
    query summary($q: String, $predicate: Predicate${
      !disableUnknown ? ', $hasPredicate: Predicate' : ''
    }){
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        documents(size: 0) {
          total
        }
        facet: autoDateHistogram {
          results: eventDate(buckets: 50, minimum_interval: "day") {
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
      ${
        !disableUnknown
          ? `isNotNull: occurrenceSearch(q: $q, predicate: $hasPredicate) {
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
        options: ['TIME'],
        messages: ['dashboard.usingStartDates'],
        title: <FormattedMessage id="filters.eventDate.name" defaultMessage="Event date" />,
        predicateKey: 'eventDate',
        facetSize,
        transform: (data) => {
          return data?.search?.facet?.results?.buckets?.map((x) => {
            return {
              ...x,
              title: x.date,
            };
          });
        },
      }}
      {...props}
    />
  );
}

export function LiteratureCreatedAt({
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
      search: literatureSearch(predicate: $predicate) {
        documents(size: 0) {
          total
        }
        facet: autoDateHistogram {
          results: createdAt(buckets: 50, minimum_interval: "day") {
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
      ${
        !disableUnknown
          ? `isNotNull: literatureSearch(predicate: $hasPredicate) {
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
        options: ['TIME'],
        title: (
          <FormattedMessage id="filters.publicationDate.name" defaultMessage="Publication date" />
        ),
        predicateKey: 'createdAt',
        facetSize,
        transform: (data) => {
          return data?.search?.facet?.results?.buckets?.map((x) => {
            return {
              ...x,
              title: x.date,
            };
          });
        },
      }}
      {...props}
    />
  );
}
