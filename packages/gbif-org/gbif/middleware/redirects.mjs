/**
 For redirects to have pretty urls for menu items and selected items. Could also support legacy urls
 */
import { camelCase, snakeCase } from 'change-case';
import querystring from 'querystring';
import redirectList from '../../redirects.json' with { type: "json" };
import toolsRedirects from '../../src/gbif/toolsRedirects.js';

// Locale prefixes that have URL prefixes
const localePrefixes = [
  // Base locales (always available in all environments)
  'en',      // English (default)
  'ar',      // Arabic
  'zh',      // Chinese (Simplified)
  'fr',      // French
  'ru',      // Russian
  'es',      // Spanish
  'zh-tw',   // Chinese (Traditional)
  'cs',      // Czech
  'ja',      // Japanese
  'pl',      // Polish
  'pt',      // Portuguese
  'uk',      // Ukrainian
  'it'       // Italian
];


  const routesHandledInReactRouter = new Set(['article', 'composition', 'data-use', 'document', 'event', 'news', 'programme', 'project', 'tool'])


// Extract locale prefix from path if present
function extractLocalePrefix(path) {
  for (const locale of localePrefixes) {
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
      return { prefix: `/${locale}`, pathWithoutPrefix: path.slice(locale.length + 1) || '/' };
    }
  }
  return { prefix: '', pathWithoutPrefix: path };
}

// These cannot be added to redirects while portal16 is still our main site
// as they would interfere with the occurrence paths
const newRedirects = [
  { incoming: '/occurrence/gallery', target: '/occurrence/search?view=gallery' },
  { incoming: '/occurrence/map', target: '/occurrence/search?view=map' },
  { incoming: '/occurrence/charts', target: '/occurrence/search?view=dashboard' },
  { incoming: '/occurrence/download', target: '/occurrence/search?view=download' },

  { incoming: '/resource/search?contentType=literature', target: '/literature/search' },

  { incoming: '/the-gbif-network/africa', target: '/the-gbif-network' },
  { incoming: '/the-gbif-network/asia', target: '/the-gbif-network' },
  { incoming: '/the-gbif-network/europe', target: '/the-gbif-network' },
  { incoming: '/the-gbif-network/latin-america', target: '/the-gbif-network' },
  { incoming: '/the-gbif-network/north-america', target: '/the-gbif-network' },
  { incoming: '/the-gbif-network/oceania', target: '/the-gbif-network' },
  { incoming: '/the-gbif-network/participant-organisations', target: '/the-gbif-network' },
  { incoming: '/the-gbif-network/gbif-affiliates', target: '/the-gbif-network' },
  ...Object.keys(toolsRedirects).map(key => ({ incoming: key, target: toolsRedirects[key] })),
];



const redirectTable = [...redirectList, ...newRedirects].reduce((acc, curr) => {
  acc[curr.incoming] = curr.target;
  return acc;
}, {});

// Find redirects that match both path and specific query params
function findQueryParamRedirect(path, queryParams) {
  for (const [incoming, target] of Object.entries(redirectTable)) {
    const [incomingPath, incomingQuery] = incoming.split('?');
    if (incomingPath === path && incomingQuery) {
      const incomingParams = querystring.parse(incomingQuery);
      const allMatch = Object.entries(incomingParams).every(
        ([key, value]) => queryParams[key] === value
      );
      if (allMatch) {
        return { target, matchedParams: incomingParams };
      }
    }
  }
  return null;
}


function getRedirect(req, res, next) {
  // remove query params from url first
  const splitted = req.originalUrl.split('?');
  const pathOnly = splitted[0];
  const queryString = splitted[1];
  const queryParams = queryString ? querystring.parse(queryString) : {};

  // Extract locale prefix from path (e.g., /fr/occurrence/gallery -> prefix=/fr, pathWithoutPrefix=/occurrence/gallery)
  const { prefix: localePrefix, pathWithoutPrefix } = extractLocalePrefix(pathOnly);
  let redirectTo;

  // First, check for redirects that match path + specific query params (using path without locale prefix)
  const queryParamRedirect = findQueryParamRedirect(pathWithoutPrefix, queryParams);
  if (queryParamRedirect) {
    const { target, matchedParams } = queryParamRedirect;
    // Remove matched params, keep extras
    const remainingParams = { ...queryParams };
    Object.keys(matchedParams).forEach(key => delete remainingParams[key]);
    
    const [targetPath, targetQuery] = target.split('?');
    const targetParams = targetQuery ? querystring.parse(targetQuery) : {};
    const finalParams = { ...targetParams, ...remainingParams };
    const finalQueryString = querystring.stringify(finalParams);
    // Prepend locale prefix to target path
    redirectTo = finalQueryString ? `${localePrefix}${targetPath}?${finalQueryString}` : `${localePrefix}${targetPath}`;
  } else {
    // Fall back to path-only redirect lookup (using path without locale prefix)
    redirectTo = redirectTable[pathWithoutPrefix];
    
    if (redirectTo ) {
      let redirectSplitted = redirectTo.split('?');
      // there may be parameters in target which should be merged with the incoming parameters
      let parameters = redirectSplitted[1];
      let redirectUrl = redirectSplitted[0];
      // Prepend locale prefix to redirect URL
      redirectTo = localePrefix + redirectUrl + '?' + fixParameterCasing(queryString, parameters);
      //console.log('Redirecting:', req.url, 'to:', redirectTo);
    } else {
      // check for old query parameters needing casing fixes
      const { correctedQuery, different } = redirectOldQueries(req, res);
      if (different) {
        // Preserve locale prefix when redirecting for query casing fixes
        redirectTo = pathOnly + '?' + correctedQuery;
      }
    }
  }
  const basePath =  pathWithoutPrefix.split('/')?.[1]  // routesHandledInReactRouter
  return redirectTo;
}

function fixParameterCasing(str, parameters = '') {
  try {
    const params = querystring.parse(str);
    const defaultParams = parameters ? querystring.parse(parameters) : {};
    const allParams = { ...defaultParams, ...params };
    const correctedCaseParams = Object.fromEntries(
      Object.entries(allParams).map(([key, value]) => [camelCase(key), value])
    );
    // console.log(querystring.stringify(correctedCaseParams));
    return querystring.stringify(correctedCaseParams);
  } catch (error) {
    console.error('Error fixing parameter casing:', error);
  }
}

let re = /^[-,0-9]+/i;
function redirectOldQueries(req, res) {
  
  const [pathName, queryAsString] = req.url.split('?');
  const query = querystring.parse(queryAsString || '');
    // handle old query params
    let 
        camelQuery = {},
        different = false;
        
 
    Object.keys(query).forEach(key => {
        let camelKey = camelCase(key);
        camelQuery[camelKey] = query[key];
        different = different || key !== camelKey;
    });

    // the old site used display=map as a param to indicate a map view. map this to a route
    if (query.display == 'map') {
        delete camelQuery.display;
        camelQuery.view = 'map';
        different = true;
    }

    // the old site didn't use WKT, but only the coordinates and assumed polygon - this site uses wkt instead
    if (camelQuery.geometry) {
        let a = [].concat(camelQuery.geometry);
        camelQuery.geometry = a.map(function(e) {
            let startsWithNumber = e.match(re);
            if (startsWithNumber) {
                different = true;
                return 'POLYGON((' + e + '))';
            } else {
                return e;
            }
        });
    }

    // if the query has been rewritten then redirect with the normalized params
    
    return {
      correctedQuery: querystring.stringify(camelQuery),
      different: different
    };
}

export default getRedirect;
