// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filters-aggregation.html#search-aggregations-bucket-filters-aggregation
// might be worth looking into smarter aggregations using filters when there is a small cardinality (enums)

import filter2predicate from './filterAdapters/filter2predicate';
import get from 'lodash/get';

export default compose;

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

