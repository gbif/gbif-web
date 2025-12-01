import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // baseUrl is overridden by CYPRESS_baseUrl env variable in docker-compose
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});