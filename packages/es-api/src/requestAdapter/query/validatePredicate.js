'use strict';
const Joi = require('joi');

// consider splitting the joined alternative schema into one per predicate
// we would then need to iterate over them all and evaluate them all individually.
// doing so would give better feedback messages
const schema = Joi.alternatives().try(
  Joi.object({
    type: Joi.string().valid('and').required(),
    predicates: Joi.array().items(Joi.link('#predicateItem')).required(),
  }),
  Joi.object({
    type: Joi.string().valid('or').required(),
    predicates: Joi.array().items(Joi.link('#predicateItem')).required(),
  }),
  Joi.object({
    type: Joi.string().valid('nested').required(),
    key: Joi.string().required(),
    predicate: Joi.link('#predicateItem'),
    // predicates: Joi.array().items(Joi.link('#predicateItem')),
  }),
  Joi.object({
    type: Joi.string().valid('join').required(),
    key: Joi.string().required(),
    predicate: Joi.link('#predicateItem'),
    // predicates: Joi.array().items(Joi.link('#predicateItem')),
  }),
  Joi.object({
    type: Joi.string().valid('not').required(),
    predicate: Joi.link('#predicateItem'),
  }),
  Joi.object({
    type: Joi.string().valid('geoDistance').required(),
    latitude: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    longitude: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    distance: Joi.string().required(),
  }),
  Joi.object({
    type: Joi.string().valid('equals').required(),
    key: Joi.string().required(),
    value: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.bool()).required(),
  }),
  Joi.object({
    type: Joi.string().valid('within').required(),
    key: Joi.string().required(),
    value: Joi.string().required(),
  }),
  Joi.object({
    type: Joi.string().valid('isNotNull').required(),
    key: Joi.string().required(),
  }),
  Joi.object({
    type: Joi.string().valid('isNull').required(),
    key: Joi.string().required(),
  }),
  Joi.object({
    type: Joi.string().valid('like').required(),
    key: Joi.string().required(),
    value: Joi.string().required(),
  }),
  Joi.object({
    type: Joi.string().valid('fuzzy').required(),
    key: Joi.string().required(),
    value: Joi.string().required(),
  }),
  Joi.object({
    type: Joi.string().valid('in').required(),
    key: Joi.string().required(),
    values: Joi.array().required().items(Joi.alternatives().try(Joi.string(), Joi.number(), Joi.bool())),
  }),
  Joi.object({
    type: Joi.string().valid('range').required(),
    key: Joi.string().required(),
    value: Joi.object({
      gte: Joi.alternatives().try(Joi.string(), Joi.number()),
      gt: Joi.alternatives().try(Joi.string(), Joi.number()),
      lte: Joi.alternatives().try(Joi.string(), Joi.number()),
      lt: Joi.alternatives().try(Joi.string(), Joi.number()),
      relation: Joi.string(),
    }).required()
  })
).id('predicateItem');

// TODO we ought to evaluate all the values by format and content (for enums)
function validatePredicate(predicate, config) {
  //test schema
  const { error } = schema.validate(predicate);
  if (error) return {
    predicate,
    error: {
      message: error.details.map(x => x.message).join(', ')
    }
  }
  //ensure that keys are configured
  try {
    testPredicateKeys(predicate, config);
    return { value: predicate }
  } catch (err) {
    return {
      predicate,
      error: {
        message: err.message
      }
    }
  }
}

function getConfigByKey(key, config) {
  if (!key) return { config: config };
  if (config.options[key]) {
    return {
      config: config.options[key].config || config
    };
  } else {
    return {
      error: new Error(`${key} is not a known field.`)
    }
  }
}

function testPredicateKeys(predicate, conf) {
  const { config, error } = getConfigByKey(predicate.key, conf);
  if (error) throw error;

  if (predicate.predicate) {
    testPredicateKeys(predicate.predicate, config);
  }
  if (predicate.predicates) {
    predicate.predicates.forEach(p => testPredicateKeys(p, config));
  }
}

module.exports = {
  schema,
  validatePredicate
}