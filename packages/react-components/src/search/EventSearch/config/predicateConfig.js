import { filters } from './filterConf';

const filterConf = {
  fields: {
    datasetKey: {
      defaultKey: 'datasetKey'
    },
    samplingProtocol: {
      defaultKey: 'samplingProtocol'
    },
    locationId: {
      defaultKey: 'locationID'
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
    occurrenceCount: {
      defaultType: 'range',
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    eventTaxonomy: {
      defaultType: 'occurrenceJoin',
      defaultKey: 'family'
    },
    eventStateProvince: {
      defaultKey: 'stateProvince'
    }
  }
}

filters.forEach(filter => {
  filterConf.fields[filter] = filterConf.fields[filter] || {};
});

export default filterConf;