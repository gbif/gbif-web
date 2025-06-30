// requestLogger.mjs
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger.mjs';

// List of URLs to exclude from logging (similar to portal16's excludeList)
const excludeList = [
  '/api/resource/search?contentType=dataUse&cachebust',
  '/api/health',
  '/favicon.ico',
  '/robots.txt'
];

// Middleware to add request ID and logging
export function requestLogger(req, res, next) {
  // Generate request ID
  const reqId = req.get('X-Request-Id') || uuidv4();
  
  // Add request ID to request object
  req.reqId = reqId;
  
  // Add request ID to response headers
  res.set('X-Request-Id', reqId);
  
  // Check if this request should be excluded from logging
  const shouldExclude = excludeList.some(excludePath =>
    req.originalUrl.startsWith(excludePath)
  );
  
  if (shouldExclude) {
    return next();
  }
  
  // Log request start
  const startTime = Date.now();
  
  logger.info({
    req_id: reqId,
    req_url: req.originalUrl,
    method: req.method,
    user_agent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    referrer: req.get('Referrer'),
    request_start: true
  }, `Request start: ${req.method} ${req.originalUrl}`);
  
  // Capture the original end function
  const originalEnd = res.end;
  
  // Override res.end to log when request finishes
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    
    logger.info({
      req_id: reqId,
      req_url: req.originalUrl,
      method: req.method,
      status_code: res.statusCode,
      response_time: duration,
      content_length: res.get('Content-Length'),
      request_finish: true
    }, `Request finish: ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    
    // Call the original end function
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

export default requestLogger;