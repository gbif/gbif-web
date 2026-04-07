const tools = [
  {
    name: 'gbif_usage_guidelines',
    description:
      'Always read this before using GBIF data. Provides essential guidelines. This is also where you will find the usageToken needed for the other tools. The query parameter is required.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'What is the user looking for? Translate the query into english if possible.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'create_visualization',
    description:
      'Create a map or chart using species occurrence records. The result of the provided jq must be a valid vega lite configuration or a geojson. Before using this tool it is recommended to read the guidelines in gbif_usage_guidelines. Use this to create charts using occurrence data. Supports faceting for aggregated counts by dimension.',
    inputSchema: {
      type: 'object',
      required: ['usageToken', 'graphQuery', 'jqQuery'],
      properties: {
        usageToken: {
          type: 'string',
          description:
            'This token is required to use the tool (obtain from gbif_usage_guidelines)',
        },
        graphQuery: {
          type: 'string',
          description:
            'A required graphql query to fetch the data needed for the chart. If a jq query is provided, then the data will be processed using that before returning it.',
        },
        jqQuery: {
          type: 'string',
          description:
            'A required jq query to filter the data before returning it.',
        },
      },
    },
  },
];

export default tools;
