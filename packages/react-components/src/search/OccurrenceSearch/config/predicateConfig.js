import snakeCase from 'lodash/snakeCase';
const enum_case = str => snakeCase(str || '').toUpperCase();

const filterConf = {
  publisherKey: {
    defaultKey: 'publishingOrganizationKey'
  },
  basisOfRecord: {
    transformValue: x => enum_case(x)
  },
  geometry: {
    defaultType: 'within'
  }
}

export default filterConf;