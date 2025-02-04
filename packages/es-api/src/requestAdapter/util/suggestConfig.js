/**
 * Given an ES endpoint, then try to extract a sensible configuration given its mappings.
 * It is not intended to be used blindly, but as a starting point.
 */
const util = require('util');
const axios = require('axios');
const _ = require('lodash');

async function suggestConfigFromAlias({ endpoint, alias, type }) {
  const aliasResponse = await axios.get(`${endpoint}/${alias}/_alias`);
  const index = Object.keys(aliasResponse.data)[0];
  return suggestConfigFromIndex({ endpoint, index, type });
}

async function suggestConfigFromIndex({ endpoint, index, type }) {
  const mappingResponse = await axios.get(`${endpoint}/${index}/_mapping`);
  const mapping = mappingResponse.data[index].mappings;
  const config = mapping2searchConfig(mapping);
  console.log(util.inspect(config, { compact: false, depth: 10, sort: true }));
  return config;
}

function mapping2searchConfig(mapping, prefix) {
  //process them
  const fieldConfigs = Object.keys(mapping.properties).map((field) => {
    const fieldConfig = mapping.properties[field];
    // const get any sub fields of type completion
    let suggestConf;
    if (_.isPlainObject(fieldConfig.fields)) {
      suggestConf = Object.keys(fieldConfig.fields)
        .map((field) => ({ ...fieldConfig.fields[field], _field: field }))
        .find((x) => x.type === 'completion');
    }
    switch (fieldConfig.type) {
      case 'text':
        return {
          type: 'text',
          field,
          get: {
            type: 'fuzzy',
          },
          ...(suggestConf && { suggestField: `${field}.${suggestConf._field}` }),
        };
      case 'date':
        return {
          type: 'date',
          field,
          get: {
            type: 'range_or_term',
            defaultUpperBound: 'gte',
            defaultLowerBound: 'lte',
          },
        };
      case 'integer':
        return {
          type: 'numeric',
          field,
          get: {
            type: 'range_or_term',
            defaultUpperBound: 'gte',
            defaultLowerBound: 'lte',
          },
        };
      case 'double':
        return {
          type: 'numeric',
          field,
          get: {
            type: 'range_or_term',
            defaultUpperBound: 'gte',
            defaultLowerBound: 'lte',
          },
        };
      case 'short':
        return {
          type: 'numeric',
          field,
          get: {
            type: 'range_or_term',
            defaultUpperBound: 'gte',
            defaultLowerBound: 'lte',
          },
        };
      case 'float':
        return {
          type: 'numeric',
          field,
          get: {
            type: 'range_or_term',
            defaultUpperBound: 'gte',
            defaultLowerBound: 'lte',
          },
        };
      case 'long':
        return {
          type: 'numeric',
          field,
          get: {
            type: 'range_or_term',
            defaultUpperBound: 'gte',
            defaultLowerBound: 'lte',
          },
        };
      case 'keyword':
        return {
          type: 'keyword',
          field,
          ...(suggestConf && { suggestField: `${field}.${suggestConf._field}` }),
        };
      case 'boolean':
        return {
          type: 'boolean',
          field,
        };
      case 'geo_shape':
        return {
          type: 'geo_shape',
          field,
          get: {
            type: 'within',
          },
        };
      case 'nested': {
        if (!fieldConfig.properties || fieldConfig.enabled === false) {
          return {
            field,
            discarded: true,
          };
        }
        const keys = Object.keys(fieldConfig.properties);
        const isAllKeywords = !keys.includes(
          (key) => fieldConfig.properties[key].type !== 'keyword',
        );
        return {
          type: 'nested',
          field,
          config: mapping2searchConfig(fieldConfig, field),
          ...(isAllKeywords && {
            get: {
              type: 'delimted',
              delimter: '__',
              termOrder: keys,
            },
          }),
        };
      }
      default: {
        if (typeof fieldConfig.type === 'undefined' && _.isObject(fieldConfig.properties)) {
          // it is a deep property, but not a nested one. It can be accesed simply by
          // joining with dots: `parent.child`.
          // const subConfig = mapping2searchConfig(fieldConfig, field);
          // // flatten by appending prefix to keys
          // Object.keys(subConfig.options).forEach(k => {
          //   subConfig.options[`${field}.${k}`] = subConfig.options[k];
          //   delete subConfig.options[k];
          // });
          // delete subConfig.prefix;
          return {
            type: 'flatten',
            field,
            config: mapping2searchConfig(fieldConfig, field),
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

  //flatten deep properties
  // Object.keys(options).forEach(k => {
  //   if (k.type === 'flatten') {

  //   }
  // });

  //to map
  const [flattened, other] = _.partition(fieldConfigs, (x) => x.type === 'flatten');
  const optionsMap = _.keyBy(other, 'field');

  flattened.forEach((x) => {
    Object.keys(x.config.options).forEach((k) => {
      const option = x.config.options[k];
      optionsMap[`${x.config.prefix}_${option.field.replace('.', '_')}`] = {
        ...option,
        field: `${x.config.prefix}.${option.field}`,
      };
    });
  });

  optionsMap;
  return {
    ...(prefix && { prefix }),
    options: optionsMap,
  };
}

module.exports = {
  suggestConfigFromAlias,
  suggestConfigFromIndex,
  mapping2searchConfig,
};
