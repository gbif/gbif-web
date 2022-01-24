import { filters } from './filterConf';
// import get from 'lodash/get';
// import snakeCase from 'lodash/snakeCase';
// const enum_case = str => snakeCase(str || '').toUpperCase();

const filterConf = {
  preFilterTransform: filter => {
    const negativeIssues = filter?.must_not?.occurrenceIssue;
    if (negativeIssues && negativeIssues.every(i => (typeof i === "string"))) {
      return {
        must: {
          ...filter.must,
          // notIssues: negativeIssues
        },
        must_not: {
          ...filter.must_not,
          // occurrenceIssue: undefined
        },
      }
    }
    return filter;
  },
  fields: {
    q: {
      defaultType: 'fuzzy',
      v1: {
        supportedTypes: ['fuzzy']
      }
    },
    coordinateUncertainty: {
      defaultKey: 'coordinateUncertaintyInMeters',
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    sampleSizeValue: {
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    relativeOrganismQuantity: {
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    elevation: {
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    publisherKey: {
      defaultKey: 'publishingOrg'
    },
    publishingCountryCode: {
      defaultKey: 'publishingCountry'
    },
    // identifiedBy: {
    //   defaultType: 'equals'
    // },
    occurrenceIssue: {
      defaultKey: 'issue'
    },
    hostKey: {
      defaultKey: 'hostingOrganizationKey'
    },
    notIssues: {
      serializer: ({values}) => ({
        type: 'and', predicates: values.map(x => ({ type: 'equals', key: 'notIssues', value: x }))
      })
    },
    geometry: {
      defaultType: 'within'
    },
    basisOfRecord: {
      defaultNegationKey: 'not_basisOfRecord'
      // preFilterTransform: ({ must, must_not }) => {
      //   const { negatedStrings, other } = partition(must_not, x => typeof x === 'string');
      //   const negated = negatedStrings.length > 0 ? { key: 'not_basisOfRecord', type: 'in', values: negatedStrings } : [];
      //   return {
      //     must: [...must, negated],
      //     must_not: other
      //   }
      // }
    },
    year: {
      defaultType: 'range',
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    depth: {
      defaultType: 'range',
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    organismQuantity: {
      defaultType: 'range',
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
  }
}

filters.forEach(filter => {
  filterConf.fields[filter] = filterConf.fields[filter] || {};
});

export default filterConf;