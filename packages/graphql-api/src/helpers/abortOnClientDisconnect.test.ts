/* eslint-env mocha */
import assert from 'assert';
import { EventEmitter } from 'node:events';
import abortControllerForRequest from '@/helpers/abortOnClientDisconnect';

describe('abortControllerForRequest', () => {
  it('does not abort while the connection is open', () => {
    const req = new EventEmitter();
    const res = new EventEmitter();
    const controller = abortControllerForRequest(req as any, res as any);
    assert.strictEqual(controller.signal.aborted, false);
  });

  it('aborts when the request stream closes (client disconnect)', () => {
    const req = new EventEmitter();
    const res = new EventEmitter();
    const controller = abortControllerForRequest(req as any, res as any);
    req.emit('close');
    assert.strictEqual(controller.signal.aborted, true);
  });

  it('aborts when the response stream closes (client disconnect)', () => {
    // The case the old req-only wiring missed.
    const req = new EventEmitter();
    const res = new EventEmitter();
    const controller = abortControllerForRequest(req as any, res as any);
    res.emit('close');
    assert.strictEqual(controller.signal.aborted, true);
  });

  it('does NOT abort on a normal completion (response already finished)', () => {
    // After a successful response, both streams still emit 'close'; writableEnded
    // is true, so we must not abort the (now-irrelevant) signal.
    const req = new EventEmitter();
    const res = Object.assign(new EventEmitter(), { writableEnded: true });
    const controller = abortControllerForRequest(req as any, res as any);
    res.emit('close');
    req.emit('close');
    assert.strictEqual(controller.signal.aborted, false);
  });

  it('tolerates missing req/res (internal executeOperation calls)', () => {
    const controller = abortControllerForRequest();
    assert.strictEqual(controller.signal.aborted, false);
  });
});
