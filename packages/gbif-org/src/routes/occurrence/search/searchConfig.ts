import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';

export const searchConfig: FilterConfigType = {
  fields: {
    q: {
      singleValue: true
    },
    country: {
      singleValue: true
    }
  }
}