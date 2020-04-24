/**
 * get app configuration
 * cli arguments take priority, then comes .env file, then default values.
 */
const _ = require('lodash');
const env = require('dotenv').config();
const commandLineArgs = require('command-line-args');

const cliOptions = [
  { name: 'port', alias: 'p', type: Number },
  { name: 'LITERATURE_ES_ENDPOINT', alias: 'a', type: String }
];
const options = commandLineArgs(cliOptions);

const defaultConfig = {
  port: 4000,
  LITERATURE_ES_INDEX: 'http://cms-search.gbif.org:9200/literature'
};

const config = _.merge(
  defaultConfig,
  env.parsed,
  options
);

module.exports = config;