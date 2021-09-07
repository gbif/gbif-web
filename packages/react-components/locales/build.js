const env = require('../.env.json');
const locales = env.LOCALES;
const build = require('./scripts/build');

build(locales);