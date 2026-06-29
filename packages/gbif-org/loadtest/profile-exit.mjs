// Preloaded (via `node --import`) ONLY by the `start:profile` script — never during normal
// `npm start`. The V8 CPU profiler (`--cpu-prof`) writes its `.cpuprofile` to disk on a clean
// process exit, but a default SIGINT/SIGTERM terminates the process before that happens, so no
// profile is produced. Converting the signal into a clean `process.exit(0)` lets the profiler
// flush. This keeps gbif/server.js free of any profiling-only concerns.
function shutdown() {
  // Clean exit triggers the --cpu-prof writer.
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
