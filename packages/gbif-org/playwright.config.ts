import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'node:path';
import { E2E_ENV_DIR, GBIF_E2E_DIST, GBIF_PORT, HP_PORT, MOCK_PORT, mockEnv } from './e2e/env.mjs';

// Starts the mock, the gbif.org server on the e2e build and two hosted-portal sites, then runs the
// specs in three projects against them. globalSetup and globalTeardown wrap the run. See
// e2e/README.md for how the pieces fit together.

// The server refuses to boot without these; the e2e build never authenticates anyone.
const dummySecrets = {
  JWT_SECRET: 'e2e',
  GRAPHQL_JWT_SECRET: 'e2e',
  APP_KEY: 'e2e',
  APP_SECRET: 'e2e',
  ENCRYPTION_KEY: '0123456789abcdef0123456789abcdef',
  GITHUB_CLIENT_ID: 'e2e',
  GITHUB_CLIENT_SECRET: 'e2e',
  GOOGLE_CLIENT_ID: 'e2e',
  GOOGLE_CLIENT_SECRET: 'e2e',
  ORCID_CLIENT_ID: 'e2e',
  ORCID_CLIENT_SECRET: 'e2e',
  DOMAIN: `http://localhost:${GBIF_PORT}`,
  DISABLE_HTTPS_UPGRADE: 'true',
};

export default defineConfig({
  testDir: './e2e/specs',
  outputDir: './e2e/.results',
  globalSetup: './e2e/globalSetup.ts',
  globalTeardown: './e2e/globalTeardown.ts',
  fullyParallel: true,
  // A test.only re-record would run a few tests and prune every other recording.
  forbidOnly: !!process.env.CI || process.env.E2E_PRUNE === '1',
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'gbif',
      testDir: './e2e/specs/gbif',
      use: { baseURL: `http://localhost:${GBIF_PORT}` },
    },
    {
      // Client-only hosted-portal library in a site with every page a portal may enable.
      name: 'hp-full',
      testDir: './e2e/specs/hp-full',
      use: { baseURL: `http://localhost:${HP_PORT}` },
    },
    {
      // Only occurrence pages enabled, scoped to Denmark.
      name: 'hp-occurrence-only',
      testDir: './e2e/specs/hp-occurrence-only',
      use: { baseURL: `http://localhost:${HP_PORT + 1}` },
    },
  ],
  webServer: [
    {
      // Inherits E2E_MODE, E2E_UPSTREAM and the other E2E_* variables from this process.
      command: 'node e2e/mock/upstream.mjs',
      url: `http://localhost:${MOCK_PORT}/__mock/health`,
      reuseExistingServer: false,
      stdout: 'pipe',
    },
    {
      // server.js loads .env from its working directory, so e2e/ (which has none) keeps a
      // developer's .env out. It also writes its logs to e2e/logs/ (git-ignored).
      command: `node "${resolve('gbif/server.js')}"`,
      cwd: E2E_ENV_DIR,
      url: `http://localhost:${GBIF_PORT}/robots.txt`,
      env: {
        ...mockEnv(`http://localhost:${GBIF_PORT}`),
        ...dummySecrets,
        NODE_ENV: 'production',
        PORT: String(GBIF_PORT),
        GBIF_DIST_DIR: resolve(GBIF_E2E_DIST),
      },
      reuseExistingServer: false,
    },
    {
      command: 'node e2e/hp-sites/server.mjs',
      url: `http://localhost:${HP_PORT}/gbif-lib.js`,
      env: { HP_SITE: 'full', PORT: String(HP_PORT) },
      reuseExistingServer: false,
    },
    {
      command: 'node e2e/hp-sites/server.mjs',
      url: `http://localhost:${HP_PORT + 1}/gbif-lib.js`,
      env: { HP_SITE: 'occurrence-only', PORT: String(HP_PORT + 1) },
      reuseExistingServer: false,
    },
  ],
});
