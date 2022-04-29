import { filters } from './filterConf';

const filterConf = {
  fields: {
    samplingProtocol: {
      defaultKey: 'samplingProtocol'
    },
    country: {
      defaultKey: 'countryCode'
    },
    q: {
      defaultType: 'fuzzy',
      v1: {
        supportedTypes: ['fuzzy']
      }
    },
    year: {
      defaultType: 'range',
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    measurementOrFactCount: {
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

console.log(filterConf);

export default filterConf;