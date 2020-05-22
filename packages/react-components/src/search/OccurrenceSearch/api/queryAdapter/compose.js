// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filters-aggregation.html#search-aggregations-bucket-filters-aggregation
// might be worth looking into smarter aggregations using filters when there is a small cardinality (enums)
/**
 * Build an ES query based on the app representation of a filter. 
 * This is a subset of what is possible in ES and only generates search queries, not aggregations and similar.
 */
import bodybuilder from 'bodybuilder';
import { termFilter, termOrRangeFilter } from './converters/util';
import snakeCase from 'lodash/snakeCase';
// when translating the individual filters, the queried, field as well as the value might change. We can asume a sensible default, but other than that we need converters for all fields.
// enums for example varies between the APIs. field names vary etc.

const filters = {
  year: termOrRangeFilter('year'),
  basisOfRecord: {
    type: 'TERMS',
    getValues: values => values.map(e => snakeCase(e).toUpperCase()),
    fieldName: 'basisOfRecord'
  },
  Rank: {
    type: 'TERMS',
    getValues: values => values.map(e => snakeCase(e).toUpperCase()),
    fieldName: 'gbifClassification.usage.rank'
  },
  typeStatus: {
    type: 'TERMS',
    getValues: values => values.map(e => snakeCase(e).toUpperCase()),
    fieldName: 'typeStatus'
  },
  MediaType: {
    type: 'TERMS',
    getValues: values => values,
    fieldName: 'mediaTypes'
  },
  gallery_media_type: {
    type: 'TERMS',
    getValues: values => values,
    fieldName: 'mediaTypes'
  },
  taxonKey: {
    type: 'TERMS',
    getValues: values => values,
    fieldName: 'gbifClassification.taxonKey'
  },
  publisherKey: {
    type: 'TERMS',
    getValues: values => values,
    fieldName: 'publishingOrganizationKey'
  },
  country: {
    type: 'TERMS',
    getValues: values => values.map(e => e.toUpperCase()),
    fieldName: 'countryCode'
  }
  // not here, and it will be assumed to be a 1 to 1 mapping to a terms filter
}
/**
 * A query is expected to have format: {filterNameA: [1], filterNameB: ['a', 'b']}
 * A query can composed by adding one filter ad a time. the order of filters should not matter.
 * @param {*} query 
 */
function compose(query) {
  query = query || {};
  const { must } = query;
  let builder = bodybuilder();
  if (!must) return builder();
  // iterate all filters and add all to the builder
  // TODO might be worth doing this sorting fields and values, so that 2 queries, with different order gets cahced the same
  Object.entries(must).forEach(([filterName, values]) => {
    const filterConverter = filters[filterName];
    if (filterConverter) {
      // if there exists an explicit mapping for this field, then use that
      if (typeof filterConverter === 'string') {
        // this should be considered a simple terms query with the string as the mapping to the ES field
        termFilter(filterConverter)(values, builder);
      } else {
        // this is a custom builder
        // filters[filterName](values, builder);
        termFilter(filterConverter.fieldName)(filterConverter.getValues(values), builder);
      }
    } else {
      // Not a known filter with an explicit configuration
      // we have several options. 
      // 1 We can ignore the filter as it is unknown
      // 2 We can assume it is a terms filter
      // 3 We can test that it is all strings/numbers and then use a terms filter
      // 4 We can do 3 but also test against the _mappings (e.g. http://c6n1.gbif.org:9200/default-dynamic/_mapping)
      // The simplest solution for now is to assume that it is correctly configured and do 2.
      termFilter(filterName)(values, builder);
    }
  });
  return builder;
}

export default compose;