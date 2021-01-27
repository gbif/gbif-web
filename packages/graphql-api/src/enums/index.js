// Load all enumerations from the GBIF API. http://api.gbif.org/v1/enumeration/basic
// e.g. http://api.gbif.org/v1/enumeration/basic/BasisOfRecord
const fs = require('fs').promises;
const got = require('got');
const _ = require('lodash');
const config = require('../config');
const { gql } = require("apollo-server");
const API_V1 = config.apiv1;

async function loadEnums() {
  const types = await getEnumData('enumeration/basic')
  const enums = await Promise.all(
    types.map(type => getEnumData(`enumeration/basic/${type}`))
  );
  const enumMap = _.zipObject(types, enums);
  return enumMap;
  // return fs.writeFile(`${__dirname}/${fileName}`, JSON.stringify(enumMap, null, 2));
}

/* 
async function getLatestInterpretationRemark(){
  // Discretely write latest interpretationRemark
  try {
    const interpretationRemarkLatest = await getEnumData('enumeration/interpretationRemark')
    await fs.writeFile(`${__dirname}/interpretationRemark.json`, JSON.stringify(interpretationRemarkLatest, null, 2));
   } catch(error){
     console.log("Failed to fetch latest interpretationRemark from API:")
     console.log(error)
   } 
}
 */

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

async function writeEnums(enumMap) {
  try {
    const prevVersionEnums = JSON.stringify(require('./enums.json'), null, 2);
    const currentVersionEnums = JSON.stringify(enumMap, null, 2);
    if(prevVersionEnums !== currentVersionEnums){
      console.log("New version of ENUMS detected and validated, writing to enums.json")
      return fs.writeFile(`${__dirname}/enums.json`, currentVersionEnums);
    } else {
      console.log("No changes in ENUMS")
      return Promise.resolve();
    }    
  } catch(error){
    console.log("Failed to write Enums.");
    console.log(error)
  }
}


const schemaIsValid = (enumsSchema) => {
  try {
    gql`
      ${enumsSchema}

      type Query {
        """
        _empty is nonsense, and only here as we are not allowed to extend an empty type.
        """
        _empty: String
      }
    `;
    return {valid: true, error: null};
  } catch (err) {
    return {valid: false, error: err};
  }
};

const getSchema = enums => {
  const schemas = Object.keys(enums).map(enumType => {
    const list = enums[enumType].reduce( (accumulator, currentValue) => accumulator += currentValue + '\n', '');
    // enumType.replace(/\./g, '_')
    return `
      enum ${enumType.replace(/\./g, '_')} {
      ` + 
        list + `}
      `
  });
  return schemas.reduce( (acc, curr) => acc + curr, '');
}

async function getEnumTypeDefs() {
  // Should we fetch interpretationRemark also? 
  // getLatestInterpretationRemark();
  // Load enums from file - if the file is not there, get map of enums from API first
  let enums;
  try {
    enums = await loadEnums() //require('./enums.json');
     //writeLatestEnums()
  } catch(err){
    enums = require('./enums.json');
    console.log("Failed to fetch Enums from API. Using fallback enums.json");
    console.log(err)
  }  
  let schema = getSchema(enums)
  const validationResult = schemaIsValid(schema);
  if(validationResult.valid){
    // GraphQL is happy about the enum schema - write it to enums.json and return
    writeEnums(enums) 
    return schema;
  } else {
    // GraphQL is sad about the enum schema - fetch the backup from last successful attempt
    console.log("ENUM schema validation failed:")
    console.log(validationResult.error)
    console.log("Using fallback enums.json.")
    enums = require('./enums.json');
    return getSchema(enums);
  }
}


module.exports = {
  getEnumTypeDefs
};