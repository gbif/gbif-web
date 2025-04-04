/**
 * get app configuration
 * cli arguments take priority, then comes .env file, then default values.
 */
import commandLineArgs from 'command-line-args';
import fs from 'fs';
import { merge } from 'lodash';
import YAML from 'yaml';

const file = fs.readFileSync(`${__dirname}/../.env`, 'utf8');
const env = YAML.parse(file);

const cliOptions = [
  { name: 'port', alias: 'p', type: Number },
  { name: 'debug', type: Boolean, defaultOption: false },
  { name: 'environment', type: String },
  { name: 'apiEs', type: String },
  // ts-mocha requires this for the --paths option to work
  { name: 'require', alias: 'r', type: String, multiple: true },
];
const options = commandLineArgs(cliOptions, { partial: true });

const config = merge({ debug: false, environment: 'dev' }, env, options);

export default config;
