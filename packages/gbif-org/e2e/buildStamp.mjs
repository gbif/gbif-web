// Fingerprint of everything the e2e builds bake in. build.mjs stores it next to each build and
// globalSetup refuses to test a build whose inputs have changed since. When the build starts
// depending on a new file or folder, add it to INPUTS, or edits to it will not mark the build stale.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const INPUTS = [
  'src',
  'public',
  'gbif/index.html',
  'gbif/fallback.html',
  'gbif/vite.config.ts',
  'hp/vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'package-lock.json',
  'e2e/env.mjs',
];

// Vitest files sit next to the code but are not part of the build.
const UNIT_TEST = /\.test\.[jt]sx?$/;

/** @param {string} dist */
export const stampFile = (dist) => join(dist, 'build-stamp.txt');

/** @param {string} path @returns {string[]} */
function files(path) {
  if (!existsSync(path)) return [];
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path)
    .sort()
    .flatMap((entry) => files(join(path, entry)))
    .filter((file) => !UNIT_TEST.test(file));
}

export function computeStamp() {
  const hash = createHash('sha1');
  for (const file of INPUTS.flatMap(files)) {
    hash.update(file).update('\0').update(readFileSync(file)).update('\0');
  }
  return hash.digest('hex');
}
