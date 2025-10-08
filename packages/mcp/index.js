#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { GBIFAPIClient, GBIFAPIError } from './api-client.js';
import { config } from './config.js';
import { CHART_GUIDE, SEARCH_GUIDE, parseResourceUri } from './resources.js';
import { validateApiKey, extractApiKey, AuthenticationError } from './auth.js';
import { GBIF_ES_APIClient, prepareParams } from './es-api-client.js';

const SERVER_NAME = 'gbif-mcp-server';
const SERVER_VERSION = '1.0.0';

const SERVER_INSTRUCTIONS = `This MCP server provides access to GBIF (Global Biodiversity Information Facility) biodiversity data.

⚠️  AUTHENTICATION REQUIRED: This server requires a valid API key to access GBIF data.
    Please configure your API key in your MCP client settings or set the GBIF_MCP_API_KEY environment variable.

Common workflow patterns:
1. To search by species name: Use species_match or species_search to get a taxonKey, then use that key in occurrence_search
2. To search by common/vernacular name: Use species_suggest with the common name to find species
3. To search occurrences: First obtain taxonKey via species tools, then use occurrence_search with filters
4. To download occurrence data: Use occurrence_search to preview results, then occurrence_download to initiate a download
5. Dataset keys can be obtained via dataset_search and used to filter occurrences

The GBIF API returns paginated results. Default limit is 20, maximum is 300 per request.`;

class GBIFMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
          resources: {
            subscribe: false,
            listChanged: false,
          },
        },
      },
    );

    this.apiClient = new GBIFAPIClient();
    this.esApiClient = new GBIF_ES_APIClient();
    this.setupHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'species_match',
          description:
            "Match a scientific name to GBIF's taxonomic backbone to get a taxonKey. This is the recommended way to get a taxonKey for a known scientific name.",
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The scientific name to match',
              },
              strict: {
                type: 'boolean',
                description: 'Use strict matching (default: false)',
              },
              verbose: {
                type: 'boolean',
                description: 'Include alternative matches (default: false)',
              },
            },
            required: ['name'],
          },
        },
        {
          name: 'species_search',
          description:
            "Search for species in GBIF's taxonomic backbone. Useful when you need to find species by partial names or explore taxonomy. It also has some support for common names, but GBIF endpoints are primarily scientific name focused.",
          inputSchema: {
            type: 'object',
            properties: {
              q: {
                type: 'string',
                description: 'Search query',
              },
              rank: {
                type: 'string',
                description: 'Taxonomic rank (e.g., SPECIES, GENUS, FAMILY)',
              },
              highertaxonKey: {
                type: 'number',
                description: 'Filter by higher taxon',
              },
              status: {
                type: 'string',
                description: 'Taxonomic status (e.g., ACCEPTED, SYNONYM)',
              },
              limit: {
                type: 'number',
                description: 'Number of results (default: 20, max: 300)',
              },
              offset: {
                type: 'number',
                description: 'Offset for pagination (default: 0)',
              },
            },
          },
        },
        {
          name: 'species_suggest',
          description:
            'Get species suggestions for autocomplete. Searches both scientific and vernacular (common) names. Only works for scientific names and works by prefix matching. Be aware that it will often suggest doubtful names and synonyms over accepted names. Use species_search or the species_match for more robust searching.',
          inputSchema: {
            type: 'object',
            properties: {
              q: {
                type: 'string',
                description: 'The search term (must be be a scientific)',
              },
              rank: {
                type: 'string',
                description: 'Filter by taxonomic rank',
              },
              limit: {
                type: 'number',
                description: 'Number of results (default: 20, max: 100)',
              },
            },
            required: ['q'],
          },
        },
        {
          name: 'dataset_search',
          description:
            'Search for datasets in GBIF to find dataset and for finding keys for filtering occurrences.',
          inputSchema: {
            type: 'object',
            properties: {
              q: {
                type: 'string',
                description: 'Search query',
              },
              type: {
                type: 'string',
                description: 'Dataset type (e.g., OCCURRENCE, CHECKLIST, METADATA)',
              },
              keyword: {
                type: 'string',
                description: 'Keyword filter',
              },
              publishingCountry: {
                type: 'string',
                description: 'ISO country code',
              },
              limit: {
                type: 'number',
                description: 'Number of results (default: 20, max: 300)',
              },
              offset: {
                type: 'number',
                description: 'Offset for pagination (default: 0)',
              },
            },
          },
        },
        {
          name: 'occurrence_search',
          description:
            'Search for species occurrence records. Use this to find and preview occurrence data. Supports faceting for aggregated counts by dimension. Note: You typically need a taxonKey (obtained from species tools) to get meaningful results. It is always relevant to show a link to the gbif user interface at https://demo.gbif.org/occurrence/search for further exploration and downloads. use ~ in front of the value to negate the filter. E.g., year=~1990,2000 to find records that is not from the interval 1990-2000. And use * as a value to search for anything that has a value. E.g., year=* to find records with a year. Combined they can be used to find records without a value: year=~*',
          inputSchema: {
            type: 'object',
            properties: {
              taxonKey: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description:
                  'Filter by species/taxon (obtain via species_match or species_search). Can be a single number or array of numbers for multiple taxa.',
              },
              scientificName: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description: 'Filter by scientific name',
              },
              country: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description: 'ISO country code (e.g., US, DK, BR)',
              },
              year: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description:
                  'Year or year range Year or year range (e.g., "2020", "2015,2020", "~2020" to exclude, "~*" for records without year)',
              },
              decimalLatitude: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description:
                  'Decimal latitude (e.g., "-23.5" or a range like "-10,10"). It makes little sense to facet on this field. instead use stats=decimalLatitude or do range queries to get counts.',
              },
              decimalLongitude: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description:
                  'Decimal longitude (e.g., "-23.5" or a range like "-10,10"). It makes little sense to facet on this field. instead use stats=decimalLongitude or do range queries to get counts.',
              },
              month: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description: 'Month (1-12)',
              },
              datasetKey: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description:
                  'Filter by dataset UUID. Obtain via dataset_search. All occurrences have a datasetKey. Use ~ for negations. E.g., datasetKey=~{key}',
              },
              basisOfRecord: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description: 'Type of record (e.g., HUMAN_OBSERVATION, PRESERVED_SPECIMEN)',
              },
              hasCoordinate: {
                type: 'boolean',
                description: 'Only records with coordinates',
              },
              hasGeospatialIssue: {
                type: 'boolean',
                description: 'Filter by geospatial quality',
              },
              limit: {
                type: 'number',
                description: 'Number of results (default: 20, max: 300)',
              },
              offset: {
                type: 'number',
                description: 'Offset for pagination (default: 0)',
              },
              facet: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description:
                  'Dimension to facet by (e.g., taxonKey, country, year, basisOfRecord, datasetKey). Can be a single string or array of strings for multiple facets.',
              },
              facetLimit: {
                type: 'number',
                description: 'Maximum number of facet values to return (default: 10)',
              },
              facetOffset: {
                type: 'number',
                description: 'Offset for facet pagination (default: 0)',
              },
              stats: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description:
                  'Dimension to get mean, average, min, max for. Only supported for numeric fields like year, decimalLatitude, decimalLongitude, month',
              },
              cardinality: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description: 'How many distinct values exist for a field.',
              },
            },
          },
        },
        {
          name: 'occurrence_download',
          description:
            'Initiate a download of occurrence data. Note: Downloads require GBIF authentication which is not yet implemented in this server. Use occurrence_search for exploring data.',
          inputSchema: {
            type: 'object',
            properties: {
              note: {
                type: 'string',
                description: 'This tool is not yet functional - authentication required',
              },
            },
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        // Validate API key before processing any requests
        const apiKey = extractApiKey(request);
        // validateApiKey(apiKey);

        const { name, arguments: args } = request.params;

        switch (name) {
          case 'species_match':
            return await this.handleSpeciesMatch(args);
          case 'species_search':
            return await this.handleSpeciesSearch(args);
          case 'species_suggest':
            return await this.handleSpeciesSuggest(args);
          case 'dataset_search':
            return await this.handleDatasetSearch(args);
          case 'occurrence_search':
            return await this.handleOccurrenceSearch(args);
          case 'occurrence_download':
            return await this.handleOccurrenceDownload(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        if (error instanceof AuthenticationError) {
          return {
            content: [
              {
                type: 'text',
                text: `Authentication Error: ${error.message}\n\nTo use this GBIF MCP server, you must provide a valid API key. Please configure your API key in one of the following ways:\n1. Set it in your MCP client configuration under the 'apiKey' parameter\n2. Set the GBIF_MCP_API_KEY environment variable\n3. Pass it in the request metadata\n\nFor development/testing, you can use the key: gbif_mcpkey_1234`,
              },
            ],
            isError: true,
          };
        }
        if (error instanceof GBIFAPIError) {
          return {
            content: [
              {
                type: 'text',
                text: `GBIF API Error (${error.status}): ${error.message}\n${error.details}`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'gbif://guide/search-patterns',
          name: 'GBIF Search Patterns and Workflows',
          description:
            'Common workflows and patterns for searching GBIF data, including how to obtain taxonKeys and datasetKeys',
          mimeType: 'text/plain',
        },
        {
          uri: 'gbif://guide/charts',
          name: 'GBIF data for charts and visualizations',
          description:
            'Requirements when using GBIF data for charts and visualizations. Includes citation and attribution guidelines and colors for GBIF branding',
          mimeType: 'text/plain',
        },
        {
          uri: 'gbif://species/{taxonKey}',
          name: 'GBIF Species by Taxon Key',
          description:
            'Get detailed information about a specific species or taxon by its GBIF taxonKey',
          mimeType: 'application/json',
        },
        {
          uri: 'gbif://dataset/{datasetKey}',
          name: 'GBIF Dataset by Key',
          description: 'Get detailed metadata about a specific GBIF dataset by its UUID',
          mimeType: 'application/json',
        },
        {
          uri: 'gbif://occurrence/{occurrenceKey}',
          name: 'GBIF Occurrence Record',
          description: 'Get detailed information about a specific occurrence record by its key',
          mimeType: 'application/json',
        },
        {
          uri: 'gbif://openapi',
          name: 'GBIF API OpenAPI Specification',
          description:
            'The OpenAPI specification for the GBIF API, describing all available endpoints and parameters',
          mimeType: 'application/x-yaml',
        },
      ],
    }));

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        // Validate API key before processing resource requests
        // const apiKey = extractApiKey(request);
        // validateApiKey(apiKey);
        if (uri === 'gbif://guide/search-patterns') {
          return {
            contents: [
              {
                uri,
                mimeType: 'text/plain',
                text: SEARCH_GUIDE,
              },
            ],
          };
        }

        if (uri === 'gbif://guide/charts') {
          return {
            contents: [
              {
                uri,
                mimeType: 'text/plain',
                text: CHART_GUIDE,
              },
            ],
          };
        }

        if (uri === 'gbif://openapi') {
          const spec = await this.apiClient.fetchText('https://api.gbif.org/v1/openapi.yaml');
          return {
            contents: [
              {
                uri,
                mimeType: 'application/x-yaml',
                text: spec,
              },
            ],
          };
        }

        const parsed = parseResourceUri(uri);
        if (!parsed) {
          throw new Error(`Invalid resource URI: ${uri}`);
        }

        const { type, key } = parsed;
        let data;

        switch (type) {
          case 'species':
            data = await this.apiClient.get(`/species/${key}`);
            break;
          case 'dataset':
            data = await this.apiClient.get(`/dataset/${key}`);
            break;
          case 'occurrence':
            data = await this.apiClient.get(`/occurrence/${key}`);
            break;
          default:
            throw new Error(`Unknown resource type: ${type}`);
        }

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error) {
        if (error instanceof AuthenticationError) {
          throw new Error(`Authentication required: ${error.message}`);
        }
        if (error instanceof GBIFAPIError) {
          throw new Error(`Failed to fetch resource: ${error.message}`);
        }
        throw error;
      }
    });
  }

  async handleSpeciesMatch(args) {
    const params = {
      name: args.name,
      strict: args.strict,
      verbose: args.verbose,
    };

    const data = await this.apiClient.get('/species/match', params);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async handleSpeciesSearch(args) {
    const params = {
      q: args.q,
      rank: args.rank,
      highertaxonKey: args.highertaxonKey,
      status: args.status,
      limit: Math.min(args.limit ?? config.defaultLimit, config.maxLimit),
      offset: args.offset ?? 0,
    };

    const data = await this.apiClient.get('/species/search', params);

    const summary = `Found ${data.count} total results. Showing ${
      data.results?.length ?? 0
    } results (offset: ${data.offset}, limit: ${data.limit}). End of records: ${data.endOfRecords}`;

    return {
      content: [
        {
          type: 'text',
          text: `${summary}\n\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async handleSpeciesSuggest(args) {
    const params = {
      q: args.q,
      rank: args.rank,
      limit: Math.min(args.limit ?? config.defaultLimit, 100),
    };

    const data = await this.apiClient.get('/species/suggest', params);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async handleDatasetSearch(args) {
    const params = {
      q: args.q,
      type: args.type,
      keyword: args.keyword,
      publishingCountry: args.publishingCountry,
      limit: Math.min(args.limit ?? config.defaultLimit, config.maxLimit),
      offset: args.offset ?? 0,
    };

    const data = await this.apiClient.get('/dataset/search', params);

    const summary = `Found ${data.count} total datasets. Showing ${
      data.results?.length ?? 0
    } results (offset: ${data.offset}, limit: ${data.limit}). End of records: ${data.endOfRecords}`;

    return {
      content: [
        {
          type: 'text',
          text: `${summary}\n\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async handleOccurrenceSearch(args) {
    const { params, uiLink } = prepareParams(args);

    const data = await this.esApiClient.get('/occurrence', params);

    let summary = `Found ${data.documents.total} total occurrences. Showing ${
      data.documents.results?.length ?? 0
    } results (offset: ${data.documents.from}, limit: ${
      data.documents.size
    }). To explore in the GBIF UI and download, visit: ${uiLink}.`;

    if (data.facets && data.facets.length > 0) {
      summary += `\n\nFacets returned: ${data.facets.map((f) => f.field).join(', ')}`;
    }

    return {
      content: [
        {
          type: 'text',
          text: `${summary}\n\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async handleOccurrenceDownload(args) {
    return {
      content: [
        {
          type: 'text',
          text: `Download functionality requires GBIF authentication, which is not yet implemented in this MCP server.

To download occurrence data, you have these options:

1. Use occurrence_search to explore and preview the data (up to 300 records per request)
2. Visit https://www.gbif.org and create a free account to access the download API
3. Use the GBIF web interface at https://www.gbif.org/occurrence/search for manual downloads

Future versions of this MCP server will support authenticated downloads when API key functionality is added.`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GBIF MCP Server running on stdio');
    console.error(SERVER_INSTRUCTIONS);
  }
}

// Start the server
const server = new GBIFMCPServer();
server.run().catch(console.error);
