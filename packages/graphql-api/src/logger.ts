import winston from 'winston';
import LogstashTransport from './logstashTransporter';
// import config from './config';

const host = 'private-logstash.gbif.org';
const port = 1065;

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: {
    // class: 'web',
    // service: 'graphql',
    // environment: 'dev', // config.environment,
    environment: 'dev',
    class: 'web',
    service: 'portal',
  },
  transports: [
    new winston.transports.Console({
      level: 'info', // config.debug ? 'debug' : 'warning',
    }),
    new LogstashTransport({
      host,
      port,
    }),
  ],
});

export default logger;
