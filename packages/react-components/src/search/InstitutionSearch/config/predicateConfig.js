import { filters } from './filterConf';

const filterConf = {
  fields: {
    country: {
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
    }
  }
}

filters.forEach(filter => {
  filterConf.fields[filter] = filterConf.fields[filter] || {};
});

export default filterConf;