const winston = require('winston');
const config = require('./config');

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: {
    'class': 'web',
    'service': 'es-api',
    // TODO: Add enviroment to log prod|staging|uat|dev is this info available or should i add it to config?
    'environment': 'dev',
  },
  transports: [
    new winston.transports.Console({
      level: config.debug ? 'debug' : 'info',
    })
  ]
});

module.exports = logger;