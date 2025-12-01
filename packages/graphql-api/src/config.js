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
  { name: 'origin', type: String },
  { name: 'translations', type: String },
  // ts-mocha requires this for the --paths option to work
  { name: 'require', alias: 'r', type: String, multiple: true },
];
const options = commandLineArgs(cliOptions, { partial: true });

const processEnv = {
  port: process.env.PORT ? Number(process.env.PORT) : undefined,
  apiEs: process.env.apiEs,
  origin: process.env.origin,
  translations: process.env.translations,
};

const config = merge(
  { debug: false, environment: 'dev' },
  env,
  processEnv,
  options,
);

export default config;
