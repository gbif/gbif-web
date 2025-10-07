/**
 * Authentication module for GBIF MCP Server
 *
 * Currently uses a hardcoded API key for validation.
 * Future implementation will validate against user profiles.
 */

const VALID_API_KEY = 'gbif_mcpkey_1234';

export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Validates an API key
 * @param {string} apiKey - The API key to validate
 * @returns {boolean} - True if valid, throws AuthenticationError if invalid
 * @throws {AuthenticationError} - If API key is missing or invalid
 */
export function validateApiKey(apiKey) {
  if (!apiKey) {
    throw new AuthenticationError(
      'API key is required. Please provide a valid GBIF MCP API key. ' +
      'Set the API key in your MCP client configuration or pass it when initializing the connection.'
    );
  }

  if (apiKey !== VALID_API_KEY) {
    throw new AuthenticationError(
      'Invalid API key provided. Please check your API key and try again. ' +
      'The API key should be in the format: gbif_mcpkey_xxxx'
    );
  }

  return true;
}

/**
 * Extracts API key from MCP request metadata
 * @param {object} request - The MCP request object
 * @returns {string|null} - The API key or null if not found
 */
export function extractApiKey(request) {
  // Check for API key in request metadata
  // MCP clients can pass API keys through different mechanisms
  return request?.params?._meta?.apiKey ||
         request?._meta?.apiKey ||
         process.env.GBIF_MCP_API_KEY ||
         null;
}