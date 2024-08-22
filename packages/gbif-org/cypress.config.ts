import { defineConfig } from 'cypress';
import { getEnv } from './env';

const env = getEnv();

export default defineConfig({
  e2e: {
    // Can be overriden by CYPRESS_BASE_URL env variable
    baseUrl: env.PUBLIC_BASE_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
