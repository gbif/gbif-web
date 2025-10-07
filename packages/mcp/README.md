# Dependencies
node_modules/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/

# Build outputs
dist/
build/
### 1. Find Species Occurrences by Scientific Name

**Example**: "Find occurrences of monarch butterflies in California"

1. First, get the taxonKey:
   - Use `species_match` with name="Danaus plexippus"
   - Note the `usageKey` (taxonKey) from the response

2. Then search occurrences:
   - Use `occurrence_search` with:
     - taxonKey from step 1
     - country="US"
     - hasCoordinate=true (optional, for georeferenced records)

### 2. Search by Common Name

**Example**: "Find species with the common name 'tiger'"

1. Use `species_suggest` with q="tiger"
2. Review suggestions to find the correct species
3. Use the key from the suggestion in `occurrence_search`

### 3. Explore Datasets

**Example**: "What datasets contain bird observations from Denmark?"

1. Use `dataset_search` with:
   - q="birds Denmark" or similar keywords
   - type="OCCURRENCE"
2. Note the datasetKey from interesting results
3. Use `gbif://dataset/{datasetKey}` resource for full metadata
4. Use `occurrence_search` with the datasetKey to see records

### 4. Geographic and Temporal Queries

**Example**: "Recent observations in a specific region"

- Use `occurrence_search` with:
  - taxonKey (obtained from species tools)
  - country="DK" (ISO country code)
  - year="2024" (or year range like "2020,2024")
  - basisOfRecord="HUMAN_OBSERVATION"
  - hasCoordinate=true

## Tools Reference

### species_match

Match a scientific name to GBIF's taxonomic backbone.

**Parameters:**
- `name` (required): Scientific name to match
- `strict` (optional): Use strict matching
- `verbose` (optional): Include alternative matches

**Returns:** Taxon information including taxonKey, rank, status, and classification

### species_search

Search the taxonomic backbone with filters.

**Parameters:**
- `q`: Search query
- `rank`: Taxonomic rank (SPECIES, GENUS, FAMILY, etc.)
- `highertaxonKey`: Filter by higher taxon
- `status`: Taxonomic status (ACCEPTED, SYNONYM)
- `limit`: Results per page (max 300)
- `offset`: Pagination offset

**Returns:** Paginated list of matching taxa

### species_suggest

Autocomplete suggestions for scientific and common names.

**Parameters:**
- `q` (required): Search term
- `rank`: Filter by rank
- `limit`: Number of suggestions (max 100)

**Returns:** List of suggested species

### dataset_search

Search for GBIF datasets.

**Parameters:**
- `q`: Search query
- `type`: Dataset type (OCCURRENCE, CHECKLIST, etc.)
- `keyword`: Keyword filter
- `publishingCountry`: ISO country code
- `limit`: Results per page (max 300)
- `offset`: Pagination offset

**Returns:** Paginated list of datasets

### occurrence_search

Search species occurrence records.

**Parameters:**
- `taxonKey`: Filter by species (recommended)
- `scientificName`: Filter by name
- `country`: ISO country code
- `year`: Year or range ("2020" or "2015,2020")
- `month`: Month (1-12)
- `datasetKey`: Filter by dataset UUID
- `basisOfRecord`: Evidence type (HUMAN_OBSERVATION, PRESERVED_SPECIMEN, etc.)
- `hasCoordinate`: Only records with coordinates
- `hasGeospatialIssue`: Filter by spatial quality
- `limit`: Results per page (max 300)
- `offset`: Pagination offset

**Returns:** Paginated list of occurrence records

### occurrence_download

Placeholder for download functionality (requires authentication).

**Note:** Not yet implemented. Use `occurrence_search` for data exploration or visit gbif.org for authenticated downloads.

## Resources Reference

### gbif://guide/search-patterns

Comprehensive guide to GBIF search workflows and patterns.

### gbif://species/{taxonKey}

Get detailed species information by taxonKey.

**Example:** `gbif://species/5231190` (Danaus plexippus)

### gbif://dataset/{datasetKey}

