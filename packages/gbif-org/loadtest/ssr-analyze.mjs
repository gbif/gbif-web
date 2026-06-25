import fs from 'fs';
const prof = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const skipMs = Number(process.argv[3] || 3000); // drop boot + cold first render
const { nodes, samples, timeDeltas, startTime, endTime } = prof;

const byId = new Map();
for (const n of nodes) byId.set(n.id, n);
const parent = new Map();
for (const n of nodes) if (n.children) for (const c of n.children) parent.set(c, n.id);

// Walk samples in time order; only keep those after skipMs of cumulative wall time.
let cum = 0;
const self = new Map();         // steady-state self time per node id (us)
let total = 0, idle = 0;
let firstTs = 0;
for (let i = 0; i < samples.length; i++) {
  const dt = timeDeltas[i] || 0;
  cum += dt;
  if (cum < skipMs * 1000) continue;       // still in boot/warmup window
  const id = samples[i];
  self.set(id, (self.get(id) || 0) + dt);
  total += dt;
  const n = byId.get(id);
  if (n && n.callFrame.functionName === '(idle)') idle += dt;
}
const active = total - idle;

const us = (n) => (n / 1000).toFixed(0) + 'ms';
const pA = (n) => ((n / active) * 100).toFixed(1) + '%';   // % of ACTIVE cpu time
const name = (n) => n.callFrame.functionName || '(anonymous)';
const short = (u) => { if (!u) return '(native)'; u = u.replace(/^file:\/\//, ''); const i = u.indexOf('/packages/gbif-org'); return i >= 0 ? u.slice(i + 18) : (u.startsWith('node:') ? u : u.replace(/.*\/node_modules\//, 'nm:')); };

// self by function
const byFn = new Map();
for (const [id, t] of self) {
  const n = byId.get(id); if (!n) continue;
  const cf = n.callFrame;
  const k = `${cf.functionName}__${cf.url}:${cf.lineNumber}`;
  const cur = byFn.get(k) || { self: 0, fn: cf.functionName, url: cf.url, line: cf.lineNumber };
  cur.self += t; byFn.set(k, cur);
}

console.log('=== STEADY-STATE PROFILE (skipped first ' + skipMs + 'ms of boot/warmup) ===');
console.log('wall captured total :', us(endTime - startTime));
console.log('steady-state window :', us(total), '(active CPU', us(active) + ',', 'idle', us(idle) + ')');
console.log('CPU utilisation     :', ((active / total) * 100).toFixed(1) + '% busy');

// Category buckets
const cats = {};
const add = (k, t) => cats[k] = (cats[k] || 0) + t;
for (const v of byFn.values()) {
  const u = v.url || '', fn = v.fn || '';
  if (fn === '(idle)') continue;
  if (fn === '(garbage collector)') add('GC (garbage collector)', v.self);
  else if (fn === '(program)') add('(program) v8/native dispatch', v.self);
  else if (/react-dom|react-server-dom/.test(u)) add('react-dom (renderToString)', v.self);
  else if (/react-intl|@formatjs|intl-messageformat|\/intl-/.test(u)) add('react-intl / formatjs', v.self);
  else if (/\/react\/|scheduler/.test(u)) add('react core / scheduler', v.self);
  else if (/graphql\//.test(u)) add('graphql (parse/validate)', v.self);
  else if (/@apollo|apollo-client/.test(u)) add('apollo client', v.self);
  else if (/react-router/.test(u)) add('react-router', v.self);
  else if (/\/dist\/gbif\/server\/|\/src\//.test(u)) add('APP code (src/dist entry.server)', v.self);
  else if (/node_modules/.test(u)) add('other node_modules', v.self);
  else if (/JSON/.test(fn)) add('JSON.parse/stringify', v.self);
  else if (/RegExp|exec|match|replace|test/i.test(fn) && !u) add('regexp/string builtins', v.self);
  else if (!u || u.startsWith('node:')) add('node builtins / native', v.self);
  else add('uncategorised', v.self);
}
console.log('\n=== STEADY-STATE CPU BY CATEGORY (% of active CPU) ===');
for (const [k, t] of Object.entries(cats).sort((a, b) => b[1] - a[1]))
  console.log(`${pA(t).padStart(7)} ${us(t).padStart(8)}  ${k}`);

console.log('\n=== TOP 45 FUNCTIONS BY SELF TIME (% of active CPU) ===');
const top = [...byFn.values()].filter(v => v.fn !== '(idle)').sort((a, b) => b.self - a.self).slice(0, 45);
for (const v of top)
  console.log(`${pA(v.self).padStart(7)} ${us(v.self).padStart(8)}  ${(v.fn || '(anonymous)').slice(0, 42).padEnd(42)} ${short(v.url)}:${v.line + 1}`);

// SSR frame presence check
console.log('\n=== SANITY: SSR hot-path frames present? ===');
for (const re of [/renderToString|renderToPipeableStream/i, /react-dom/, /formatMessage|react-intl|@formatjs/i, /graphql/, /apollo/i, /matchRoutes|react-router/i, /JSON/]) {
  let s = 0, hits = 0;
  for (const v of byFn.values()) if (re.test(`${v.fn} ${v.url}`)) { s += v.self; hits++; }
  console.log(`  ${String(hits).padStart(4)} fns  ${us(s).padStart(8)} (${pA(s)})  ${re}`);
}
