import get from 'lodash/get';

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

export default filterConf;