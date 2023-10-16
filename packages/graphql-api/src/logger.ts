import winston from 'winston';
import config from './config';

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: {
    'class': 'web',
    'service': 'graphql',
    // TODO: Add enviroment to log prod|staging|uat|dev is this info available or should i add it to config?
    'environment': 'dev',
  },
  transports: [
    new winston.transports.Console({
      level: config.debug ? 'debug' : 'info',
    })
  ]
});

export default logger;