// Stands in for a hosted-portal site (a Jekyll page that mounts the library): serves the e2e build
// of the library, and the site's index.html for every other path so the client router takes over.
// HP_SITE picks the folder under e2e/hp-sites/.

import express from 'express';
import { dirname, extname, join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { HP_E2E_DIST, HP_PORT } from '../env.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const site = process.env.HP_SITE;
if (!site) throw new Error('Set HP_SITE to a folder in e2e/hp-sites/');
const port = parseInt(process.env.PORT || String(HP_PORT));

// Playwright starts the servers before globalSetup checks the build. Without this, a missing build
// leaves the library a 404 and the run waits for the webServer timeout with no hint why.
const dist = resolve(__dirname, '../..', HP_E2E_DIST);
if (!existsSync(join(dist, 'gbif-lib.js'))) {
  console.error('No e2e build. Run npm run e2e:build.');
  process.exit(1);
}

const app = express();
app.use(express.static(dist));
// Paths with a file extension are assets: a missing one is a 404, not the page, so a broken build
// fails clearly instead of as "Unexpected token <".
app.get('*', (req, res) =>
  extname(req.path) ? res.status(404).end() : res.sendFile(join(__dirname, site, 'index.html'))
);
app.listen(port, () => console.log(`[hp-site] ${site} on :${port}`));
