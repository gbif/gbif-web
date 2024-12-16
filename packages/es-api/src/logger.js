const winston = require('winston');
const config = require('./config');

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: {
    class: 'web',
    service: 'es-api',
    environment: config.environment,
  },
  transports: [
    new winston.transports.Console({
      level: config.debug ? 'debug' : 'info',
    }),
  ],
});

module.exports = logger;
