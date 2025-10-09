const tools = [
  {
    name: 'gbif_usage_guidelines',
    description:
      'Always read this before using GBIF data. Provides essential guidelines on how to use GBIF data and proper attribution. This is also where you will find the usageToken needed for the other tools.',
    inputSchema: {
      type: 'object',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    name: 'species_match',
    description:
      "Match a scientific name to GBIF's taxonomic backbone to get a taxonKey. This is the recommended way to get a taxonKey for a known scientific name.",
    inputSchema: {
      type: 'object',
      required: ['name', 'usageToken'],
      properties: {
        usageToken: {
          type: 'string',
          description:
            'This token is required to use the tool (obtain from gbif_usage_guidelines)',
        },
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
    },
  },
  {
    name: 'species_search',
    description:
      "Search for species in GBIF's taxonomic backbone. Useful when you need to find species by partial names or explore taxonomy. GBIF endpoints are primarily scientific name focused, but the species_search tool also supports search by common names which can be used to find the scientific name and key. Be aware that that common names are often ambiguous and may not have a 1-to-1 mapping to scientific names. Often common names will refer to multiple taxa or be a subset of a taxon. If a user have searched for a common name it is recommended to get a confirmation if it isn't obvious which scientific name to choose.",
    inputSchema: {
      type: 'object',
      required: ['usageToken'],
      properties: {
        usageToken: {
          type: 'string',
          description:
            'This token is required to use the tool (obtain from gbif_usage_guidelines)',
        },
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
      required: ['q', 'usageToken'],
      properties: {
        usageToken: {
          type: 'string',
          description:
            'This token is required to use the tool (obtain from gbif_usage_guidelines)',
        },
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
    },
  },
  {
    name: 'dataset_search',
    description:
      'Search for datasets in GBIF to find dataset and for finding keys for filtering occurrences.',
    inputSchema: {
      type: 'object',
      required: ['usageToken'],
      properties: {
        usageToken: {
          type: 'string',
          description:
            'This token is required to use the tool (obtain from gbif_usage_guidelines)',
        },
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
      'Search for species occurrence records. Before using this tool it is recommended to read the guidelines in gbif_usage_guidelines. Use this to find and preview occurrence data. Supports faceting for aggregated counts by dimension. Note: You typically need a taxonKey (obtained from species tools) to get meaningful results. It is always relevant to show a link to the gbif user interface at https://demo.gbif.org/occurrence/search for further exploration and downloads. use ~ in front of the value to negate the filter. E.g., year=~1990,2000 to find records that is not from the interval 1990-2000. And use * as a value to search for anything that has a value. E.g., year=* to find records with a year. Combined they can be used to find records without a value: year=~*',
    inputSchema: {
      type: 'object',
      required: ['usageToken'],
      properties: {
        usageToken: {
          type: 'string',
          description:
            'This token is required to use the tool (obtain from gbif_usage_guidelines)',
        },
        taxonKey: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
            { type: 'null' },
          ],
          description:
            'Filter by species/taxon (obtain via species_match or species_search). Can be a single number or array of numbers for multiple taxa.',
        },
        scientificName: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description: 'Filter by scientific name',
        },
        country: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description: 'ISO country code (e.g., US, DK, BR)',
        },
        continent: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'Continent to filter by. Options: AFRICA, ANTARCTICA, ASIA, EUROPE, NORTH_AMERICA, OCEANIA, SOUTH_AMERICA. Be aware that continent might not match the coordinates or country. In those cases the issue flags CONTINENT_COORDINATE_MISMATCH and CONTINENT_COUNTRY_MISMATCH are set.',
        },
        issue: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'GBIF flags indicating issues with the record. E.g., "ZERO_COORDINATE", "COUNTRY_COORDINATE_MISMATCH", (see https://techdocs.gbif.org/en/data-use/occurrence-issues-and-flags for full list). Use ~ in front of the value to negate the filter. E.g., issue=~ZERO_COORDINATE to exclude records with zero coordinates.',
        },
        mediaType: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'Filter by media type associated with the record. Options: "StillImage", "MovingImage", "Sound"',
        },
        year: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'Year or year range Year or year range (e.g., "2020", "2015,2020", "~2020" to exclude, "~*" for records without year)',
        },
        decimalLatitude: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'Decimal latitude (e.g., "-23.5" or a range like "-10,10"). It makes little sense to facet on this field. instead use stats=decimalLatitude or do range queries to get counts.',
        },
        decimalLongitude: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'Decimal longitude (e.g., "-23.5" or a range like "-10,10"). It makes little sense to facet on this field. instead use stats=decimalLongitude or do range queries to get counts.',
        },
        month: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description: 'Month (1-12)',
        },
        datasetKey: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'Filter by dataset UUID. Obtain via dataset_search. All occurrences have a datasetKey. Use ~ for negations. E.g., datasetKey=~{key}',
        },
        basisOfRecord: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'Type of record (e.g., HUMAN_OBSERVATION, PRESERVED_SPECIMEN)',
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
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'Dimension to facet by (e.g., taxonKey, country, year, basisOfRecord, datasetKey). Can be a single string or array of strings for multiple facets. For charts please see the guidelines.',
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
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'Dimension to get mean, average, min, max for. Only supported for numeric fields like year, decimalLatitude, decimalLongitude, month. For charts please see the guidelines.',
        },
        cardinality: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'How many distinct values exist for a field. For charts please see the guidelines.',
        },
      },
    },
  },
  // {
  //   name: 'occurrence_download',
  //   description:
  //     'Initiate a download of occurrence data. Note: Downloads require GBIF authentication which is not yet implemented in this server. Use occurrence_search for exploring data.',
  //   inputSchema: {
  //     type: 'object',
  //     properties: {
  //       note: {
  //         type: 'string',
  //         description:
  //           'This tool is not yet functional - authentication required',
  //       },
  //     },
  //   },
  // },
];

export default tools;
