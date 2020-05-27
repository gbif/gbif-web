// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filters-aggregation.html#search-aggregations-bucket-filters-aggregation
// might be worth looking into smarter aggregations using filters when there is a small cardinality (enums)
/**
 * Build a predicate query based on the app representation of a filter. 
 * This is a subset of what is possible in the API and only generates search predicates, not aggregations and similar.
 */
import { termFilter, termOrRangeFilter } from './converters/util';
import snakeCase from 'lodash/snakeCase';
import sortBy from 'lodash/sortBy';
// when translating the individual filters, the queried, field as well as the value might change. We can asume a sensible default, but other than that we need converters for all fields.
// enums for example varies between the APIs. field names vary etc.

const filterConf = {
  // year: termOrRangeFilter('year'),
  year: {
    type: 'TERMS',
    getValues: values => [1920],
    fieldName: 'year'
  },
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
 * @param {*} filter 
 */
function compose(filter, filterConfig) {
  filter = filter || {};
  const { must, must_not } = filter;

  const positive = getPredicates({ filters: must, filterConfig });
  const negated = getPredicates({ filters: must_not, filterConfig }).map(p => ({ type: 'not', predicate: p }));
  //sort predicates to optimize cache hits
  const predicates = sortBy(positive.concat(negated), ['type', 'key']);
  if (predicates.length === 1) {
    return predicates[0];
  } else {
    return {
      type: 'and',
      predicates
    }
  }
}

function getPredicates({ filters, filterConfig }) {
  if (!filters) return [];
  return Object.entries(filters)
    .map(([filterName, values]) => getPredicate({ filterName, values, filterConfig }))
    .filter(p => p);// remove filters that couldn't be transformed to a predicate
}

function getPredicate({ filterName, values, filterConfig }) {
  const config = filterConfig[filterName];
  console.log(config);
  // if there are no explicit config, then assume 1:1 field name and keywords
  if (!config) {
    return {
      type: 'in',
      key: filterName,
      values
    }
  } else if(typeof config === 'string') {
    // assume keywords, but the filter has a different name in the API
    return {
      type: 'in',
      key: config,
      values
    }
  } else if (typeof config === 'object') {
    // configuration of standard predicates
    if (config.values)
  } else if (typeof config === 'function') {
    //assume it is a function that returns a predicate
    return config({filterName, values});
  }
}

export default compose;

console.log(JSON.stringify(compose({
  must: {
    taxonKey: [1, 2, 3],
    datasetKey: [234,567],
  },
  must_not: {
    issues: ['test']
  }
}, filterConf), null, 2));


/*

GET
pre={country:DK,SE,NO}&countryCode=DK

{
  must: {
    mediaTypes1: [stillImage]
    mediaTypes2: [video]
    issues: ['COORDINATE_ROUNDED']
    year: [{gte:1900, lte: 2000}]
  }
  must_not: {
    datasetKey: ['1234-1234-1234-1234']
  }
}

mediatTypes1: {
  field: mediaTypes
  type: keyword
}

=> 
{
  type: and
  predicates: [
    {
      type: equals
      key: mediaType
      value: stillImage
    },
    {
      type: equals
      key: mediaType
      value: video
    },
    {
      type: in
      key: taxonKey
      values: [1,2,3]
    }
  ]
}


jeg vil gerne kunne lave search/counts/aggregations baseret på 


const q = `
occurrenceQuery(${predicate}) {
  scientificName
  ${cols.map(x => x)}
}
`



*/