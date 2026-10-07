// Fingerprint of everything the e2e build bakes in. build.mjs stores it next to the build and
// globalSetup refuses to test a build whose inputs have changed since.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { GBIF_E2E_DIST } from './env.mjs';

const INPUTS = [
  'src',
  'gbif/index.html',
  'gbif/fallback.html',
  'gbif/vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'package-lock.json',
  'e2e/env.mjs',
];

export const STAMP_FILE = join(GBIF_E2E_DIST, 'build-stamp.txt');

/** @param {string} path @returns {string[]} */
function files(path) {
  if (!existsSync(path)) return [];
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path)
    .sort()
    .flatMap((entry) => files(join(path, entry)));
}

export function computeStamp() {
  const hash = createHash('sha1');
  for (const file of INPUTS.flatMap(files)) {
    hash.update(file).update('\0').update(readFileSync(file)).update('\0');
  }
  return hash.digest('hex');
}
