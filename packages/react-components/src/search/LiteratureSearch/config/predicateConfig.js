import get from 'lodash/get';

const filterConf = {
  fields: {
    countriesOfResearcher: {
      defaultKey: 'countriesOfResearcher'
    },
    countriesOfCoverage: {
      defaultKey: 'countriesOfCoverage'
    },
    datasetKey: {
      defaultKey: 'gbifDatasetKey'
    },
    publisherKey: {
      defaultKey: 'publishingOrganizationKey'
    },
    q: {
      singleValue: true
    },
  }
}

export default filterConf;