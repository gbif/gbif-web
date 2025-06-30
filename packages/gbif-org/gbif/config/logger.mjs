// logger.mjs
import ecsFormat from '@elastic/ecs-winston-format';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Get environment and service information
const env = process.env.NODE_ENV || 'local';
const serviceName = 'gbif-web';
const serviceClass = 'web';

// Define log directory
const logDir = 'logs';

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
  info.environment = env;
  info.service = serviceName;
  info.class = serviceClass;
  return info;
});

// --- Configure the DailyRotateFile Transport for File Logging ---
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

// Optional: Listen for rotation events
fileRotateTransport.on('rotate', (oldFilename, newFilename) => {
  console.log(`Log file rotated: ${oldFilename} -> ${newFilename}`);
});
fileRotateTransport.on('new', (newFilename) => {
  console.log(`New log file created: ${newFilename}`);
});
fileRotateTransport.on('archive', (zipFilename) => {
  console.log(`Log file archived: ${zipFilename}`);
});
fileRotateTransport.on('logRemoved', (removedFilename) => {
  console.log(`Old log file removed: ${removedFilename}`);
});

// --- Configure the Console Transport for Development ---
const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  handleExceptions: true,
  handleRejections: true,
  format: winston.format.combine(addFixedFields(), winston.format.timestamp(), colorizedJsonFormat),
});

// --- Create the Winston Logger instance ---
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
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
logger.info({ message: 'initialising log' }, 'initialising log');

// Helper methods for structured logging
logger.logRequest = (req, res, meta = {}) => {
  logger.info(
    {
      req_url: req.originalUrl,
      method: req.method,
      user_agent: req.get('User-Agent'),
      ip: req.ip,
      status_code: res.statusCode,
      ...meta,
    },
    `${req.method} ${req.originalUrl} - ${res.statusCode}`
  );
};

logger.logError = (error, meta = {}) => {
  logger.error(
    {
      error: error,
      error_message: error.message,
      error_stack: error.stack,
      ...meta,
    },
    error.message || 'An error occurred'
  );
};

logger.logWithMeta = (level, message, meta = {}) => {
  logger[level]({ ...meta }, message);
};

export default logger;
