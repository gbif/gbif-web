import path from 'node:path';
import { secretEnv } from '../envConfig.mjs';

// Where the built site lives. Overridden by e2e tests so their mock-endpoint build does not
// replace the regular one. Shared by server.js and the logger, so the pages it serves and the
// commit it logs always come from the same build.
export const DIST_DIR = path.resolve(secretEnv.GBIF_DIST_DIR || 'dist/gbif');
