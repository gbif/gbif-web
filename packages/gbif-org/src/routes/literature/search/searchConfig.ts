import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';

export const searchConfig: FilterConfigType = {
  fields: {
    q: {
      singleValue: true
    },
    year: {
      v1: {
        supportedTypes: ['range', 'equals']
      }
    }
  }
}