'use strict';

const _ = require('lodash');
const { ResponseError } = require('../../resources/errorHandler');

// Name of the reverse_nested sub-aggregation added to nested facet buckets so we can
// report parent-document (e.g. occurrence) counts rather than nested-document counts.
// The response adapter uses the same key to read those counts back out.
const REVERSE_NESTED_AGG_KEY = 'reverseNested';

function metric2aggs(metrics = {}, config) {
  const aggs = {};
  for (const [name, metric] of Object.entries(metrics)) {
    // Aggregating on a field inside a nested object, addressed with dot-notation as
    // "<nestedKey>.<childKey>" (e.g. nucleotideSequence.targetGene). We wrap the inner
    // aggregation in an ES `nested` aggregation and re-key it by `name` so the response
    // adapter unwraps it the same way it unwraps child/join aggregations.
    if (typeof metric.key === 'string' && metric.key.includes('.')) {
      const separatorIndex = metric.key.indexOf('.');
      const parentKey = metric.key.slice(0, separatorIndex);
      const childKey = metric.key.slice(separatorIndex + 1);
      const parentConf = _.get(config, `options[${parentKey}]`);
      if (parentConf && parentConf.type === 'nested') {
        const innerAggs = metric2aggs(
          { [name]: { ...metric, key: childKey } },
          prefixNestedConfig(parentConf),
        );
        // For term facets the bucket doc_count counts nested documents (e.g. individual
        // sequences). Add a reverse_nested sub-aggregation so the response adapter can
        // report the number of matching parent documents (occurrences) instead.
        if (metric.type === 'facet' && innerAggs[name] && innerAggs[name].terms) {
          innerAggs[name].aggs = {
            ...(innerAggs[name].aggs || {}),
            [REVERSE_NESTED_AGG_KEY]: { reverse_nested: {} },
          };
        }
        aggs[name] = {
          nested: { path: parentConf.field },
          aggs: innerAggs,
        };
        continue;
      }
    }

    const conf = _.get(config, `options[${metric.key}]`);
    if (metric.type !== 'multifacet' && !conf) continue;
    else {
      if (config?.options?.[metric.key]?.join) {
        aggs[name] = {
          children: {
            type: config?.options?.[metric.key]?.join,
          },
          aggs: metric2aggs({ [name]: metric }, config.options[metric.key].config),
        };
        continue;
      }
      const from = parseInt(metric.from || 0, 10);
      const size = parseInt(metric.size || 10, 10) || 10;
      const aggSize = size + from;

      const field = getTemplatedField({
        field: conf.displayField ?? conf.field,
        variables: metric,
        defaultTemplateKeys: conf.defaultTemplateKeys,
      });

      switch (metric.type) {
        case 'facet': {
          if (!['keyword', 'numeric', 'boolean'].includes(conf.type)) {
            throw new ResponseError(
              400,
              'badRequest',
              'Facets are only supported on keywords, boolean and numeric fields',
            );
          }

          let order;
          if (metric.order) {
            if (metric.order === 'TERM_ASC') {
              order = { _term: 'asc' };
            }
          }

          const aggName = {
            terms: {
              field: field,
              size: aggSize,
              include: metric.include,
              shard_size: aggSize * 2 + 50000,
            },
          };
          if (order) {
            aggName.terms.order = order;
          }
          aggs[name] = aggName;

          break;
        }
        case 'multifacet': {
          metric.keys.forEach((key) => {
            const metricConf = _.get(config, `options[${key}]`);
            if (!['keyword', 'numeric', 'boolean'].includes(metricConf.type)) {
              throw new ResponseError(
                400,
                'badRequest',
                'Facets are only supported on keywords, boolean and numeric fields',
              );
            }
          });

          let order;
          if (metric.order) {
            if (metric.order === 'TERM_ASC') {
              order = { _term: 'asc' };
            }
          }

          const terms = [];
          metric.keys.forEach((key) => {
            const metricConf = _.get(config, `options[${key}]`);
            const field = getTemplatedField({
              field: metricConf.displayField ?? metricConf.field,
              variables: metric,
              defaultTemplateKeys: metricConf.defaultTemplateKeys,
            });
            terms.push({
              field: field,
            });
          });

          const aggName = { multi_terms: { terms, size: size + from } };
          if (order) {
            aggName.terms.order = order;
          }
          aggs[name] = aggName;

          break;
        }
        case 'stats': {
          if (conf.type !== 'numeric')
            throw new ResponseError(
              400,
              'badRequest',
              'Only numeric fields support this aggregation',
            );
          aggs[name] = {
            stats: {
              field: field,
            },
          };
          break;
        }
        case 'histogram': {
          if (conf.type !== 'numeric')
            throw new ResponseError(
              400,
              'badRequest',
              'Only numeric fields support this aggregation',
            );
          aggs[name] = {
            histogram: {
              field: field,
              interval: metric.interval || 45,
            },
          };
          break;
        }
        case 'auto_date_histogram': {
          if (conf.type !== 'date')
            throw new ResponseError(400, 'badRequest', 'Only date fields support this aggregation');
          aggs[name] = {
            auto_date_histogram: {
              field: field,
              buckets: metric.buckets || 10,
              minimum_interval: metric.minimum_interval,
            },
          };
          break;
        }
        case 'date_histogram': {
          if (conf.type !== 'date')
            throw new ResponseError(400, 'badRequest', 'Only date fields support this aggregation');
          aggs[name] = {
            date_histogram: {
              field: field,
              calendar_interval: metric.calendarInterval || '1M',
            },
          };
          break;
        }
        case 'cardinality': {
          if (!['keyword', 'numeric', 'boolean'].includes(conf.type))
            throw new ResponseError(
              400,
              'badRequest',
              'Facets are only supported on keywords, boolean and numeric fields',
            );
          aggs[name] = {
            cardinality: {
              field: field,
              precision_threshold: metric.precision_threshold || 10000,
            },
          };
          break;
        }
        default: {
          // ignore unknown types
          break;
        }
      }
      if (aggs[name] && metric.metrics) {
        const subAggregations = metric2aggs(metric.metrics, config);
        aggs[name].aggs = subAggregations;
      }
    }
  }
  return aggs;
}

module.exports = {
  metric2aggs,
  REVERSE_NESTED_AGG_KEY,
};

// Build a config for the children of a nested object where each child field is fully
// qualified with the nested object's prefix (e.g. `targetGene.concept` ->
// `nucleotideSequence.targetGene.concept`). ES requires the root-relative path even
// inside a `nested` aggregation, and metric2aggs reads `conf.field` verbatim.
function prefixNestedConfig(nestedConf) {
  const { prefix, options } = nestedConf.config;
  const prefixedOptions = {};
  for (const [key, option] of Object.entries(options)) {
    prefixedOptions[key] = {
      ...option,
      field: `${prefix}.${option.field}`,
      ...(option.displayField ? { displayField: `${prefix}.${option.displayField}` } : {}),
    };
  }
  return { options: prefixedOptions };
}

function getTemplatedField({ field, variables, defaultTemplateKeys }) {
  if (defaultTemplateKeys) {
    // replace template keys
    Object.keys(defaultTemplateKeys).forEach((key) => {
      field = field.replace(
        `{${key}}`,
        variables[key] ?? defaultTemplateKeys?.[key] ?? 'NO_TEMPLATE_VALUE_PROVIDED',
      );
    });
  }
  return field;
}
