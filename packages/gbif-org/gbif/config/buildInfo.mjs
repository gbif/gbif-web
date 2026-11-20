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

// The commit being built: GIT_COMMIT (set by Jenkins, and what graphql-api uses), or locally we
// ask git. Anything that isn't a commit hash is ignored. Deliberately not a PUBLIC_ variable: Vite
// bakes those into the client bundle, which would change every chunk's hash on every commit.
export function resolveCommit(env = process.env, git = readGitHead) {
  return asCommit(env.GIT_COMMIT) ?? asCommit(git());
}

// The commit the running server reports, in logs and to the browser. In production that is the
// build being served, never the checkout it happens to sit in. In development it is the checkout,
// even if an older build is lying around in dist.
export function getServerCommit({ isProduction, distDir, env = process.env, git = readGitHead }) {
  if (!isProduction) return resolveCommit(env, git);
  return readBuiltCommit(distDir) ?? resolveCommit(env, () => undefined);
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

// The inline script that hands the commit to the browser (read by src/utils/buildCommit.ts).
// Goes on every server-rendered page and on the fallback page served when rendering fails.
// Only a commit hash (hex digits) is ever written, so the value needs no escaping.
export function renderCommitScript(commit, nonce) {
  const value = asCommit(commit);
  if (!value) return '';
  return `<script nonce="${nonce}">window.__GBIF_COMMIT__="${value}";</script>`;
}
