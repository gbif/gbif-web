import { filters } from './filterConf';

const filterConf = {
  fields: {
    taxonKey: {
      singleValue: true
    },
    projectId: {
      singleValue: true
    },
    rulesetId: {
      singleValue: true
    },
    datasetKey: {
      singleValue: true
    }
  }
}

filters.forEach(filter => {
  filterConf.fields[filter] = filterConf.fields[filter] || {};
});

export default filterConf;