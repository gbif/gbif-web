import get from 'lodash/get';

const filterConf = {
  fields: {
    publisherKey: {
      defaultKey: 'publishingOrg'
    },
    hostKey: {
      defaultKey: 'hostingOrg'
    },
    publishingCountryCode: {
      defaultKey: 'publishingCountry'
    }
  }
}

export default filterConf;