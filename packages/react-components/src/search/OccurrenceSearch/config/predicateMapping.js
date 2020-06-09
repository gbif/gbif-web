import snakeCase from 'lodash/snakeCase';
const enum_case = str => snakeCase(str || '').toUpperCase();

const filterConf = {
  // year: termOrRangeFilter('year'),
  taxonKey: {
    defaultKey: 'taxonKey'
  },
  year: {
    defaultType: 'equals'
  },
  basisOfRecord: {
    transformValue: x => enum_case(x)
  },
  geometry: {
    defaultType: 'within'
  }
}

export default filterConf;