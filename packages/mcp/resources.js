export const SEARCH_GUIDE = `# GBIF Search Patterns and Workflows

## Common Workflows

### 1. Search by Scientific Name
To find occurrences of a species when you know its scientific name:
1. Use \`species_match\` with the scientific name to get the taxonKey
2. Use the taxonKey in \`occurrence_search\` to find occurrence records

Example: Finding monarch butterfly (Danaus plexippus) occurrences
- First: species_match with name="Danaus plexippus"
- Then: occurrence_search with taxonKey from the match result

### 2. Search by Common/Vernacular Name
To find a species by its common name:
1. Use \`species_suggest\` with the common name (e.g., "tiger")
2. Review the suggestions to find the correct species
3. Use the taxonKey from the suggestion in \`occurrence_search\`

### 3. Dataset Discovery
To find datasets for a specific topic or region:
1. Use \`dataset_search\` with relevant keywords
2. Note the datasetKey from results
3. Use datasetKey in \`occurrence_search\` to see occurrences from that dataset

### 4. Geographic Searches
To find occurrences in a specific location:
1. Get taxonKey via species_match or species_search
2. Use occurrence_search with:
   - taxonKey for the species
   - country (ISO 2-letter code, e.g., "US", "DK", "BR")
   - hasCoordinate=true for georeferenced records

### 5. Temporal Searches
To find occurrences from a specific time period:
- Use year parameter (e.g., "2020" or "2015,2020" for range)
- Use month parameter (1-12) to filter by month
- Combine with taxonKey for species-specific temporal patterns

### 6. Faceted Searches (Aggregations)
To get aggregated counts by dimension:
1. Use \`occurrence_search\` with \`facet\` parameter to specify dimension
2. Available facet dimensions include:
   - taxonKey: Species/taxon breakdown
   - country: Geographic distribution
   - year: Temporal distribution
   - basisOfRecord: Record type breakdown
   - datasetKey: Dataset breakdown
   - month: Seasonal patterns
3. Control facet results with:
   - facetLimit: Number of facet values (default: 10)
   - facetOffset: Pagination for facet values
4. Multiple facets can be requested in a single call
5. For 2-dimensional breakdowns, make multiple calls with different filters

Example: Get species breakdown for birds in Denmark
- occurrence_search with country="DK", taxonKey=[bird class], facet="taxonKey", facetLimit=20

Example: Get temporal distribution
- occurrence_search with taxonKey=[species], facet="year", facetLimit=50

Example: 2D breakdown (species by year)
- First call: Get top species with facet="taxonKey"
- Second call: For each top species, get years with facet="year"

## Visualizing Occurrence Searches on the Web

After using occurrence_search to find records, you can visualize the same results on the GBIF web interface:

**Base URL:** https://demo.gbif.org/occurrence/search

**How it works:**
- Add the same search parameters from occurrence_search as URL query parameters
- Use the \`view\` parameter to control the visualization mode

**Available Views:**
- \`view=map\` - Geographic map view (default)
- \`view=table\` - Tabular data view
- \`view=gallery\` - Image gallery view
- \`view=download\` - Download preparation view

**Example URLs:**

Single taxon with year filter:
\`\`\`
https://demo.gbif.org/occurrence/search?taxonKey=2480946&year=2020&view=map
\`\`\`

Multiple taxa comparison:
\`\`\`
https://demo.gbif.org/occurrence/search?taxonKey=1&taxonKey=212&year=2020,2020&view=map
\`\`\`

Geographic filter with table view:
\`\`\`
https://demo.gbif.org/occurrence/search?country=DK&hasCoordinate=true&view=table
\`\`\`

Basis of record filter with gallery:
\`\`\`
https://demo.gbif.org/occurrence/search?taxonKey=5386&basisOfRecord=PRESERVED_SPECIMEN&view=gallery
\`\`\`

**Tips:**
- All occurrence_search parameters can be used in the web URL
- Multiple values for the same parameter (like taxonKey) are added by repeating the parameter
- The web interface provides interactive exploration, filtering, and export options
- Use this for visual analysis after using occurrence_search to validate your filters

## Pagination

GBIF API uses offset-based pagination:
- Default limit: 20 results
- Maximum limit: 300 results per request
- Use offset parameter to get additional pages
- Response includes "endOfRecords" boolean
- Response includes "count" (total matching records)

Example for pagination:
- First page: limit=300, offset=0
- Second page: limit=300, offset=300
- Third page: limit=300, offset=600

## Data Quality Filters

For higher quality occurrence data, use these filters:
- \`hasCoordinate=true\`: Only records with lat/lon coordinates
- \`hasGeospatialIssue=false\`: Exclude records with coordinate quality issues
- \`basisOfRecord\`: Filter by evidence type:
  - HUMAN_OBSERVATION: Visual observations
  - PRESERVED_SPECIMEN: Museum specimens
  - MACHINE_OBSERVATION: Automated detections
  - OBSERVATION: General observations
  - LIVING_SPECIMEN: Living collections (zoos, gardens)

## Multiple Values and Range Queries

### Multiple Values for Same Parameter
Many GBIF API parameters accept multiple values by repeating the parameter:
- \`taxonKey\`: Pass an array [123, 456, 789] to search multiple taxa
- \`country\`: Pass an array ["US", "CA", "MX"] to search multiple countries
- \`facet\`: Pass an array ["country", "year"] for multiple facet dimensions

Example: occurrence_search with taxonKey=[2480946, 2480962] searches both species

### Numeric Range Queries
For numeric parameters, you can specify ranges using comma-separated values:
- \`year="2020"\`: Exact year 2020
- \`year="2015,2020"\`: Range from 2015 to 2020 (inclusive)
- \`year="2020,*"\`: Year 2020 and later (open-ended)
- \`year="*,2020"\`: Year 2020 and earlier (open-ended)

This applies to: year, month, elevation, depth, and other numeric fields

## Common Parameters

### Taxonomic Ranks
- KINGDOM
- PHYLUM
- CLASS
- ORDER
- FAMILY
- GENUS
- SPECIES
- SUBSPECIES

### Taxonomic Status
- ACCEPTED: Currently accepted names
- SYNONYM: Alternative names for accepted taxa
- DOUBTFUL: Questionable taxonomic status

### Dataset Types
- OCCURRENCE: Species occurrence records
- CHECKLIST: Species lists
- SAMPLING_EVENT: Event-based sampling data
- METADATA: Dataset descriptions only

## Tips

1. **Always get taxonKey first**: Most occurrence searches require a taxonKey for meaningful results
2. **Use strict matching carefully**: strict=true in species_match requires exact nomenclatural matching
3. **Check data quality**: Not all records have coordinates or are thoroughly verified
4. **Be specific with geography**: Use country codes rather than text searches for locations
5. **Consider basis of record**: Different record types have different quality implications
6. **Watch for synonyms**: species_match returns the accepted name and status
7. **Use verbose matching**: verbose=true shows alternative matches when exact match is unclear
8. **Use facets for breakdowns**: Use the facet parameter to get aggregated counts by dimension instead of retrieving all individual records
9. **Paginate facets**: Large facet dimensions (like taxonKey) may need facetOffset to access all values
10. **Combine filters with facets**: Apply filters first, then facet to get breakdowns of filtered results

## Example Workflows

### Find recent bird observations in Denmark
1. species_search with q="Aves" and rank="CLASS" to get bird class taxonKey
2. occurrence_search with:
   - taxonKey from step 1
   - country="DK"
   - basisOfRecord="HUMAN_OBSERVATION"
   - year="2024"
   - hasCoordinate=true

### Compare multiple species in same region
1. Get taxonKeys for species of interest (e.g., 2480946, 2480962)
2. occurrence_search with:
   - taxonKey=[2480946, 2480962] (array of keys)
   - country="US"
   - year="2020,*" (2020 and later)
   - facet="taxonKey" to see breakdown by species

### Multi-country biodiversity analysis
1. occurrence_search with:
   - country=["US", "CA", "MX"] (North America)
   - hasCoordinate=true
   - facet=["country", "year"] (multiple facets)
   - year="2015,2024" (date range)

### Explore a specific dataset
1. dataset_search with relevant keywords
2. Get datasetKey from results
3. occurrence_search with datasetKey to see its occurrences
4. Use gbif://dataset/{datasetKey} resource for full metadata

### Find endangered species occurrences
1. species_search with appropriate taxon filters
2. Cross-reference with IUCN status (external to GBIF)
3. occurrence_search with taxonKeys

### Get geographic distribution breakdown
1. species_match to get taxonKey for species of interest
2. occurrence_search with:
   - taxonKey from step 1
   - facet="country"
   - facetLimit=50
3. Result shows count of occurrences per country

### Analyze species diversity in a region
1. occurrence_search with:
   - country="US" (or desired region)
   - hasCoordinate=true
   - facet="taxonKey"
   - facetLimit=100
2. Returns top 100 species by occurrence count in that region
3. For species names, follow up with species lookup for each taxonKey

### Create temporal trends
1. species_match to get taxonKey
2. occurrence_search with:
   - taxonKey from step 1
   - facet="year"
   - facetLimit=100
3. Returns occurrence counts per year for the species
`;

export function parseResourceUri(uri) {
  const patterns = {
    species: /^gbif:\/\/species\/(\d+)$/,
    dataset: /^gbif:\/\/dataset\/([a-f0-9-]{36})$/i,
    occurrence: /^gbif:\/\/occurrence\/(\d+)$/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    const match = uri.match(pattern);
    if (match) {
      return { type, key: match[1] };
    }
  }

  return null;
}