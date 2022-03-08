import { filters } from './filterConf';

const filterConf = {
  fields: {
    country: {
      singleValue: true
    },
    institutionKey: {
      defaultKey: 'institution',
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
  }
}

filters.forEach(filter => {
  filterConf.fields[filter] = filterConf.fields[filter] || {};
});

export default filterConf;