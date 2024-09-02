import { filters } from './filterConf';

const filterConf = {
  fields: {
    countryGrSciColl: {
      defaultKey: 'country'
    },
    collectionDescriptorCountry: {
      defaultKey: 'descriptorCountry'
    },
    institutionKeySingle: {
      defaultKey: 'institutionKey',
      singleValue: true
    },
    taxonKeyGrSciColl: {
      defaultKey: 'taxonKey',
    },
    recordedByFreeText: {
      defaultKey: 'recordedBy',
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
    alternativeCode: {
      singleValue: true
    },
    identifier: {
      singleValue: true
    },
    collectionContentType: {
      defaultKey: 'contentType'
    },
    preservationType: {
      
    },
    active: {
      singleValue: true,
      transformValue: x => x === 'true'
    },
    personalCollection: {
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