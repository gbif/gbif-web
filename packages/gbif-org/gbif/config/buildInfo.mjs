import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Written next to the client build, so it is served as /build-info.json and the server can read
// which commit it is running.
export const BUILD_INFO_FILE = 'build-info.json';

const COMMIT_PATTERN = /^[0-9a-f]{7,40}$/i;

function readGitHead() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return undefined;
  }
}

function asCommit(value) {
  const trimmed = typeof value === 'string' ? value.trim() : undefined;
  return trimmed && COMMIT_PATTERN.test(trimmed) ? trimmed : undefined;
}

// The commit being built. PUBLIC_GIT_COMMIT wins if set, then GIT_COMMIT (set by Jenkins, and
// what graphql-api uses), and locally we ask git. Anything that isn't a commit hash is ignored.
export function resolveCommit(env = process.env, git = readGitHead) {
  return asCommit(env.PUBLIC_GIT_COMMIT) ?? asCommit(env.GIT_COMMIT) ?? asCommit(git());
}

// The commit a build in distDir was made from, or undefined if there is no build info.
export function readBuiltCommit(distDir) {
  try {
    const info = JSON.parse(fs.readFileSync(path.join(distDir, 'client', BUILD_INFO_FILE), 'utf8'));
    return asCommit(info?.commit);
  } catch {
    return undefined;
  }
}
