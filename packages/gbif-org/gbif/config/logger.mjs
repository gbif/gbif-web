import ecsFormat from '@elastic/ecs-winston-format';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { secretEnv } from '../envConfig.mjs';

// Get environment and service information
const env = secretEnv.NODE_ENV || 'local';
const serviceName = 'gbif-web';
const serviceClass = 'web';
const levels = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};
const debugLevel = levels[secretEnv.DEBUG_LEVEL] ?? 'warn';

// Define log directory
const logDir = secretEnv.LOGS_DIRECTORY ?? 'logs';

// Color codes for manual coloring
const colors = {
  error: '\x1b[31m', // red
  warn: '\x1b[33m', // yellow
  info: '\x1b[36m', // cyan
  debug: '\x1b[32m', // green
  reset: '\x1b[0m', // reset
};

// Custom format for colorized JSON
const colorizedJsonFormat = winston.format.printf((info) => {
  const { level, message, timestamp, ...meta } = info;
  const color = colors[level] || colors.reset;

  // Create the log object
  const logObj = {
    level,
    message,
    timestamp,
    ...meta,
  };

  let jsonString = JSON.stringify(logObj, null, 0);

  // Colorize the level field in the JSON
  if (color) {
    jsonString = `${color}${jsonString}${colors.reset}`;
  }

  return jsonString;
});

// Custom format to add fixed fields (service, environment, class)
const addFixedFields = winston.format((info) => {
  return {
    ...info,
    environment: env,
    service: serviceName,
    class: serviceClass,
  };
});

// Configure the DailyRotateFile Transport for File Logging
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
  handleExceptions: true,
  handleRejections: true,
  format: winston.format.combine(
    addFixedFields(),
    winston.format.timestamp(),
    ecsFormat({ convertReqRes: true })
  ),
});

const level = debugLevel;
console.log(`Logger level set to: ${level}`);

// Configure the Console Transport for Development
const consoleTransport = new winston.transports.Console({
  level,
  handleExceptions: true,
  handleRejections: true,
  format: winston.format.combine(addFixedFields(), winston.format.timestamp(), colorizedJsonFormat),
});

// Create the Winston Logger instance
const logger = winston.createLogger({
  level,
  transports: [
    fileRotateTransport,
    // Always include console transport, but adjust level based on environment
    consoleTransport,
  ],
  exitOnError: false,
});

// Handle logger errors
logger.on('error', (err) => {
  console.error('Logging failed:', err);
});

// Log initialization message like portal16 did
logger.info('initialising log', { message: 'initialising log' });

logger.logError = (error, meta = {}) => {
  logger.error(error.message || 'An error occurred', {
    error,
    error_message: error.message,
    error_stack: error.stack,
    ...meta,
  });
};

export default logger;
