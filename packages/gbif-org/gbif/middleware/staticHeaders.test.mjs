import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { BUILD_INFO_FILE } from '../config/buildInfo.mjs';
import { createStaticHeaders } from './staticHeaders.mjs';

describe('createStaticHeaders', () => {
  const clientDir = path.join(os.tmpdir(), 'client');
  const setHeaders = createStaticHeaders(clientDir);
  function cacheControlFor(file) {
    const headers = {};
    setHeaders({ setHeader: (name, value) => (headers[name] = value) }, path.join(clientDir, file));
    return headers['Cache-Control'];
  }

  it('caches hashed assets forever', () => {
    expect(cacheControlFor('assets/app-shared-CNktY3zd.js')).toBe(
      'public, max-age=31536000, immutable'
    );
  });

  it('caches build-info.json only briefly', () => {
    expect(cacheControlFor(BUILD_INFO_FILE)).toBe('public, max-age=30');
  });

  it('leaves other files on the default', () => {
    expect(cacheControlFor('gbif/index.html')).toBe(undefined);
    expect(cacheControlFor(`${BUILD_INFO_FILE}.br`)).toBe(undefined);
  });
});
