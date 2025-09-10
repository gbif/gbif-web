import { publicEnv } from '../../envConfig.mjs';
import { fetchWithRetry } from '../auth/utils.mjs';
import { apiConfig } from './pager.mjs';

async function getSitemap(url, replaceText, replaceWith) {
  let options = {
    url: url,
    method: 'GET',
    fullResponse: true,
  };
  let response = await fetchWithRetry(url, options);
  if (!response.ok) {
    throw response;
  }
  const body = await response.text();
  return body.replace(new RegExp(replaceText, 'g'), replaceWith);
}

function getSpeciesSiteMapIndex() {
  return getSitemap(
    apiConfig.base.url + '/sitemap/species',
    apiConfig.base.url,
    publicEnv.PUBLIC_BASE_URL
  );
}

function getSpeciesSiteMap(no) {
  return getSitemap(apiConfig.base.url + '/sitemap/species/' + no + '.txt', 'www', 'www');
}

export default {
  getSpeciesSiteMapIndex: getSpeciesSiteMapIndex,
  getSpeciesSiteMap: getSpeciesSiteMap,
};
