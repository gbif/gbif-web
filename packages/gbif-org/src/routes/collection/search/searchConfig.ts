import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';

export const config: FilterConfigType = {
  fields: {
    q: {
      singleValue: true
    },
    country: {
      singleValue: false
    }
  }
}

const otherParams = ['descriptorCountry', 'institutionKey', 'taxonKey'];

otherParams.forEach(filter => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;