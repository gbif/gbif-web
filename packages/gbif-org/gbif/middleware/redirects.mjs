/**
 For redirects to have pretty urls for menu items and selected items. Could also support legacy urls
 */
import { camelCase } from 'change-case';
import querystring from 'querystring';
import redirectList from '../../redirects.json' with { type: "json" };

// These cannot be added to redirects while portal16 is still our main site
// as they would interfere with the occurrence paths
const newRedirects = [
  { incoming: '/occurrence/gallery', target: '/occurrence/search?view=gallery' },
  { incoming: '/occurrence/map', target: '/occurrence/search?view=map' },
  { incoming: '/occurrence/charts', target: '/occurrence/search?view=dashboard' },
  { incoming: '/occurrence/download', target: '/occurrence/search?view=download' },
];



const redirectTable = [...redirectList, ...newRedirects].reduce((acc, curr) => {
  acc[curr.incoming] = curr.target;
  return acc;
}, {});

function handleRedirects(req, res, next) {
  // remove query params from url first
  const splitted = req.url.split('?');
  let redirectTo = redirectTable[splitted[0]];
  if (redirectTo) {
    let redirectSplitted = redirectTo.split('?');
    // there may be parameters in target which should be merged with the incoming parameters
    let parameters = redirectSplitted[1];
    let redirectUrl = redirectSplitted[0];
    redirectTo = redirectUrl + '?' + fixParameterCasing(splitted[1], parameters);
    //console.log('Redirecting:', req.url, 'to:', redirectTo);
  }

  if (redirectTo) {
    res.redirect(302, redirectTo);
  } else {
    next();
  }
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

export default handleRedirects;
