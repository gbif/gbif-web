const { normalizeGetQuery } = require('../../queryAdapter/normalizeGetQuery');
const { normalizeGetConfig } = require('./literature.config');

module.exports = query => normalizeGetQuery(query, normalizeGetConfig);