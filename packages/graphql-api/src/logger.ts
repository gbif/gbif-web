import ecsFormat from '@elastic/ecs-winston-format';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from './config';
import { getRequestLogContext } from './requestContext';

// Get environment and service information
const env = process.env.NODE_ENV || 'local';
const serviceName = 'graphql-api';
const serviceClass = 'web';
const levels = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};
const debugLevel = levels[config.debugLevel as keyof typeof levels] ?? 'warn';

// Define log directory
const logDir = process.env.LOGS_DIRECTORY ?? 'logs';

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
  const color = colors[level as keyof typeof colors] || colors.reset;

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

// Merge request-scoped fields (siteUrl, requestId) into every log line for the request.
const addRequestContext = winston.format((info) => {
  const requestContext = getRequestLogContext();
  if (!requestContext) return info;
  const fields: Record<string, unknown> = {};
  if (requestContext.requestId) fields.requestId = requestContext.requestId;
  if (requestContext.siteUrl) fields.siteUrl = requestContext.siteUrl;
  return { ...info, ...fields };
});

const level = debugLevel;
console.log(`Logger level set to: ${level}`);

// Configure the DailyRotateFile Transport for File Logging
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  // maxSize: '20m', // Disabled: size-based rotation appends .1, .2 suffixes to the end of filenames which breaks our log matching
  maxFiles: '14d',
  level,
  handleExceptions: true,
  handleRejections: true,
  format: winston.format.combine(
    addFixedFields(),
    addRequestContext(),
    winston.format.timestamp(),
    ecsFormat({ convertReqRes: true }),
  ),
});

// Configure the Console Transport for Development
const consoleTransport = new winston.transports.Console({
  level,
  handleExceptions: true,
  handleRejections: true,
  format: winston.format.combine(
    addFixedFields(),
    addRequestContext(),
    winston.format.timestamp(),
    colorizedJsonFormat,
  ),
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
logger.info('initialising log');

const VALID_LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = typeof VALID_LOG_LEVELS[number];

/** The level the logger (and its transports) is currently emitting at. */
export function getLogLevel(): string {
  return logger.level;
}

/**
 * Change the active log level at runtime (e.g. flip to `debug` to capture an
 * issue, then back to `warn`). Winston's level is mutable, but the transports
 * carry their own `level`, so we set both — otherwise a transport would keep
 * filtering at the old level.
 */
export function setLogLevel(next: string): LogLevel {
  const normalized = String(next).toLowerCase();
  if (!VALID_LOG_LEVELS.includes(normalized as LogLevel)) {
    throw new Error(
      `Invalid log level '${next}'. Expected one of: ${VALID_LOG_LEVELS.join(
        ', ',
      )}.`,
    );
  }
  logger.level = normalized;
  logger.transports.forEach((transport) => {
    // eslint-disable-next-line no-param-reassign
    transport.level = normalized;
  });
  return normalized as LogLevel;
}

export default logger;
