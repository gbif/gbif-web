import { config } from './config.js';

export class GBIFAPIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'GBIFAPIError';
    this.status = status;
    this.details = details;
  }
}

export class GBIFAPIClient {
  constructor(apiKey = null) {
    this.baseUrl = config.baseUrl;
    this.apiKey = apiKey;
    this.headers = {
      'User-Agent': config.userAgent,
      Accept: 'application/json',
    };
  }

  async get(endpoint, params = {}) {
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
    console.error(url.searchParams);

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
