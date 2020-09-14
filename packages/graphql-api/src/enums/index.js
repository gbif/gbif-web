// Load all enumerations from the GBIF API. http://api.gbif.org/v1/enumeration/basic
// e.g. http://api.gbif.org/v1/enumeration/basic/BasisOfRecord
const fs = require('fs').promises;
const got = require('got');
const _ = require('lodash');
const config = require('../config');
const API_V1 = config.API_V1;

async function loadEnums(fileName) {
  const types = await getEnumData('enumeration/basic')
  const enums = await Promise.all(
    types.map(type => getEnumData(`enumeration/basic/${type}`))
  );
  const enumMap = _.zipObject(types, enums);
  return fs.writeFile(`${__dirname}/${fileName}`, JSON.stringify(enumMap, null, 2));
}

async function getLatestInterpretationRemark(){
  // Discretely write latest interpretationRemark
  try {
    const interpretationRemarkLatest = await getEnumData('enumeration/interpretationRemark')
    await fs.writeFile(`${__dirname}/interpretationRemark_latest.json`, JSON.stringify(interpretationRemarkLatest, null, 2));
   } catch(error){
     console.log("Failed to fetch latest interpretationRemark from API:")
     console.log(error)
   } 
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

async function writeLatestEnums() {
  try {
    await loadEnums('enums_latest.json');
    console.log("Latest version Enums written to 'enums_latest.json'")
    await getLatestInterpretationRemark();
    console.log("Latest version of interpretationRemark written to 'interpretationRemark_latest.json'")
  } catch(error){
    console.log("Failed to fetch Enums from API: ");
    console.log(error)
  }
}

async function getEnumTypeDefs() {
  //Load enums from file - if the file is not there, get map of enums from API first
  let enums;
  try {
    enums = require('./enums.json');
    writeLatestEnums()
  } catch(err){
    try {
      await loadEnums('enums.json');
      console.log("Enums written to file from API")
      return getEnumTypeDefs()
    } catch(error){
      console.log("Failed to fetch Enums from API: ");
      console.log(error)
    }
  }  
  //map enums to schema definitions
  const schemas = Object.keys(enums).map(enumType => {
    const list = enums[enumType].reduce( (accumulator, currentValue) => accumulator += currentValue + '\n', '');
    return `
      enum ${enumType.replace(/\./g, '_')} {
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