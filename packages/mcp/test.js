import { GBIF_ES_APIClient, prepareParams } from './es-api-client.js';
const esApiClient = new GBIF_ES_APIClient();

const args = {
  year: '~2020',
  limit: 1,
};

async function run() {
  const { params, uiLink } = prepareParams(args);
  console.log(uiLink);
  console.log(params);
  const data = await esApiClient.get('/occurrence', params);
  console.log(data);
}

run();
