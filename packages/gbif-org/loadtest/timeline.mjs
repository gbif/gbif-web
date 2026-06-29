// Bin CPU self-time across the capture into fixed-width time windows and split each
// window into module-loading vs. everything-else. Use this to find where cold-start
// lazy `import()` of route chunks ends (it shows as ~100% MODLOAD early, then 0%), so
// you know how many seconds to skip before reading the steady-state breakdown.
//
//   node loadtest/timeline.mjs <profile.cpuprofile> [binSeconds=5]
import fs from 'fs';

const prof = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const binSec = Number(process.argv[3] || 5);
const { nodes, samples, timeDeltas } = prof;

const byId = new Map();
for (const n of nodes) byId.set(n.id, n);
const parent = new Map();
for (const n of nodes) if (n.children) for (const c of n.children) parent.set(c, n.id);
const name = (id) => { const n = byId.get(id); return n ? (n.callFrame.functionName || '(anon)') : '?'; };

// Node ESM/CJS loader frames. A sample counts as "module loading" if any ancestor matches.
const loaderRe = /^(defaultLoadImpl|loadSource|getSourceSync|defaultLoad|loadAndTranslate|#createModuleJob|moduleResolve|defaultResolve|packageResolve|readPackageJSON|compileSourceTextModule|wrapSafe|cjsPreparseModuleExports|createCJSModuleWrap|resolveForCJSWithHooks|ModuleJob|#link|onImport)$/;
function inLoader(id) {
  let cur = id, g = 0;
  while (cur != null && g++ < 60) { if (loaderRe.test(name(cur))) return true; cur = parent.get(cur); }
  return false;
}

const bins = new Map();
let cum = 0;
for (let i = 0; i < samples.length; i++) {
  const dt = timeDeltas[i] || 0;
  cum += dt;
  const b = Math.floor(cum / 1e6 / binSec) * binSec;
  const id = samples[i];
  if (!bins.has(b)) bins.set(b, { load: 0, idle: 0, other: 0, total: 0 });
  const x = bins.get(b);
  x.total += dt;
  if (name(id) === '(idle)') { x.idle += dt; continue; }
  if (inLoader(id)) x.load += dt; else x.other += dt;
}

const ms = (n) => (n / 1000).toFixed(0).padStart(6);
console.log('bin(s)     total    idle  MODLOAD   other  | modload% of active');
for (const b of [...bins.keys()].sort((a, b) => a - b)) {
  const x = bins.get(b);
  const act = x.total - x.idle;
  console.log(`${String(b).padStart(3)}-${String(b + binSec).padStart(3)} ${ms(x.total)} ${ms(x.idle)} ${ms(x.load)} ${ms(x.other)}  | ${act ? ((x.load / act) * 100).toFixed(0) : 0}%`);
}
