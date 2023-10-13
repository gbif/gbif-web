import winston from 'winston';
import config from './config';
import { ElasticsearchTransport } from 'winston-elasticsearch'

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: {
    'class': 'web',
    'service': 'graphql',
    // TODO: Add enviroment to log prod|staging|uat|dev
    'environment': 'dev',
  },
  transports: [
    new winston.transports.Console({
      level: config.debug ? 'debug' : 'info',
    })
  ]
});

console.log(process.env.NODE_ENV);

// if (process.env.NODE_ENV === 'production') {
//   logger.add(new ElasticsearchTransport({
//     clientOpts: {
//       node: 'https://private-logstash.gbif.org'
//     }
//   }));
// }

export default logger;