Get dataset metadata by UUID.

**Example:** `gbif://dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7`

### gbif://occurrence/{occurrenceKey}

Get occurrence record details by key.

**Example:** `gbif://occurrence/1234567890`

### gbif://openapi

GBIF API OpenAPI specification (YAML format).

## Data Quality Tips

1. **Use filters for quality data:**
   - `hasCoordinate=true` for georeferenced records
   - `hasGeospatialIssue=false` to exclude problematic coordinates
   - Select appropriate `basisOfRecord` values

2. **Always get taxonKey first:**
   - Use `species_match` for known scientific names
   - Use `species_suggest` for common names
   - Use `species_search` for exploratory taxonomy

3. **Understand pagination:**
   - Default limit: 20 records
   - Maximum limit: 300 records per request
   - Use offset to retrieve additional pages
   - Check `endOfRecords` boolean in responses

4. **Consider basis of record:**
   - HUMAN_OBSERVATION: Visual sightings
   - PRESERVED_SPECIMEN: Museum specimens (high quality)
   - MACHINE_OBSERVATION: Automated detections (e.g., camera traps)
   - OBSERVATION: General observations
   - LIVING_SPECIMEN: Zoo/garden specimens

## Configuration

Edit `config.js` to customize:
- API base URL
- User-Agent string
- Default and maximum limits
- Request timeout
- Future: API key for authentication

## Error Handling

The server handles common errors gracefully:
- Network timeouts (30 second default)
- HTTP errors (404, 500, etc.)
- Invalid parameters
- API rate limiting (if implemented by GBIF)

Errors are returned with descriptive messages including status codes and details.

## Future Enhancements

- [ ] API key authentication support
- [ ] Occurrence download functionality
- [ ] Response caching for common queries
- [ ] Additional GBIF API endpoints
- [ ] Support for predicate-based queries
- [ ] GeoJSON export for occurrence data

## Requirements

- Node.js >= 18.0.0
- npm or yarn

## Dependencies

- `@modelcontextprotocol/sdk`: MCP protocol implementation
- `node-fetch`: HTTP client for API requests

## License

Apache-2.0

## Links

- [GBIF API Documentation](https://www.gbif.org/developer/summary)
- [GBIF Website](https://www.gbif.org)
- [MCP Protocol](https://modelcontextprotocol.io)
- [OpenAPI Spec](https://api.gbif.org/v1/openapi.yaml)

## Support

For GBIF API questions: https://www.gbif.org/contact
For MCP server issues: File an issue in this repository

## Example Queries to Try

Once connected to Claude Desktop, try these queries:

1. "Find recent observations of polar bears"
2. "What datasets are available for butterflies in Europe?"
3. "Search for species with the common name 'red fox'"
4. "Show me occurrence data for Panthera leo in South Africa"
5. "Find preserved specimens of orchids from the last 10 years"
6. "What is the taxonomic classification of Canis lupus?"
# GBIF MCP Server

An MCP (Model Context Protocol) server that provides access to GBIF (Global Biodiversity Information Facility) biodiversity data through their REST API.

## Features

- **6 Tools** for searching and accessing biodiversity data:
  - `species_match`: Match scientific names to get taxonKeys
  - `species_search`: Search the taxonomic backbone
  - `species_suggest`: Autocomplete and common name search
  - `dataset_search`: Find biodiversity datasets
  - `occurrence_search`: Search species occurrence records
  - `occurrence_download`: (Placeholder - requires authentication)

- **5 Resources** for detailed information:
  - Search patterns guide
  - Species information by taxonKey
  - Dataset metadata by datasetKey
  - Occurrence records by occurrenceKey
  - GBIF API OpenAPI specification

## Installation

```bash
cd packages/mcp
npm install
```

## Usage

### Running the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### Connecting to Claude Desktop

Add this configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "gbif": {
      "command": "node",
      "args": ["/absolute/path/to/gbif-web/packages/mcp/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/` with the actual path to your repository.

## Common Workflows

### 1. Find Species Occurrences by Scientific Name

```
```XML