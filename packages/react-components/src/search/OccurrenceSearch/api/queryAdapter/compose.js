// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filters-aggregation.html#search-aggregations-bucket-filters-aggregation
// might be worth looking into smarter aggregations using filters when there is a small cardinality (enums)

import filter2predicate from './filter2predicate';

export default filter => filter2predicate(filter, filterConf);

const filterConf = {
  // year: termOrRangeFilter('year'),
  taxonKey: {
    defaultKey: 'gbifClassification.taxonKey'
  },
  year: {
    defaultType: 'equals'
  },
  basisOfRecord: {
    transformValue: x => x.toUpperCase()
  },
  geometry: {
    defaultType: 'within'
  }
}

