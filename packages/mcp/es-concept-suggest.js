import { GBIFAPIError } from './api-client.js';
import { config } from './config.js';

export class GBIF_ES_APIClient {
  constructor() {
    this.baseUrl = 'http://localhost:9200';
    this.headers = {
      'User-Agent': config.userAgent,
      Accept: 'application/json',
    };
  }

  async get({ q }) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      // should probably be post and boosted on sepecial fields and not including all
      const response = await fetch(`${this.baseUrl}/filter_values/_search?q=${q}`, {
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
}
