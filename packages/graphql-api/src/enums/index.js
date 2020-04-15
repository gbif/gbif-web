// Load all enumerations from the GBIF API. http://api.gbif.org/v1/enumeration/basic
// e.g. http://api.gbif.org/v1/enumeration/basic/BasisOfRecord

const got = require('got');
const _ = require('lodash');
const config = require('../config');
const API_V1 = config.API_V1;

async function loadEnums() {
  const types = await getEnumData('enumeration/basic')
  const enums = await Promise.all(
    types.map(type => getEnumData(`enumeration/basic/${type}`))
  );
  const enumMap = _.zipObject(types, enums);
  return enumMap;
}

async function getEnumData(url) {
  const res = await got(url, {
    prefixUrl: API_V1,
    responseType: 'json'
  });
  if (res.statusCode !== 200) {
    throw Error('Unable to get data from: ' + url);
  }
  return res.body;
}

async function getEnumTypeDefs() {
  //get map of enums from API
  const enums = await loadEnums();
  
  //map enums to schema definitions
  const schemas = Object.keys(enums).map(enumType => {
    const list = enums[enumType].reduce( (accumulator, currentValue) => accumulator += currentValue + '\n', '');
    return `
      enum ${enumType} {
      ` + 
        list + `}
      `
  });
  const schema = schemas.reduce( (acc, curr) => acc + curr, '');
  return schema;
}

module.exports = {
  getEnumTypeDefs
};