import snakeCase from 'lodash/snakeCase';
const enum_case = str => snakeCase(str || '').toUpperCase();

const filterConf = {
  publisherKey: {
    defaultKey: 'publishingOrganizationKey'
  },
  geometry: {
    defaultType: 'within'
  }
}

export default filterConf;