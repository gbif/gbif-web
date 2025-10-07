// import dotenv from 'dotenv';
// dotenv.config(); // Load environment variables from .env file

export const config = {
  baseUrl: 'https://api.gbif.org/v1',
  esBaseUrl: 'https://hp-search.gbif.org',
  userAgent: 'GBIF-MCP-Server/1.0',
  defaultLimit: 20,
  maxLimit: 300,
  timeout: 30000, // 30 seconds
  // Future: apiKey support
  // esApiKey: process.env.ES_API_KEY,
};
