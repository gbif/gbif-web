import { filters } from './filterConf';

const filterConf = {
  fields: {
    countrySingle: {
      singleValue: true,
      defaultKey: 'country'
    },
    q: {
      singleValue: true
    },
    networkKey: {
      singleValue: true
    }
  }
}

filters.forEach(filter => {
  filterConf.fields[filter] = filterConf.fields[filter] || {};
});

export default filterConf;