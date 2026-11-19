import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { BUILD_INFO_FILE, readBuiltCommit, resolveCommit } from './buildInfo.mjs';

const SHA = '6d946415e08d0ca967184e257e003da15adeaa05';
const OTHER_SHA = '8c91ce5c3aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const noGit = () => undefined;

describe('resolveCommit', () => {
  it('prefers PUBLIC_GIT_COMMIT over GIT_COMMIT and git', () => {
    expect(resolveCommit({ PUBLIC_GIT_COMMIT: SHA, GIT_COMMIT: OTHER_SHA }, () => OTHER_SHA)).toBe(
      SHA
    );
  });

  it('falls back to GIT_COMMIT, then git', () => {
    expect(resolveCommit({ GIT_COMMIT: SHA }, () => OTHER_SHA)).toBe(SHA);
    expect(resolveCommit({}, () => `${SHA}\n`)).toBe(SHA);
  });

  it('ignores values that are not commit hashes', () => {
    expect(resolveCommit({ PUBLIC_GIT_COMMIT: 'unknown', GIT_COMMIT: 'x\r\ny: z' }, noGit)).toBe(
      undefined
    );
    expect(resolveCommit({ GIT_COMMIT: 'unknown' }, () => SHA)).toBe(SHA);
  });
});

describe('readBuiltCommit', () => {
  let dir;
  afterEach(() => dir && fs.rmSync(dir, { recursive: true, force: true }));

  function distWith(content) {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'build-info-'));
    fs.mkdirSync(path.join(dir, 'client'));
    if (content !== undefined) fs.writeFileSync(path.join(dir, 'client', BUILD_INFO_FILE), content);
    return dir;
  }

  it('reads the commit from the client build', () => {
    expect(readBuiltCommit(distWith(JSON.stringify({ commit: SHA })))).toBe(SHA);
  });

  it('returns undefined when the file is missing, broken or has no commit', () => {
    expect(readBuiltCommit(distWith())).toBe(undefined);
    expect(readBuiltCommit(distWith('{not json'))).toBe(undefined);
    expect(readBuiltCommit(distWith(JSON.stringify({ commit: null })))).toBe(undefined);
  });
});
