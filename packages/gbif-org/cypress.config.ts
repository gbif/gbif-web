import { defineConfig } from 'cypress';
import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), ['PUBLIC_']);
// Environment variables takes priority over .env file
const PUBLIC_TEST_BASE_URL = process.env.PUBLIC_TEST_BASE_URL ?? env.PUBLIC_TEST_BASE_URL

export default defineConfig({
  e2e: {
    baseUrl: PUBLIC_TEST_BASE_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
