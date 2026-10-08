// Stands in for a hosted-portal site (a Jekyll page that mounts the library): serves the e2e build
// of the library, and the site's index.html for every other path so the client router takes over.
// HP_SITE picks the folder under e2e/hp-sites/.

import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HP_E2E_DIST, HP_PORT } from '../env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const site = process.env.HP_SITE;
if (!site) throw new Error('Set HP_SITE to a folder in e2e/hp-sites/');
const port = parseInt(process.env.PORT || String(HP_PORT));

const app = express();
app.use(express.static(resolve(__dirname, '../..', HP_E2E_DIST)));
app.get('*', (_, res) => res.sendFile(join(__dirname, site, 'index.html')));
app.listen(port, () => console.log(`[hp-site] ${site} on :${port}`));
