/**
 * Given an ES endpoint, then try to extract a sensible graphql type given its mappings.
 * It is not intended to be used blindly, but as a starting point.
 */
const axios = require('axios');
const _ = require('lodash');

async function suggestGqlTypeFromAlias({ endpoint, alias, type }) {
  const aliasResponse = await axios.get(`${endpoint}/${alias}/_alias`);
  const index = Object.keys(aliasResponse.data)[0];
  return suggestGqlTypeFromIndex({ endpoint, index, type });
}

async function suggestGqlTypeFromIndex({ endpoint, index, type }) {
  const mappingResponse = await axios.get(`${endpoint}/${index}/_mapping`);
  const mapping = mappingResponse.data[index].mappings[type];
  const config = mapping2type(mapping);

  printType('Occurrence', config);

  return config;
}

function typeCase(s) {
  let str = _.camelCase(s);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function printType(name, fields) {
  let backlog = [];
  let str = `type ${typeCase(name)} {`;
  fields.forEach((x) => {
    if (x.type !== 'NEW_TYPE') str += `\n  ${x.fieldName}: ${x.type}`;
    else {
      backlog.push({ name: typeCase(x.name), fields: x.fields });
      str += `\n  ${x.name}: ${typeCase(x.name)}`;
    }
  });
  str += `\n}\n`;
  console.log(str);

  backlog.forEach((type) => {
    printType(type.name, type.fields);
  });
}

function mapping2type(mapping, prefix) {
  //process them
  const fieldConfigs = Object.keys(mapping.properties).map((field) => {
    const fieldConfig = mapping.properties[field];

    switch (fieldConfig.type) {
      case 'text':
        return {
          fieldName: field,
          type: 'String',
        };
      case 'date':
        return {
          fieldName: field,
          type: 'Date',
        };
      case 'integer':
        return {
          fieldName: field,
          type: 'Int',
        };
      case 'double':
        return {
          fieldName: field,
          type: 'Float',
        };
      case 'short':
        return {
          fieldName: field,
          type: 'Float',
        };
      case 'float':
        return {
          fieldName: field,
          type: 'Float',
        };
      case 'long':
        return {
          fieldName: field,
          type: 'Integer',
        };
      case 'keyword':
        return {
          fieldName: field,
          type: 'String',
        };
      case 'boolean':
        return {
          fieldName: field,
          type: 'Boolean',
        };
      case 'geo_shape':
        return {
          fieldName: field,
          type: 'String',
        };
      case 'nested':
        return {
          fieldName: field,
          type: 'JSON',
        };
      default: {
        if (typeof fieldConfig.type === 'undefined' && _.isObject(fieldConfig.properties)) {
          // it is a deep property and should be a seperate type
          return {
            type: 'NEW_TYPE',
            name: field,
            fields: mapping2type(fieldConfig, field),
          };
        } else {
          return {
            field,
            discarded: true,
          };
        }
      }
    }
  });

  //mutate array by deleting discarded
  const options = fieldConfigs.filter((x) => !x.discarded);

  return options;
}

module.exports = {
  suggestGqlTypeFromAlias,
  suggestGqlTypeFromIndex,
  mapping2type,
};
