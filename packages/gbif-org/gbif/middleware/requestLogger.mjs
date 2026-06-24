// requestLogger.mjs
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger.mjs';

// List of URLs to exclude from logging (similar to portal16's excludeList)
const excludeList = [
  '/api/resource/search?contentType=dataUse&cachebust',
  '/api/health',
  '/favicon.ico',
  '/robots.txt',
];

// Middleware to add request ID and logging
export function requestLogger(req, res, next) {
  // Generate request ID
  const reqId = `gbif-web-${uuidv4()}`;

  // Add request ID to request object
  req.reqId = reqId;

  // Add request ID to response headers
  res.set('x-request-id', reqId);

  // Check if this request should be excluded from logging
  const shouldExclude = excludeList.some((excludePath) => req.originalUrl.startsWith(excludePath));

  if (shouldExclude) {
    return next();
  }

  // Log request start
  const startTime = Date.now();

  logger.info(
    {
      request: {
        method: req.method,
        url: req.url,
        originalUrl: req.originalUrl,
        ip: req.ip,
        referrer: req.get('Referrer'),
        userAgent: req.get('User-Agent'),
      },
      requestId: reqId,
      request_start: true,
    },
    `Request start: ${req.method} ${req.originalUrl}`
  );

  // Capture the original end function
  const originalEnd = res.end;

  // Override res.end to log when request finishes
  res.end = function (chunk, encoding) {
    const duration = Date.now() - startTime;

    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    logger[logLevel](
      {
        request: {
          method: req.method,
          url: req.url,
          originalUrl: req.originalUrl,
          ip: req.ip,
          referrer: req.get('Referrer'),
          userAgent: req.get('User-Agent'),
        },
        requestId: reqId,
        durationMs: duration,
        request_finish: true,
        response: {
          statusCode: res.statusCode,
          cacheControl: res.get('Cache-Control'),
        },
      },
      `Request finish: ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
    );

    // Call the original end function
    originalEnd.call(this, chunk, encoding);
  };

  next();
}

export default requestLogger;
