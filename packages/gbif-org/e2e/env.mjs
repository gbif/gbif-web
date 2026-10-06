// PUBLIC_* values baked into the e2e builds. Vite inlines them at build time, so the mock build
// and a live build are different builds. Keys are production GBIF values.

export const MOCK_PORT = 4020;
export const GBIF_PORT = 3100;
export const HP_PORT = 3200;

export const GBIF_E2E_DIST = 'dist/e2e/gbif';
export const HP_E2E_DIST = 'dist/e2e/hp';

const constants = {
  PUBLIC_GBIF_ORG: 'https://www.gbif.org',
  PUBLIC_GRSCICOLL: 'https://scientific-collections.gbif.org',
  PUBLIC_CHECKLIST_BANK_WEBSITE: 'https://www.checklistbank.org',
  PUBLIC_REGISTRY: 'https://registry.gbif.org',
  PUBLIC_ENABLED_LANGUAGES: 'en,es,fr,ar,da',
  PUBLIC_CLASSIC_BACKBONE_KEY: 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c',
  PUBLIC_DEFAULT_CHECKLIST_KEY: 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c',
  PUBLIC_COL_CHECKLIST_KEY: '7ddf754f-d193-4cc9-b351-99906754a03b',
  PUBLIC_SUPPORTED_CHECKLISTS:
    'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c,7ddf754f-d193-4cc9-b351-99906754a03b',
  PUBLIC_CHECKLIST_KEY_FOR_CLUSTERING: 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c',
  PUBLIC_TEST_SITE: 'false',
};

export function mockEnv(baseUrl) {
  const mock = `http://localhost:${MOCK_PORT}`;
  return {
    ...constants,
    PUBLIC_BASE_URL: baseUrl,
    PUBLIC_GRAPHQL_ENDPOINT: `${mock}/graphql`,
    PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT: `${mock}/translations`,
    PUBLIC_FORMS_ENDPOINT: `${mock}/forms`,
    PUBLIC_FEEDBACK_ENDPOINT: `${mock}/forms`,
    PUBLIC_CONTENT_SEARCH: `${mock}/content`,
    PUBLIC_WEB_UTILS: `${mock}/unstable-api`,
    PUBLIC_API: `${mock}/api`,
    PUBLIC_API_V1: `${mock}/api/v1`,
    PUBLIC_API_V2: `${mock}/api/v2`,
    PUBLIC_TILE_API: `${mock}/tile`,
    PUBLIC_ANALYTICS_FILES_URL: `${mock}/analytics-files`,
  };
}
