import { filters } from './filterConf';

const filterConf = {
  fields: {
    countrySingleGrSciColl: {
      defaultKey: 'country'
    },
    institutionKeySingle: {
      defaultKey: 'institution',
      singleValue: true
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
    numberSpecimens: {
      singleValue: true,
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    specimensInGbif: {
      defaultKey: 'occurrenceCount',
      singleValue: true,
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