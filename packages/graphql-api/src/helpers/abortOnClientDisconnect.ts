import { setMaxListeners } from 'node:events';
import type { IncomingMessage, ServerResponse } from 'node:http';

type ClosableReq = Pick<IncomingMessage, 'once'>;
type ClosableRes = Pick<ServerResponse, 'once' | 'writableEnded'>;

/**
 * Build the AbortController for a single GraphQL request. Its `signal` aborts as
 * soon as the client disconnects before we have finished responding, so
 * resolvers and data sources (e.g. the per-request queue in
 * QueuedRESTDataSource) can cancel in-flight upstream calls and drop
 * still-queued ones instead of running the whole operation for a client that
 * has gone away.
 */
export default function abortControllerForRequest(
  req?: ClosableReq,
  res?: ClosableRes,
): AbortController {
  const controller = new AbortController();
  setMaxListeners(500, controller.signal); // somewhat random number above the default of 10, to avoid warnings for large queries with many resolvers

  // Only a premature close (client left before we finished responding) should
  // abort; a 'close' after the response has been sent is a normal end.
  const abortIfUnfinished = () => {
    if (!res?.writableEnded) controller.abort();
  };
  req?.once('close', abortIfUnfinished);
  res?.once('close', abortIfUnfinished);

  return controller;
}
