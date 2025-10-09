export class GBIFAPIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'GBIFAPIError';
    this.status = status;
    this.details = details;
  }
}

export class ApiClient {
  constructor(baseUrl, config = {}) {
    this.baseUrl = baseUrl;
    this.apiKey = config.apiKey || null;
    this.defaultTimeout = config.timeout || 10000;
    this.headers = {
      'User-Agent': 'GBIF MCP server',
      Accept: 'application/json',
      ...config.headers,
    };
  }

  async get(endpoint, params = {}, options = {}) {
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

    // Add API key if configured
    if (this.apiKey) {
      url.searchParams.append('apiKey', this.apiKey);
    }

    const timeout = options.timeout || this.defaultTimeout;
    const headers = { ...this.headers, ...options.headers };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
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
        throw new GBIFAPIError(
          'Request timeout',
          408,
          'The request took too long to complete',
        );
      }
      if (error instanceof GBIFAPIError) {
        throw error;
      }
      throw new GBIFAPIError('Network error', 0, error.message);
    }
  }

  async post(endpoint, body = {}, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const timeout = options.timeout || this.defaultTimeout;
    const headers = {
      ...this.headers,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
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
        throw new GBIFAPIError(
          'Request timeout',
          408,
          'The request took too long to complete',
        );
      }
      if (error instanceof GBIFAPIError) {
        throw error;
      }
      throw new GBIFAPIError('Network error', 0, error.message);
    }
  }
}
