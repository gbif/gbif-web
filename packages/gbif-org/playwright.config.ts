import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'node:path';
import { E2E_ENV_DIR, GBIF_E2E_DIST, GBIF_PORT, HP_PORT, MOCK_PORT, mockEnv } from './e2e/env.mjs';

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
  forbidOnly: !!process.env.CI,
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
      // Client-only hosted-portal library mounted in a site with every data page enabled.
      name: 'hp-all-entities',
      testDir: './e2e/specs/hp',
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
      command: 'node e2e/mock/upstream.mjs',
      url: `http://localhost:${MOCK_PORT}/__mock/health`,
      env: { E2E_MODE: process.env.E2E_MODE ?? 'replay' },
      reuseExistingServer: false,
      stdout: 'pipe',
    },
    {
      // server.js loads .env from its working directory.
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
      env: { HP_SITE: 'all-entities', PORT: String(HP_PORT) },
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
