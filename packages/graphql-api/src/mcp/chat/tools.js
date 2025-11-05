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
    name: 'label_generator',
    description:
      'Get the label for a key like taxonKey, datasetKey or GadmID. This is useful for generating human readable labels for ids/keys.',
    inputSchema: {
      type: 'object',
      required: ['field', 'values', 'usageToken'],
      properties: {
        usageToken: {
          type: 'string',
          description:
            'This token is required to use the tool (obtain from gbif_usage_guidelines)',
        },
        field: {
          type: 'string',
          description:
            'The field to generate labels for (taxonKey, datasetKey, gadm)',
        },
        values: {
          type: 'array',
          description: 'The values to generate labels for',
          items: {
            type: 'string',
          },
        },
      },
    },
  },
  {
    name: 'species_match',
    description:
      "Match a name to GBIF's taxonomic backbone to get a taxonKey. This is the recommended way to get a taxonKey for a known scientific name. It also has partial support for vernacular names and partial names.",
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
          description: 'The name to match',
        },
      },
    },
  },
  {
    name: 'species_search',
    description:
      "Free text search for species and other taxa in GBIF's taxonomy. Useful when you need to find species by partial names or explore taxonomy. GBIF endpoints are scientific name focused.",
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
          description:
            'Filter by higher taxonKey. (e.g. 1 for Animalia, 6 for Plants). This can for example be used to limit search to a specific family.',
        },
        status: {
          type: 'string',
          description: 'Taxonomic status (e.g., ACCEPTED, SYNONYM)',
        },
        limit: {
          type: 'number',
          description: 'Number of results (default: 10, max: 300)',
        },
        offset: {
          type: 'number',
          description: 'Offset for pagination (default: 0)',
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
    name: 'gadm_search',
    description:
      'Search for GadmID for use in occurrence search to filter by administrative area (e.g. state, provinces, counties etc.) Resolution varies by country. Names should be provided in local language using latin characters. E.g. Comunidad de Madrid for the regions in spain.',
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
          description:
            'Partial or full name of the administrative area to search for',
        },
      },
    },
  },
  {
    name: 'gadm_ids_to_geojson',
    description:
      'Convert GADM IDs to GeoJSON features. This tool takes a list of GADM IDs and returns the corresponding GeoJSON representations.',
    inputSchema: {
      type: 'object',
      properties: {
        gadmIds: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Comma-separated list of GADM IDs to convert to a single GeoJSON',
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
          ],
          description:
            'Filter by species/taxon (obtain the taxonKey for the scientific name via species_match or species_search). Can be a single number or array of numbers for multiple taxa.',
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
        administrativeArea: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'Filter by the adminsitrative area the coordinates fall within. This is based on GADM and requires a GadmID, which can be found using the gadm_search tool. E.g., USA.33_1 for New York state in the US. Unlike the country filter, then gadm excludes records without coordinates and exclude the Exclusive Economic Zone in the water. This also means that it can be used to search for records located in the sea by searching for administrativeArea=~*',
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
        filter: {
          type: 'object',
          description:
            'Additional filter supported by the occurrence search can go here. E.g. iucnRedListCategory, establishmentMeans, etc.',
          required: ['field', 'value'],
          properties: {
            field: {
              type: 'string',
              description: 'The field to filter by',
            },
            value: {
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } },
              ],
              description:
                'The values to filter by. Use ~ for negation and * for existence as described in the guidelines.',
            },
          },
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
          type: 'object',
          properties: {
            field: {
              type: 'string',
              description:
                'Dimension to facet by (e.g., speciesKey, genusKey, country, year, basisOfRecord, datasetKey, gadmLevel0Gid (country), gadmLevel1Gid, gadmLevel2Gid, gadmLevel3Gid). For charts please see the guidelines.',
            },
            limit: {
              type: 'number',
              description:
                'Maximum number of facet values to return (default: 10)',
            },
            offset: {
              type: 'number',
              description: 'Offset for facet pagination (default: 0)',
            },
          },
          description:
            'Dimension to facet by (e.g., speciesKey, country, year, basisOfRecord, datasetKey). For charts please see the guidelines.',
        },
        stats: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          description:
            'Dimension to get mean, average, min, max for. Only supported for numeric fields like year, decimalLatitude, decimalLongitude, month. For charts please see the guidelines.',
        },
        histogram: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              description:
                'What field to create a histogram for. The options are year, decimalLatitude, decimalLongitude',
            },
            interval: {
              type: 'number',
              description: 'What interval to use. Default is 10',
            },
          },
          description:
            'How many distinct values exist for a field. For charts please see the guidelines.',
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
