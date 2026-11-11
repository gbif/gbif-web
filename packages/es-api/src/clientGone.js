/**
 * True when the client has disconnected before we finished responding, e.g. graphql-api gave up on
 * the request or the user navigated away. Work for such a request can stop.
 */
function clientGone(req) {
  const res = req?.res;
  if (!res || res.writableEnded) return false;
  return !!(res.destroyed || req.socket?.destroyed);
}

module.exports = { clientGone };
