// Load driver for the gbif-org SSR taxon page.
//
// Fires requests at a configurable rate against /taxon/<id>, varying the id on every request so
// no downstream/CDN cache can ever be hit and every request forces a fresh server-side render.
// Prints latency percentiles + throughput — the benchmark to track against.
//
// Configuration via env vars:
//   TARGET       base url of the SSR server            (default http://localhost:3000)
//   RPS          target requests per second (overall)  (default 20)
//   MAX          if "1" (or RPS=0): uncapped max-throughput mode (default off)
//   DURATION     test duration in seconds              (default 20)
//   CONNECTIONS  concurrent connections                (default 10)
//   ID_MIN       lowest taxon id                       (default 1000000)
//   ID_MAX       highest taxon id                      (default 9999999)
//   PATH_PREFIX  locale prefix, e.g. "/es"             (default "" = English)
//
// Example:  RPS=50 DURATION=30 npm run loadtest:run
// Max throughput:  MAX=1 CONNECTIONS=50 DURATION=30 npm run loadtest:run

import autocannon from 'autocannon';

const TARGET = process.env.TARGET || 'http://localhost:3000';
const RPS = parseInt(process.env.RPS || '20', 10);
const DURATION = parseInt(process.env.DURATION || '20', 10);
const CONNECTIONS = parseInt(process.env.CONNECTIONS || '10', 10);
const ID_MIN = parseInt(process.env.ID_MIN || '1000000', 10);
const ID_MAX = parseInt(process.env.ID_MAX || '9999999', 10);
const PATH_PREFIX = process.env.PATH_PREFIX || '';
// Uncapped max-throughput mode: drop overallRate so autocannon runs closed-loop at full
// CONNECTIONS and the reported throughput reflects the max sustainable req/s (server -> ~100% busy).
const MAX = process.env.MAX === '1' || RPS === 0;

const randomId = () => ID_MIN + Math.floor(Math.random() * (ID_MAX - ID_MIN + 1));

console.log(
  `Load test -> ${TARGET}${PATH_PREFIX}/taxon/<id>\n` +
    `  rate=${MAX ? 'UNCAPPED (max)' : `${RPS} req/s`}  duration=${DURATION}s  ` +
    `connections=${CONNECTIONS}  ids=[${ID_MIN}..${ID_MAX}]\n`
);

const instance = autocannon(
  {
    url: TARGET,
    connections: CONNECTIONS,
    duration: DURATION,
    // In max mode, omit overallRate so connections fire as fast as the server allows.
    ...(MAX ? {} : { overallRate: RPS }), // otherwise pace total req/s regardless of latency
    // Vary the path on every single request so each one is a unique, uncacheable taxon URL.
    requests: [
      {
        method: 'GET',
        setupRequest: (req) => {
          req.path = `${PATH_PREFIX}/taxon/${randomId()}`;
          return req;
        },
      },
    ],
  },
  (err, result) => {
    if (err) {
      console.error('Load test failed:', err);
      process.exitCode = 1;
      return;
    }
    printSummary(result);
  }
);

// Live progress bar in the terminal.
autocannon.track(instance, { renderProgressBar: true, renderResultsTable: false });

function ms(n) {
  return `${Number(n).toFixed(1)} ms`;
}

function printSummary(r) {
  const codes = {
    '1xx': r['1xx'] || 0,
    '2xx': r['2xx'] || 0,
    '3xx': r['3xx'] || 0,
    '4xx': r['4xx'] || 0,
    '5xx': r['5xx'] || 0,
  };
  console.log('\n========== SSR taxon-page benchmark ==========');
  console.log(`requests sent : ${r.requests.sent}`);
  console.log(`completed     : ${r.requests.total}`);
  console.log(`throughput    : ${r.requests.average.toFixed(1)} req/s avg`);
  console.log('');
  console.log('latency (full request, ms)');
  console.log(`  min   : ${ms(r.latency.min)}`);
  console.log(`  mean  : ${ms(r.latency.mean)}`);
  console.log(`  p50   : ${ms(r.latency.p50)}`);
  console.log(`  p90   : ${ms(r.latency.p90)}`);
  console.log(`  p99   : ${ms(r.latency.p99)}`);
  console.log(`  p99.9 : ${ms(r.latency.p99_9 ?? r.latency.p99)}`);
  console.log(`  max   : ${ms(r.latency.max)}`);
  console.log('');
  console.log(
    `status codes  : 2xx=${codes['2xx']}  3xx=${codes['3xx']}  4xx=${codes['4xx']}  5xx=${codes['5xx']}`
  );
  console.log(`errors        : ${r.errors}   timeouts: ${r.timeouts}   non-2xx: ${r.non2xx}`);
  console.log('==============================================');
  if (codes['2xx'] === 0) {
    console.warn(
      '\nWARNING: no 2xx responses. Is the SSR server running and built with .env.loadtest? ' +
        'Is the mock server up on :4010 with recordings?'
    );
  } else if (codes['5xx'] > 0 || r.non2xx > 0) {
    console.warn('\nNOTE: some responses were not 2xx — check server logs / recordings coverage.');
  }
}
