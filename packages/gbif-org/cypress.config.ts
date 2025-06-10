import { defineConfig } from 'cypress';
import { getEnv } from './env';
import viteConfigFn from './gbif/vite.config';

const env = getEnv();
const viteConfig = viteConfigFn({ command: 'serve' });

export default defineConfig({
  e2e: {
    // Can be overriden by CYPRESS_BASE_URL env variable
    baseUrl: env.PUBLIC_BASE_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
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
