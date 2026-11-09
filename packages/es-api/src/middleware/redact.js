// Keep API keys out of logs, even when a client sends one where it is not accepted.
const REDACTED = '[REDACTED]';

function redactUrl(url) {
  if (typeof url !== 'string') return url;
  return url.replace(/([?&]apiKey=)[^&#]*/gi, `$1${REDACTED}`);
}

function redactBody(body) {
  if (body && typeof body === 'object' && !Array.isArray(body) && 'apiKey' in body) {
    return { ...body, apiKey: REDACTED };
  }
  return body;
}

function redactedRequest(req) {
  return {
    method: req.method,
    url: redactUrl(req.url),
    originalUrl: redactUrl(req.originalUrl),
    ip: req.ip,
    referrer: req.get('Referrer'),
    userAgent: req.get('User-Agent'),
    body: redactBody(req.body),
  };
}

module.exports = { redactUrl, redactBody, redactedRequest };
