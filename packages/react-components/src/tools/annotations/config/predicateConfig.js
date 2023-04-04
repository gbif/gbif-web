import { filters } from './filterConf';

const filterConf = {
  fields: {
    taxonKey: {
      singleValue: true
    }
  }
}

filters.forEach(filter => {
  filterConf.fields[filter] = filterConf.fields[filter] || {};
});

export default filterConf;