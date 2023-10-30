import winston from 'winston';
import config from './config';

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: {
    'class': 'web',
    'service': 'graphql',
    'environment': config.environment,
  },
  transports: [
    new winston.transports.Console({
      level: config.debug ? 'debug' : 'info',
    })
  ]
});

export default logger;