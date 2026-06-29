# SSR profiling findings — taxon page under load

Current profile: `loadtest/profiles/CPU.20260625.152937.94687.0.001.cpuprofile`
(60 s load, **91 % CPU-busy**, captured after findings **#1** and **#4** below landed).

**Bottom line as of 2026-06-25:** the translation-dictionary cost (#1) and the per-request template
read (#4) are **resolved**. Max throughput is **~190–200 req/s** (was ~96), taxon body **127 KB**
(was 592 KB). The single dominant per-request cost is now **react-router path matching over a
22×-duplicated route table** (≈ 26 % of active CPU) — **finding #2**, below. The actual React
render is only 7.3 %.

---

## 1. Current steady-state breakdown

Process is **91 % CPU-busy**; module-loading is 0 % from the 5 s timeline bin onward, so steady
state is read with a 10 s warmup skip:

```
node loadtest/ssr-analyze.mjs loadtest/profiles/CPU.20260625.152937.94687.0.001.cpuprofile 10000
```

| Frame / bucket | % active CPU | What it is |
|---|---:|---|
| **react-router path matching** (`@remix-run/router` + `react-router-dom`) | **22.4 %** | `compilePath` 5.8, `joinPaths` 2.6, `matchPath` 2.0, `flattenRoute` 1.1, `computeScore` 0.7, `safelyDecodeURI` 0.6, `normalizePathname` 0.6, `matchRoutes`/`matchRouteBranch`/`rankRouteBranches` ~1.2, … |
| ↳ compiled path **RegExp** objects (native) | **3.8 %** | the regexes `compilePath` builds — effectively part of the above ⇒ route matching ≈ **26 %** |
| `react-dom` `renderToString` | 7.3 % | the real render — **not** the problem |
| response writes (`writev`/`writevGeneric`/`writeBuffer`/`writeLatin1`) | 6.4 % | symptom of body size; 127 KB now, mostly irreducible |
| react-intl / formatjs (`formatToParts`, `IntlMessageFormat.resolveLocale`) | 4.6 % | cacheable (compiled-message + resolved-locale cache) |
| undici JSON parse (upstream GraphQL/REST bodies) | 4.4 % | inherent to fetching data |
| GC | 4.3 % | allocation churn |
| `react-jsx-runtime` (`q`) | 3.5 % | element creation during render |
| `StaticRouterProvider` self (hydration script) | 2.8 % | residual: serialize small child-route loaderData + emit hydration script |
| `react-helmet-async` (head/meta) | 2.1 % | |
| lodash `baseMergeDeep` | 1.6 % | config/options merge |
| tailwind-merge | 0.9 % | className merging in render |

Everything ≤ ~5 % (renderToString, writes, undici parse, GC, jsx, helmet) is largely **inherent** to
"render a fresh page + fetch its data" and is not worth chasing until route matching is dealt with.

---

## 2. The bottleneck — route table is 22× duplicated and matched per request (≈ 26 %)

`applyI18nPlugin` (`src/reactRouterPlugins/i18n/plugin.tsx:30`) builds a root route **per language**
via `config.languages.map(...)` and clones the **entire** route tree under each
(`children: localizeRouteIds(routes, …)`). There are **22** languages
(en, nonsense, rtltest, danglish, fr, it, es, de, ar, zh, zh-tw, ru, cs, ja, pl, pt, uk, he, da, nl,
ko, fa), so the route table is a 22× cross-product.

Every request then `flattenRoutes` → `compilePath`-es paths over that full 22× table, and the URL is
matched **twice** per request — once in `query()` (`src/gbif/entry.server.tsx:21`) and again inside
`createStaticRouter` → `StaticRouterProvider`. The installed `@remix-run/router@1.11.0` /
`react-router-dom@6.18.0` have **no `compilePath` cache** (verified: no cache var in
`node_modules/@remix-run/router/dist/router.cjs.js`), so the same path regexes are rebuilt on every
request.

### Recommended next work (reward / risk order)

1. **Collapse the 22× route tree.** Replace the per-language cloned trees with a single optional
   `:locale?` segment, or strip the locale prefix in middleware *before* routing so the tree is
   matched once at 1× size. Cuts `flattenRoutes`/`computeScore`/`rankRouteBranches` ~22×. Larger
   change (touches `applyI18nPlugin` + locale resolution); biggest structural win, no dependency change.
2. **Avoid the double match.** `query()` and `createStaticRouter` both walk the tree per request;
   reuse the matches already in `context` for the router where the API allows.
3. **Cache intl** (~4.6 %). Memoize compiled messages and resolved locale in the intl layer.

> **Do NOT bump react-router to chase this.** The `compilePath`/`matchRoutes` cache that would help
> here does **not** exist in any react-router **6.x** release — it is a **react-router v7.15.0+**
> feature. We measured the 6.x bump; see §2a. The only paths to the cache are the structural fixes
> above or a full v7 migration.

---

## 2a. Tested & rejected — react-router bump to latest 6.x (6.18.0 → 6.30.4)

An earlier version of this doc (the old finding #5) claimed a version bump would add an LRU
`compilePath` cache and remove ~9 % for near-zero risk. **That was wrong and unverified.** We
verified the source and then measured the bump end-to-end. **Result: no benefit, plus a behavioral
regression — reverted back to 6.18.0.**

### Why it can't help (verified, not assumed)
- The installed `@remix-run/router@1.11.0` builds a fresh `RegExp` in `compilePath` and re-flattens
  in `matchRoutes` every call.
- The **latest 6.x** (`react-router-dom@6.30.4` → `react-router@6.30.4` → `@remix-run/router@1.23.3`)
  is **identical in this respect** — checked directly against the published `1.23.3`
  `dist/router.cjs.js`: `compilePath`, `flattenRoutes`, and `matchRoutes` have **no cache/memoization**.
- The path-compilation / route-branch caching optimization landed only in **react-router v7.15.0+**
  (after the package collapse that absorbed `@remix-run/router` into `react-router`). There is no
  backport to 6.x.

### Measured (same harness, 50 conns, MAX mode)
| metric | BEFORE 6.18.0 | AFTER 6.30.4 |
|---|---:|---:|
| throughput (best of runs) | **211 req/s** | 188–196 req/s |
| latency mean | 235 ms | ~253–263 ms |
| route-matching CPU (steady state) | `compilePath` 5.8 %, `matchPath` 2.0 %, `joinPaths` 2.6 %; bucket ≈ **22 %** | `compilePath` 5.3 %, `matchPath` 2.0 %, `joinPaths` 1.7 %; bucket ≈ **22 %** |

Profiles: BEFORE `CPU.20260625.152937.94687…`, AFTER `CPU.20260625.160848.36133…` (both 91 % / 90 %
CPU-busy, 10 s warmup skipped). **The route-matching frames are unchanged** — exactly as the source
review predicted. The throughput delta is within (or slightly worse than) run-to-run noise; the bump
gives **no route-matching win**.

### Behavioral regression found in 6.x (the reason to actively avoid it)
`react-router-dom@6.30.4`'s `createStaticHandler().query()` propagates **client disconnects** as a
thrown `query() call aborted` (`throwStaticHandlerAbortedError`). Every request that is in-flight
when the client goes away now surfaces as a **500 + error-level log** in `gbif/server.js`'s render
catch. Under load this fires in a burst whenever connections are torn down (and once took the SSR
process down under abrupt 50-connection teardown). `6.18.0` does not do this. Adopting 6.x would
therefore require explicitly swallowing the abort in `entry.server.tsx` / `createFetchRequest`.

Also required by the bump (and reverted with it): `unstable_useBlocker` was renamed to the stable
`useBlocker` in 6.20 — `src/routes/tools/_shared/useToolUnsavedGuard.ts` had to change its import.

**Conclusion:** the 6.x bump was reverted. Pursue finding #1 in §2 (collapse the route tree) instead;
the `compilePath` cache is only reachable via a (large, breaking) react-router **v7** migration.

---

## 3. Resolved findings (history)

### ✅ #1 — Translation dictionary embedded in every hydration payload (was ≈ 54 %)

The i18n loader used to return `{ messages: { ...messages, ...localeLanguage } }` (re-spreading a
**6,232-key**, ~438 KB dictionary per request), which landed in `loaderData` and was double-`JSON
.stringify`-ed + html-escaped by `StaticRouterProvider` into `window.__staticRouterHydrationData` on
**every** response. Loader spread (13.1 %) + serialize (20.4 %) + escape (2.4 %) + `byteLength`
(10 %) + write (8.6 %) ≈ **54 % of active CPU** went to shipping a static, per-locale dictionary
inline on every response.

**Fixed (committed):**
- **1c** (`ef71e2305`, "don't serialize and transmit translations as part of SSR") — the SSR render
  still gets messages via `MessagesProvider`, but they are kept **out** of react-router `loaderData`;
  only the tiny versioned `messagesPath` (~30 B) is inlined as
  `window.__I18N_MESSAGES_PATH__`, and the client fetches the cacheable per-locale file before
  hydration. Removed the serialize/escape/byte-length/write costs.
- **1a** (no-copy merge, folded into `loadMessages`) — `loadMessagesFromUrl` returns the cached
  message object **directly** when there are no custom overrides (gbif.org defines none), and
  memoizes the merge via a `WeakMap` keyed on the cached object when there are. Failure semantics
  preserved: a fallback load returns a fresh object that is never in `messageCache`, so it is never
  memoized and is retried next request. After this, `loadMessagesFromUrl` disappears from the
  profile entirely.

| metric (50 conns, 30 s, 0 errors) | BEFORE (inline dict) | AFTER 1c + 1a |
|---|---:|---:|
| max throughput | **96.2 req/s** | **~190–202 req/s (+100 %)** |
| latency mean | 515 ms | **~250 ms** |
| taxon response body | **591,605 B** | **127,343 B (−78 %)** |

CPU shift: `StaticRouterProvider` self 20.4 % → 2.8 %; `byteLength` 10 % → out of top frames;
`writev` 8.6 % → ~3.7 %; `htmlEscape` 2.4 % → ~0 %; the 6,232-key merge spread → gone.

### ✅ #4 — Per-request template read

`gbif/server.js` now caches the prod template in module scope
(`cachedProdTemplate ??= await fsp.readFile('dist/gbif/client/gbif/index.html', …)`), so it is read
once, not per request. (The residual ~3 % `server.js:165` frame is the SSR handler body itself — the
template `.replace()` chain + `res.end` — not a file read.)

---

## 4. Methodology / reproduce

- **Warmup:** skip **≥ 10 s** (this run) — or warm until module-loading hits 0 % in the timeline
  bins — before reading the steady-state breakdown. With only 3 s skipped the numbers are dominated
  by cold-start `import()` of route chunks. Earlier docs that named routing as cold-start cost were
  warmup-contaminated; the corrected, warm numbers are above.
- **Build for the load test** (renamed root `.env.loadtest` overlay; `--mode loadtest` is what makes
  Vite load it):
  ```
  cp loadtest/.env.loadtest ../../.env.loadtest
  npx vite build --config gbif/vite.config.ts --mode loadtest --ssrManifest
  npx vite build --config gbif/vite.config.ts --mode loadtest --outDir ./dist/gbif/server --ssr ./src/gbif/entry.server.tsx
  ```
- **Run it** (mock on :4010, SSR on :3000; `start:profile` for the profiled run):
  ```
  npm run loadtest:mock &
  npm run start:loadtest &              # or: npm run start:profile  (writes a .cpuprofile on SIGTERM/SIGINT)
  MAX=1 CONNECTIONS=50 DURATION=30 npm run loadtest:run
  ```
  > The profiler only flushes on a **clean** exit. Stop `start:profile` with `kill -TERM <pid>` /
  > Ctrl-C (`loadtest/profile-exit.mjs` turns the signal into `process.exit(0)`). `kill -9` produces
  > no profile.
- **Reproduce the steady-state table:**
  `node loadtest/ssr-analyze.mjs loadtest/profiles/CPU.20260625.152937.94687.0.001.cpuprofile 10000`
- **Justify the 10 s skip (module-loading ends at ~5 s):**
  `node loadtest/timeline.mjs loadtest/profiles/CPU.20260625.152937.94687.0.001.cpuprofile 5`
