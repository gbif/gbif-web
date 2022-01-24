import { filters } from './filterConf';

const filterConf = {
  fields: {
    publisherKey: {
      defaultKey: 'publishingOrg'
    },
    hostingOrganizationKey: {
      defaultKey: 'hostingOrg'
    },
    publishingCountryCode: {
      defaultKey: 'publishingCountry'
    },
    q: {
      singleValue: true
    },
    datasetType: {
      defaultKey: 'type'
    },
    datasetSubtype: {
      defaultKey: 'subtype'
    }
  }
}

filters.forEach(filter => {
  filterConf.fields[filter] = filterConf.fields[filter] || {};
});

export default filterConf;