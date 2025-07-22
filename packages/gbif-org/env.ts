import { merge } from 'ts-deepmerge';
import { loadEnv } from 'vite';

const envFile = loadEnv('', process.cwd(), ['PUBLIC_']);
export const graphqlEndpoint = envFile.PUBLIC_GRAPHQL_ENDPOINT;

const requiredFields = [
  'PUBLIC_BASE_URL',
  'PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT',
  'PUBLIC_GRAPHQL_ENDPOINT',
  'PUBLIC_FORMS_ENDPOINT',
  'PUBLIC_CONTENT_SEARCH',
  'PUBLIC_WEB_UTILS',
  'PUBLIC_API_V1',
  'PUBLIC_API_V2',
  'PUBLIC_TILE_API',
  'PUBLIC_GBIF_ORG',
  'PUBLIC_GRSCICOLL',
  'PUBLIC_CHECKLIST_BANK_WEBSITE',
  'PUBLIC_API_KEY_MAPTILER',
  'PUBLIC_ENABLED_LANGUAGES',
  'PUBLIC_ANALYTICS_FILES_URL',
];
requiredFields.forEach((field) => {
  if (!envFile[field]) {
    throw new Error(`Missing required field in env: ${field}`);
  }
});

export function getEnv() {
  if (typeof window === 'undefined') {
    return merge(envFile, process.env);
  }

  return envFile;
}
