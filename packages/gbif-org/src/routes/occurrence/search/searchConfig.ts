import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';

const config: FilterConfigType = {
  fields: {
    q: {
      singleValue: true
    },
  } 
}

const otherParams = ['country', 'taxonKey', 'institutionKey'];

otherParams.forEach(filter => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;