import { defineConfig } from 'cypress';
import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), ['PUBLIC_']);

export default defineConfig({
  e2e: {
    baseUrl: env.PUBLIC_BASE_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
