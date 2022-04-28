import { filters } from './filterConf';

const filterConf = {
  fields: {
    samplingProtocol: {
      defaultKey: 'samplingProtocol'
    },
    country: {
      defaultKey: 'countryCode'
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