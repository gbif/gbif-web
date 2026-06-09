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

function getTaxonSiteMapIndex() {
  return getSitemap(
    apiConfig.apiv2.url + '/sitemap/taxon',
    apiConfig.apiv2.url,
    publicEnv.PUBLIC_BASE_URL
  );
}

function getTaxonSiteMap(no) {
  return getSitemap(apiConfig.apiv2.url + '/sitemap/taxon/' + no + '.txt', 'www', 'www');
}

export default {
  getTaxonSiteMapIndex: getTaxonSiteMapIndex,
  getTaxonSiteMap: getTaxonSiteMap,
};
