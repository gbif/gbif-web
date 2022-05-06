/**
 * get app configuration
 * cli arguments take priority, then comes .env file, then default values.
 */
const _ = require('lodash');
const commandLineArgs = require('command-line-args');
const YAML = require('yaml')
const fs = require('fs');
const file = fs.readFileSync(__dirname + '/../.env', 'utf8')
const env = YAML.parse(file);

const cliOptions = [
  { name: 'port', alias: 'p', type: Number }
];
const options = commandLineArgs(cliOptions);

const config = _.merge(
  env,
  options
);

module.exports = config;