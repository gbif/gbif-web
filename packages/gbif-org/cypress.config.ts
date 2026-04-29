import { defineConfig } from 'cypress';
import { getEnv } from './env';
import viteConfigFn from './gbif/vite.config';

const env = getEnv();
const viteConfig = viteConfigFn({
  command: 'serve',
  mode: '', // placeholder, not used in vite.config.ts
});

export default defineConfig({
  e2e: {
    // Can be overriden by CYPRESS_BASE_URL env variable
    baseUrl: env.PUBLIC_BASE_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      // Network page test — override via CYPRESS_networkKey / CYPRESS_networkTitle
      // or by placing a cypress.env.json file in the project root
      networkKey: '2b7c7b4f-4d4f-40d3-94de-c28b6fa054a6',
      networkTitle: 'Ocean Biodiversity Information System (OBIS)',
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig,
    },
  },
});
