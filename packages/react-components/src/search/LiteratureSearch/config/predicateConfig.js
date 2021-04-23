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
    q: {
      singleValue: true
    },
  }
}

export default filterConf;