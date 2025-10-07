import { GBIFAPIError } from './api-client.js';
import { config } from './config.js';

export class GBIF_ES_APIClient {
  constructor() {
    this.baseUrl = config.esBaseUrl;
    this.apiKey = 'something'; // dummy key, we need a way to distribute a real key if we want to use the ES API
    this.headers = {
      'User-Agent': config.userAgent,
      Accept: 'application/json',
    };
  }

  async get(endpoint, params = {}) {
    console.log(endpoint);
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Handle arrays by appending the same key multiple times
        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v !== null && v !== undefined) {
              url.searchParams.append(key, v);
            }
          });
        } else {
          url.searchParams.append(key, value);
        }
      }
    });
    url.searchParams.append('apiKey', this.apiKey);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new GBIFAPIError(
          `GBIF API request failed: ${response.statusText}`,
          response.status,
          errorText,
        );
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new GBIFAPIError('Request timeout', 408, 'The request took too long to complete');
      }
      if (error instanceof GBIFAPIError) {
        throw error;
      }
      throw new GBIFAPIError('Network error', 0, error.message);
    }
  }

  async post(endpoint, data) {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new GBIFAPIError(
          `GBIF API request failed: ${response.statusText}`,
          response.status,
          errorText,
        );
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new GBIFAPIError('Request timeout', 408, 'The request took too long to complete');
      }
      if (error instanceof GBIFAPIError) {
        throw error;
      }
      throw new GBIFAPIError('Network error', 0, error.message);
    }
  }

  async fetchText(url) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': config.userAgent },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new GBIFAPIError(
          `Failed to fetch: ${response.statusText}`,
          response.status,
          await response.text(),
        );
      }

      return await response.text();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new GBIFAPIError('Request timeout', 408, 'The request took too long to complete');
      }
      if (error instanceof GBIFAPIError) {
        throw error;
      }
      throw new GBIFAPIError('Network error', 0, error.message);
    }
  }
}

export function prepareParams(args) {
  const params = {
    taxonKey: args.taxonKey,
    scientificName: args.scientificName,
    country: args.country,
    year: args.year,
    decimalLatitude: args.decimalLatitude,
    decimalLongitude: args.decimalLongitude,
    month: args.month,
    datasetKey: args.datasetKey,
    basisOfRecord: args.basisOfRecord,
    hasCoordinate: args.hasCoordinate,
    hasGeospatialIssue: args.hasGeospatialIssue,
    size: Math.min(args.limit ?? config.defaultLimit, config.maxLimit),
    from: args.offset ?? 0,
    facet: args.facet,
    facetLimit: args.facetLimit,
    facetOffset: args.facetOffset,
  };
  // parse parameter values for negated terms and then remove the ~ and add a negation flag ! in fromt of the parameter name
  Object.keys(params).forEach((key) => {
    const value = params[key];
    // remove values that start with ~and put them into a negated parameter. Leave values that do not start with ~~
    // if the value is an array, process each value in the array
    if (Array.isArray(value)) {
      const negatedValues = value.filter((v) => typeof v === 'string' && v.startsWith('~'));
      if (negatedValues.length > 0) {
        params[`!${key}`] = negatedValues.map((v) => v.substring(1));
        params[key] = value.filter((v) => !negatedValues.includes(v));
        if (params[key].length === 0) {
          delete params[key];
        }
      }
    } else if (typeof value === 'string' && value.startsWith('~')) {
      params[`!${key}`] = value.substring(1);
      delete params[key];
    }
  });

  const { size, from, limit, offset, facet, facetLimit, facetOffset, ...uiParams } = params;
  // construct a link to the gbif user interface with the same parameters for further exploration and downloads
  // start with the url https://demo.gbif.org/occurrence/search?
  // and repeat parameters that are arrays
  let uiLink = 'https://demo.gbif.org/occurrence/search?';
  Object.keys(uiParams).forEach((key) => {
    const value = uiParams[key];
    if (Array.isArray(value)) {
      value.forEach((v) => {
        uiLink += `${key}=${encodeURIComponent(v)}&`;
      });
    } else if (value !== undefined) {
      uiLink += `${key}=${encodeURIComponent(value)}&`;
    }
  });
  // add a note about the link to the response
  // remove trailing &
  uiLink = uiLink.replace(/&$/, '');
  return { params, uiLink };
}
