import { filters } from './filterConf';

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
    year: {
      v1: {
        supportedTypes: ['range', 'equals']
      }
    },
    q: {
      singleValue: true
    },
  }
}

filters.forEach(filter => {
  filterConf.fields[filter] = filterConf.fields[filter] || {};
});

export default filterConf;