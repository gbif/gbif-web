/**
 * get app configuration
 * cli arguments take priority, then comes .env file, then default values.
 */
const _ = require('lodash');
const env = require('dotenv').config();
const commandLineArgs = require('command-line-args');

const cliOptions = [
  { name: 'port', alias: 'p', type: Number },
  { name: 'API_V1', alias: 'a', type: String },
  { name: 'API_ES', alias: 'e', type: String },
  { name: 'API_ES_KEY', alias: 'c', type: String },
  { name: 'APP_KEY', alias: 'k', type: String },
  { name: 'APP_SECRET', alias: 's', type: String },
];
const options = commandLineArgs(cliOptions);

const defaultConfig = {
  port: 4000,
  API_V1: 'https://api.gbif.org/v1',
  API_ES: 'http://labs.gbif.org:7019',
  API_ES_KEY: 'SHOULD_NOT_BE_IN_CODE',
  APP_KEY: 'SHOULD_NOT_BE_IN_CODE',
  APP_SECRET: 'IT_IS_A_SECRET_AND_SHOULD_NOT_BE_IN_CODE',
};

const config = _.merge(
  defaultConfig,
  env.parsed,
  options
);

module.exports = config;