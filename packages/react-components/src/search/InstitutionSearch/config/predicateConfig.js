import { filters } from './filterConf';

const filterConf = {
  fields: {
    countrySingleGrSciColl: {
      defaultKey: 'country',
    },
    q: {
      singleValue: true
    },
    name: {
      singleValue: true
    },
    fuzzyName: {
      singleValue: true
    },
    city: {
      singleValue: true
    },
    code: {
      singleValue: true
    },
    active: {
      singleValue: true,
      transformValue: x => x === 'true'
    },
    alternativeCode: {
      singleValue: true
    },
    identifier: {
      singleValue: true
    },
    numberSpecimens: {
      singleValue: true,
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    specimensInGbif: {
      singleValue: true,
      defaultKey: 'occurrenceCount',
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