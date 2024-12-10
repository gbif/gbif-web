import { filters } from './filterConf';

const filterConf = {
  fields: {
    countryGrSciColl: {
      defaultKey: 'country',
    },
    q: {
      singleValue: true
    },
    active: {
      transformValue: x => x === 'true'
    },
    identifier: {
      singleValue: true
    },
    institutionType: {
      defaultKey: 'type',
    },
    numberSpecimens: {

      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    specimensInGbif: {

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