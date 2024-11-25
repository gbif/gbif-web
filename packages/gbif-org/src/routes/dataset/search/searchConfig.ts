import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';

const config: FilterConfigType = {
  fields: {
    q: {
      singleValue: true
    },
    country: {
      singleValue: true
    },
    type: {
      defaultKey: 'type'
    }
  }
}
const otherParams = ['license', 'publishingCountry', 'projectId', 'hostingOrg', 'publishingOrg'];

otherParams.forEach(filter => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;