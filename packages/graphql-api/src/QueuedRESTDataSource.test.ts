/* eslint-env mocha */
import assert from 'assert';
import { EventEmitter } from 'node:events';
import { RESTDataSource } from '@/RESTDataSource';
import QueuedRESTDataSource from '@/QueuedRESTDataSource';
import abortControllerForRequest from '@/helpers/abortOnClientDisconnect';
import config from '@/config';

// An error shaped like the one node-fetch throws when an in-flight request is
// aborted via its signal.
function abortError() {
  const e = new Error('The user aborted a request.');
  e.name = 'AbortError';
  return e;
}

// Let microtasks/timers settle so p-queue can start/advance queued work.
const flush = () => new Promise((r) => setTimeout(r, 5));

// Poll until `cond` holds (or fail). Avoids guessing how many `flush`es a piece
// of async queue/pool plumbing needs.
async function waitFor(cond: () => boolean, timeoutMs = 1500) {
  const start = Date.now();
  while (!cond()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('waitFor: condition not met in time');
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 5));
  }
}

describe('QueuedRESTDataSource', () => {
  let originalGet;
  let originalPost;
  let calls; // every call that reached the underlying get
  let pending; // calls currently held (not yet released/aborted)
  let active; // currently in-flight
  let peak; // max concurrent in-flight

  beforeEach(() => {
    originalGet = RESTDataSource.prototype.get;
    originalPost = RESTDataSource.prototype.post;
    calls = [];
    pending = [];
    active = 0;
    peak = 0;

    // Stub the underlying (Apollo-shim) get: it records the init it receives and
    // the concurrency, holds until explicitly released, and — like node-fetch —
    // rejects if the forwarded signal aborts. `super.get` in QueuedRESTDataSource
    // resolves to this prototype method.
    RESTDataSource.prototype.get = function stubGet(path, params, init) {
      active += 1;
      peak = Math.max(peak, active);
      return new Promise((resolve, reject) => {
        let settled = false;
        const settle = (fn) => {
          if (settled) return;
          settled = true;
          active -= 1;
          const i = pending.indexOf(rec);
          if (i >= 0) pending.splice(i, 1);
          fn();
        };
        const rec = {
          path,
          params,
          init,
          release: () => settle(() => resolve('ok')),
        };
        const sig = init && init.signal;
        if (sig) {
          if (sig.aborted) {
            settle(() => reject(abortError()));
            return;
          }
          sig.addEventListener('abort', () => settle(() => reject(abortError())), {
            once: true,
          });
        }
        calls.push(rec);
        pending.push(rec);
      });
    };
  });

  afterEach(() => {
    RESTDataSource.prototype.get = originalGet;
    RESTDataSource.prototype.post = originalPost;
  });

  it('passes non-enQueued requests straight through to the underlying get', async () => {
    const ds = new QueuedRESTDataSource({ pool: 'testpool' });
    const p = ds.get('/plain', null, {});
    await flush();
    assert.strictEqual(calls.length, 1);
    assert.strictEqual(calls[0].path, '/plain');
    calls[0].release();
    assert.strictEqual(await p, 'ok');
  });

  it('caps concurrency per GraphQL request (per-instance queue)', async () => {
    const ds = new QueuedRESTDataSource({ pool: 'testpool', concurrency: 2 });
    const ps = Array.from({ length: 5 }, (_, i) =>
      ds.get(`/x${i}`, null, { enQueue: true }),
    );
    await flush();

    // Only `concurrency` may be in flight at once.
    assert.strictEqual(active, 2, `expected 2 in flight, got ${active}`);
    assert.strictEqual(peak, 2);

    // Drain: release the oldest in-flight call until all five have run.
    let guard = 0;
    while (active > 0 && guard < 50) {
      guard += 1;
      if (pending.length) pending[0].release();
      // eslint-disable-next-line no-await-in-loop
      await flush();
    }
    await Promise.all(ps);
    assert.strictEqual(calls.length, 5);
    assert.strictEqual(peak, 2, 'concurrency cap must hold for the whole run');
  });

  it('does NOT hit upstream for a request cancelled while still queued', async () => {
    const ds = new QueuedRESTDataSource({ pool: 'testpool', concurrency: 1 });
    const ac = new AbortController();

    const pA = ds.get('/A', null, { enQueue: true }); // takes the single slot
    const pB = ds.get('/B', null, { enQueue: true, signal: ac.signal }); // waits
    await flush();

    // Only A reached upstream; B is waiting in the queue.
    assert.strictEqual(calls.length, 1);
    assert.strictEqual(calls[0].path, '/A');

    // Client navigates away -> B's signal aborts while B is still queued.
    ac.abort();
    // Free the slot so B would get its turn.
    calls[0].release();

    await assert.rejects(pB, 'cancelled-while-queued request should reject');
    await pA;

    // The crucial assertion: B was skipped, never sent to es-api.
    assert.strictEqual(calls.length, 1, 'B must not reach upstream');
    assert.ok(!calls.some((c) => c.path === '/B'));
  });

  it('forwards an aborting signal to upstream (in-flight cancellation)', async () => {
    const ds = new QueuedRESTDataSource({ pool: 'testpool' });
    const ac = new AbortController();

    const pA = ds.get('/A', null, { enQueue: true, signal: ac.signal });
    await flush();
    assert.strictEqual(calls.length, 1);

    // A signal must be forwarded to the underlying request, and it must reflect
    // the client's abort (so node-fetch tears down the es-api connection).
    const forwarded = calls[0].init && calls[0].init.signal;
    assert.ok(forwarded, 'a signal should be forwarded to the underlying get');
    assert.strictEqual(forwarded.aborted, false);

    ac.abort();

    assert.strictEqual(
      forwarded.aborted,
      true,
      'forwarded signal must abort when the client aborts',
    );
    await assert.rejects(pA, 'in-flight request should reject when aborted');
  });

  it('still runs an enQueued request whose signal never aborts', async () => {
    const ds = new QueuedRESTDataSource({ pool: 'testpool' });
    const ac = new AbortController();
    const p = ds.get('/ok', null, { enQueue: true, signal: ac.signal });
    await flush();
    assert.strictEqual(calls.length, 1);
    calls[0].release();
    assert.strictEqual(await p, 'ok');
  });

  describe('retry (opt-in, GET-only)', () => {
    // A get stub scripted to fail with the given outcomes, then succeed.
    function scriptGet(outcomes: Array<number | 'net' | 'ok'>) {
      const httpError = (status: number) => {
        const e: any = new Error(`${status}: upstream`);
        e.extensions = { http: { status } };
        return e;
      };
      const netError = () => new Error('ECONNRESET'); // no http status
      const fn: any = () => {
        const outcome = outcomes[fn.calls] || 'ok';
        fn.calls += 1;
        if (outcome === 'ok') return Promise.resolve('ok');
        if (outcome === 'net') return Promise.reject(netError());
        return Promise.reject(httpError(outcome as number));
      };
      fn.calls = 0;
      return fn;
    }

    it('retries a GET once on 5xx and then succeeds', async () => {
      const stub = scriptGet([503]); // fail once, then ok
      RESTDataSource.prototype.get = stub;
      const ds = new QueuedRESTDataSource({ pool: 'testpool' });
      const res = await ds.get('/x', null, { enQueue: true, retry: true });
      assert.strictEqual(res, 'ok');
      assert.strictEqual(stub.calls, 2, 'one retry => two attempts');
    });

    it('retries on a network error and on 429', async () => {
      const netStub = scriptGet(['net']);
      RESTDataSource.prototype.get = netStub;
      const ds = new QueuedRESTDataSource({ pool: 'testpool' });
      assert.strictEqual(await ds.get('/n', null, { enQueue: true, retry: true }), 'ok');
      assert.strictEqual(netStub.calls, 2);

      const rlStub = scriptGet([429]);
      RESTDataSource.prototype.get = rlStub;
      assert.strictEqual(await ds.get('/r', null, { enQueue: true, retry: true }), 'ok');
      assert.strictEqual(rlStub.calls, 2);
    });

    it('does NOT retry a 4xx', async () => {
      const stub = scriptGet([404, 404]);
      RESTDataSource.prototype.get = stub;
      const ds = new QueuedRESTDataSource({ pool: 'testpool' });
      await assert.rejects(ds.get('/x', null, { enQueue: true, retry: true }));
      assert.strictEqual(stub.calls, 1, '4xx must not be retried');
    });

    it('does NOT retry unless retry is opted in', async () => {
      const stub = scriptGet([503]);
      RESTDataSource.prototype.get = stub;
      const ds = new QueuedRESTDataSource({ pool: 'testpool' });
      await assert.rejects(ds.get('/x', null, { enQueue: true }));
      assert.strictEqual(stub.calls, 1);
    });

    it('gives up after the configured number of retries', async () => {
      const stub = scriptGet([503, 503]); // both attempts fail
      RESTDataSource.prototype.get = stub;
      const ds = new QueuedRESTDataSource({ pool: 'testpool' });
      await assert.rejects(ds.get('/x', null, { enQueue: true, retry: true }));
      assert.strictEqual(stub.calls, 2, 'initial + 1 retry, then give up');
    });

    it('stops retrying when the request is cancelled during backoff', async () => {
      const stub = scriptGet([503]); // would succeed on retry, but we cancel
      RESTDataSource.prototype.get = stub;
      const ds = new QueuedRESTDataSource({ pool: 'testpool' });
      const ac = new AbortController();
      const p = ds.get('/x', null, { enQueue: true, retry: true, signal: ac.signal });
      await flush(); // first attempt has failed; we're now in backoff
      ac.abort();
      await assert.rejects(p);
      assert.strictEqual(stub.calls, 1, 'no retry after cancellation');
    });

    it('does NOT retry non-idempotent methods (POST)', async () => {
      const stub: any = () => {
        stub.calls += 1;
        const e: any = new Error('503: upstream');
        e.extensions = { http: { status: 503 } };
        return Promise.reject(e);
      };
      stub.calls = 0;
      RESTDataSource.prototype.post = stub;
      const ds = new QueuedRESTDataSource({ pool: 'testpool' });
      await assert.rejects(ds.post('/x', {}, { enQueue: true, retry: true }));
      assert.strictEqual(stub.calls, 1, 'POST must not be retried');
    });
  });

  describe('pool timeout vs client abort', () => {
    let originalRequestPools;

    beforeEach(() => {
      originalRequestPools = (config as any).requestPools;
    });
    afterEach(() => {
      (config as any).requestPools = originalRequestPools;
    });

    function setPoolTimeout(pool: string, ms: number) {
      (config as any).requestPools = {
        ...((config as any).requestPools || {}),
        [pool]: { ...((config as any).requestPools?.[pool] || {}), timeoutMs: ms },
      };
    }

    it('surfaces a pool timeout as a distinct 504, not "user aborted"', async () => {
      setPoolTimeout('slowpool', 40);
      const ds = new QueuedRESTDataSource({ pool: 'slowpool' });
      // Never released: the stub holds until the pool timeout aborts the signal.
      const p = ds.get('/slow', null, { enQueue: true });
      await assert.rejects(p, (err: any) => {
        assert.strictEqual(err?.extensions?.poolTimeout, true);
        assert.strictEqual(err?.extensions?.http?.status, 504);
        assert.ok(
          !/user aborted/i.test(err?.message ?? ''),
          'must not be reported as a user/client abort',
        );
        return true;
      });
    });

    it('a timed-out request does not pre-expire its queued siblings (concurrency 1)', async () => {
      // The reported bug: a dataset search where every result resolves its key
      // fans out many enQueued GETs through a concurrency-1 queue. The first
      // holds the only slot until it times out; the rest must still run, not be
      // aborted while waiting.
      setPoolTimeout('serialpool', 40);
      const ds = new QueuedRESTDataSource({ pool: 'serialpool', concurrency: 1 });
      const first = ds.get('/first', null, { enQueue: true }); // never released
      const second = ds.get('/second', null, { enQueue: true });

      // The first request exhausts its budget and surfaces as a timeout.
      await assert.rejects(first, (err: any) => {
        assert.strictEqual(err?.extensions?.poolTimeout, true);
        return true;
      });

      // The second must now reach upstream with a fresh budget — it was only
      // waiting in the queue, so its clock had not been running.
      await flush();
      const secondCall = calls.find((c) => c.path === '/second');
      assert.ok(
        secondCall,
        'queued sibling must reach upstream, not expire while waiting',
      );
      secondCall.release();
      assert.strictEqual(await second, 'ok');
    });

    it('still reports a genuine client disconnect as an abort (not a timeout)', async () => {
      setPoolTimeout('clientpool', 5000); // long enough that it cannot fire here
      const ds = new QueuedRESTDataSource({ pool: 'clientpool' });
      const ac = new AbortController();
      const p = ds.get('/x', null, { enQueue: true, signal: ac.signal });
      await flush();
      ac.abort();
      await assert.rejects(p, (err: any) => {
        assert.notStrictEqual(
          err?.extensions?.poolTimeout,
          true,
          'a client abort must not be relabelled as a pool timeout',
        );
        return true;
      });
    });
  });

  // The reported scenario, distilled into the acceptance criteria: a search
  // returns many results and each result resolves its dataset key as its own
  // enQueued GET through a (low-)concurrency per-request queue.
  describe('dataset-search fan-out (acceptance criteria)', () => {
    let originalRequestPools;

    beforeEach(() => {
      originalRequestPools = (config as any).requestPools;
    });
    afterEach(() => {
      (config as any).requestPools = originalRequestPools;
    });

    function setPoolTimeout(pool: string, ms: number) {
      (config as any).requestPools = {
        ...((config as any).requestPools || {}),
        [pool]: { ...((config as any).requestPools?.[pool] || {}), timeoutMs: ms },
      };
    }

    // A programmable upstream. `plan` gives a per-path sequence consumed per
    // attempt (so retries take the next entry; the last entry repeats):
    //   'ok'    -> resolve immediately
    //   number  -> reject immediately with that HTTP status
    //   'hang'  -> never settles on its own (release() or a signal abort settles it)
    // Anything not in `plan` uses `fallback`.
    function installUpstream(
      plan: Record<string, Array<'ok' | 'hang' | number>> = {},
      fallback: 'ok' | 'hang' | number = 'ok',
    ) {
      const idx: Record<string, number> = {};
      const httpError = (status: number) => {
        const e: any = new Error(`${status}: upstream`);
        e.extensions = { http: { status } };
        return e;
      };
      RESTDataSource.prototype.get = function stub(path, params, init) {
        const seq = plan[path];
        const n = (idx[path] = (idx[path] ?? 0) + 1);
        const behavior = seq ? seq[n - 1] ?? seq[seq.length - 1] : fallback;
        active += 1;
        peak = Math.max(peak, active);
        const rec: any = { path, params, init, attempt: n };
        calls.push(rec);
        return new Promise((resolve, reject) => {
          let settled = false;
          const settle = (fn: () => void) => {
            if (settled) return;
            settled = true;
            active -= 1;
            const i = pending.indexOf(rec);
            if (i >= 0) pending.splice(i, 1);
            fn();
          };
          if (behavior === 'ok') return settle(() => resolve('ok'));
          if (typeof behavior === 'number') {
            return settle(() => reject(httpError(behavior)));
          }
          // 'hang'
          rec.release = () => settle(() => resolve('ok'));
          pending.push(rec);
          const sig = init?.signal;
          if (sig) {
            if (sig.aborted) return settle(() => reject(abortError()));
            sig.addEventListener('abort', () => settle(() => reject(abortError())), {
              once: true,
            });
          }
          return undefined;
        });
      } as any;
    }

    const countCalls = (path: string) =>
      calls.filter((c) => c.path === path).length;

    it('[concurrency 1, no retry] one request timing out does not abort the rest — the queue continues', async () => {
      setPoolTimeout('p', 60);
      installUpstream({ '/a': ['hang'] }, 'ok'); // /a times out; /b, /c succeed
      const ds = new QueuedRESTDataSource({ pool: 'p', concurrency: 1 });
      const a = ds.get('/a', null, { enQueue: true });
      const b = ds.get('/b', null, { enQueue: true });
      const c = ds.get('/c', null, { enQueue: true });

      await assert.rejects(a, (e: any) => e?.extensions?.poolTimeout === true);
      assert.strictEqual(await b, 'ok');
      assert.strictEqual(await c, 'ok');
      assert.deepStrictEqual(
        calls.map((x) => x.path),
        ['/a', '/b', '/c'],
      );
    });

    it('[concurrency 1, retry 1] a timeout is NOT retried (it is our own deadline) — move on to the next', async () => {
      setPoolTimeout('p', 60);
      installUpstream({ '/a': ['hang', 'hang'] }, 'ok');
      const ds = new QueuedRESTDataSource({ pool: 'p', concurrency: 1 });
      const a = ds.get('/a', null, { enQueue: true, retry: 1 });
      const b = ds.get('/b', null, { enQueue: true, retry: 1 });

      await assert.rejects(a, (e: any) => e?.extensions?.poolTimeout === true);
      assert.strictEqual(countCalls('/a'), 1, 'a timeout must not be retried');
      assert.strictEqual(await b, 'ok');
    });

    it('[concurrency 1, retry 1] a 503 IS retried once, then the queue continues', async () => {
      installUpstream({ '/a': [503, 'ok'] }, 'ok');
      const ds = new QueuedRESTDataSource({ pool: 'p', concurrency: 1 });
      const a = ds.get('/a', null, { enQueue: true, retry: 1 });
      const b = ds.get('/b', null, { enQueue: true });

      assert.strictEqual(await a, 'ok');
      assert.strictEqual(countCalls('/a'), 2, '503 -> one retry -> success');
      assert.strictEqual(await b, 'ok');
    });

    it('[concurrency 5] runs at most 5 at once and starts the next the moment one finishes (no waiting for the other 4)', async () => {
      installUpstream({}, 'hang'); // every call hangs until released
      const ds = new QueuedRESTDataSource({ pool: 'p', concurrency: 5 });
      const ps = Array.from({ length: 6 }, (_, i) =>
        ds.get(`/k${i}`, null, { enQueue: true }),
      );

      await waitFor(() => calls.length === 5);
      assert.strictEqual(active, 5);
      assert.strictEqual(peak, 5);
      assert.ok(!calls.some((c) => c.path === '/k5'), '6th must wait its turn');

      // Finish ONE; the 6th must start immediately, not wait for the other four.
      pending.find((p) => p.path === '/k0').release();
      await waitFor(() => calls.some((c) => c.path === '/k5'));
      assert.strictEqual(active, 5, '4 still held + the newly started 6th');

      // Cleanup.
      pending.slice().forEach((p) => p.release());
      await Promise.all(ps);
      assert.strictEqual(peak, 5, 'the cap held for the whole run');
    });

    it('[retry 5] stops retrying as soon as an attempt succeeds, then continues to the next', async () => {
      installUpstream({ '/a': [503, 'ok'] }, 'ok'); // fail once, then succeed
      const ds = new QueuedRESTDataSource({ pool: 'p', concurrency: 1 });
      const a = ds.get('/a', null, { enQueue: true, retry: 5 });
      const b = ds.get('/b', null, { enQueue: true });

      assert.strictEqual(await a, 'ok');
      assert.strictEqual(
        countCalls('/a'),
        2,
        'second attempt succeeded -> no further retries',
      );
      assert.strictEqual(await b, 'ok');
    });

    it('[user abort] cancels in-flight requests and removes this request\'s queued ones (no upstream calls); the shared pool stays usable', async () => {
      installUpstream({}, 'hang');
      const ac = new AbortController();
      const ds = new QueuedRESTDataSource({ pool: 'p', concurrency: 2 });
      const ps = ['/a', '/b', '/c', '/d'].map((p) =>
        ds.get(p, null, { enQueue: true, signal: ac.signal }),
      );

      await waitFor(() => calls.length === 2); // a,b in flight; c,d queued
      assert.strictEqual(active, 2);

      ac.abort();

      // All four reject: the two in-flight are cancelled, the two queued removed.
      await Promise.all(ps.map((p) => assert.rejects(p)));
      assert.strictEqual(
        calls.length,
        2,
        'queued requests must not reach upstream after a user abort',
      );
      assert.ok(!calls.some((c) => c.path === '/c' || c.path === '/d'));

      // The shared pool is unaffected: a fresh request (its own per-request
      // queue, a non-aborted signal) still works.
      const ds2 = new QueuedRESTDataSource({ pool: 'p', concurrency: 2 });
      const fresh = ds2.get('/fresh', null, { enQueue: true });
      await waitFor(() => calls.some((c) => c.path === '/fresh'));
      pending.find((p) => p.path === '/fresh').release();
      assert.strictEqual(await fresh, 'ok');
    });

    it('[client disconnect] closing the connection empties this request\'s queue and cancels in-flight calls (end to end)', async () => {
      // End to end through the real disconnect wiring: a fake req/res whose
      // 'close' drives the request's AbortController, exactly as in index.ts.
      installUpstream({}, 'hang');
      const req = new EventEmitter();
      const res = new EventEmitter();
      const controller = abortControllerForRequest(req as any, res as any);
      const ds = new QueuedRESTDataSource({ pool: 'p', concurrency: 2 });
      const ps = ['/a', '/b', '/c', '/d'].map((p) =>
        ds.get(p, null, { enQueue: true, signal: controller.signal }),
      );

      await waitFor(() => calls.length === 2); // a,b in flight; c,d queued
      assert.strictEqual(active, 2);

      // The browser tab closes -> the connection closes.
      res.emit('close');

      await Promise.all(ps.map((p) => assert.rejects(p)));
      assert.strictEqual(
        calls.length,
        2,
        'no further upstream calls fire after the client disconnects',
      );
      assert.ok(!calls.some((c) => c.path === '/c' || c.path === '/d'));
    });

    it('[timeout] fails AS a timeout, names the endpoint, and is not a "user aborted" message', async () => {
      setPoolTimeout('p', 40);
      installUpstream({}, 'hang');
      const ds = new QueuedRESTDataSource({ pool: 'p', concurrency: 1 });
      await assert.rejects(
        ds.get('/dataset/abc-123', null, { enQueue: true }),
        (e: any) => {
          assert.strictEqual(e?.extensions?.poolTimeout, true);
          assert.match(e?.message ?? '', /timeout/i);
          assert.doesNotMatch(e?.message ?? '', /user aborted/i);
          // The offending endpoint is reported, both in the message and as
          // structured data for logs.
          assert.match(e?.message ?? '', /\/dataset\/abc-123/);
          assert.strictEqual(e?.extensions?.target, '/dataset/abc-123');
          return true;
        },
      );
    });
  });
});
