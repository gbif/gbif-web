import { afterEach, describe, expect, it } from 'vitest';
import { getBuildCommit } from './buildCommit';

describe('getBuildCommit', () => {
  afterEach(() => {
    globalThis.__GBIF_COMMIT__ = undefined;
  });

  it('uses the commit the server provided', () => {
    globalThis.__GBIF_COMMIT__ = 'a102096f4';
    expect(getBuildCommit()).toBe('a102096f4');
  });

  it('is undefined when there is none', () => {
    expect(getBuildCommit()).toBe(undefined);
  });
});
