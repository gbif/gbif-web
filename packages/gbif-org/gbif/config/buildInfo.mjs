import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { escapeForScript } from '../../src/utils/escapeForScript.js';

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
export function renderCommitScript(commit, nonce) {
  const value = asCommit(commit);
  if (!value) return '';
  return `<script nonce="${nonce}">window.__GBIF_COMMIT__=${escapeForScript(
    JSON.stringify(value)
  )};</script>`;
}

// Cache-Control for the static client build. Content-hashed files in assets/ are kept across
// releases on the host and can be cached forever. build-info.json changes with every deploy and is
// used to check what is deployed, so it gets a short cache: fresh within half a minute of a deploy,
// but cheap if something polls it. Everything else keeps the default.
export function createStaticHeaders(clientDir) {
  const assetsDir = path.join(clientDir, 'assets') + path.sep;
  const buildInfoFile = path.join(clientDir, BUILD_INFO_FILE);
  return (res, filePath) => {
    if (filePath.startsWith(assetsDir)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath === buildInfoFile) {
      res.setHeader('Cache-Control', 'public, max-age=30');
    }
  };
}
