const _ = require('lodash');

function match(value, config) {
  return {
    'match': {
      [config.field]: {
        'query': value
      }
    }
  }
}

function term(value, config) {
  return { 
    'term': { 
      [config.field]: value 
    } 
  }
}

function terms(value, config) {
  return {
    'terms': {
      [config.field]: value
    }
  }
}

function term_s(value, config) {
  return Array.isArray(value) ? terms(value, config) : term(value, config);
}

function range(value, config) {
  return {
    'range': {
      [config.field]: value
    }
  }
}

function range_or_term(value, config) {
  return _.isObjectLike(value) ? range(value, config) : term(value, config);
}

module.exports = {
  term,
  terms,
  term_s,
  range,
  range_or_term,
  match
}