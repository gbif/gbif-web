import build from './scripts/build.js';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import _ from 'lodash';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = JSON.parse(readFileSync(join(__dirname, '../.env.json'), 'utf8'));

const locales = env.LOCALES;

build(locales);
