/* eslint-disable import/prefer-default-export */
export const SEARCH_GUIDE = `# GBIF Search Guide

## Quick Start

### Most Common Pattern: Search by Scientific Name
1. species_match with name="Danaus plexippus" → get taxonKey
2. occurrence_search with taxonKey → get occurrence records

### Search by Common Name
1. species_search with q="tiger" → review results
2. occurrence_search with taxonKey → get occurrences

### Geographic Search
Use occurrence_search with taxonKey + country="DK" + hasCoordinate=true

## Core Concepts

### TaxonKey
Almost all occurrence searches require a taxonKey for meaningful results. Get it via species_match (exact name) or species_search (fuzzy search). Use verbose=true in species_match to see alternative matches.

### Facets (Aggregations)
Get aggregated counts instead of individual records:
- facet="country" for geographic breakdown
- facet="year" for temporal distribution  
- facet="taxonKey" for species breakdown
- facet="basisOfRecord" for record type breakdown

Control with facetLimit (default: 10) and facetOffset for pagination. Can request multiple facets: facet=["country", "year"]

For 2D breakdowns, make multiple calls with different filters:
1. Get top species: facet="taxonKey"
2. For each species: facet="year" with taxonKey filter

### Multiple Values & Ranges

Multiple values: Pass arrays for most parameters
- taxonKey=[123, 456] searches multiple taxa
- country=["US", "CA", "MX"] searches multiple countries

Numeric ranges: Use comma-separated values
- year="2020" for exact year
- year="2015,2020" for range (inclusive)
- year="2020,*" for 2020 and later
- year="*,2020" for 2020 and earlier

Negation: Use ~ prefix
- year="~1990,2000" excludes 1990-2000
- issue="~ZERO_COORDINATE" excludes that issue
- year="~*" finds records without a year

## Search Patterns

### By Dataset
1. dataset_search with keywords → get datasetKey
2. occurrence_search with datasetKey → see occurrences

### By Time Period
Use occurrence_search with taxonKey + year="2020" + month=6

### By Record Quality
Use these filters for higher quality data:
- hasCoordinate=true for only georeferenced records
- hasGeospatialIssue=false to exclude coordinate problems
- year="*" for records with temporal data
- basisOfRecord="HUMAN_OBSERVATION" for specific evidence type

Basis of Record options:
- HUMAN_OBSERVATION: visual observations
- PRESERVED_SPECIMEN: museum specimens  
- MACHINE_OBSERVATION: automated detections
- LIVING_SPECIMEN: zoos/gardens
- OBSERVATION: general observations

### By Geographic Coordinates
For latitude/longitude ranges:
occurrence_search with decimalLatitude="-10,10" + decimalLongitude="100,120"

## Example Workflows

### Species distribution breakdown
Step 1: species_match name="Panthera tigris" → get taxonKey
Step 2: occurrence_search with taxonKey + facet="country" + facetLimit=50

### Temporal trends
Step 1: species_match name="Apis mellifera" → get taxonKey  
Step 2: occurrence_search with taxonKey + facet="year" + facetLimit=100

### Recent observations in region
Step 1: species_search with q="Aves" and rank="CLASS" → get taxonKey
Step 2: occurrence_search with taxonKey + country="DK" + year="2024" + basisOfRecord="HUMAN_OBSERVATION" + hasCoordinate=true

### Compare multiple species
occurrence_search with taxonKey=[2480946, 2480962] + country="US" + year="2020,*" + facet="taxonKey"

### Regional biodiversity analysis
occurrence_search with country=["US", "CA", "MX"] + year="2015,2024" + hasCoordinate=true + facet="taxonKey" + facetLimit=100

## Best Practices

1. Always get taxonKey first - Use species_match or species_search before occurrence queries
2. Use facets for counts - Don't retrieve individual records when you need aggregations
3. Filter for quality - Apply hasCoordinate, hasGeospatialIssue, and year filters as needed
4. Check for synonyms - species_match returns accepted names and taxonomic status
5. Be specific with geography - Use ISO country codes (e.g., "US", "DK", "BR")
6. Watch coordinate quality - Coordinates may conflict with locality descriptions
7. Paginate facets - Large dimensions may need facetOffset to access all values
8. Use issue flags - Filter or exclude records with specific data quality issues

## Reference

### Pagination
Default limit: 20, maximum: 300 per request. Use offset for additional pages (offset=0, 300, 600...). Response includes endOfRecords boolean and count (total). Large offsets over 10,000 are blocked - use download service instead.

### Web Visualization
View results at: https://demo.gbif.org/occurrence/search

Add search parameters as URL query params:
Example: ?taxonKey=2480946&year=2020&country=DK&view=map

View modes:
- view=map for geographic map (default)
- view=table for tabular data
- view=gallery for image gallery
- view=download to prepare download

For multiple values, repeat the parameter:
Example: ?taxonKey=1&taxonKey=212&year=2020,2020

### Chart Colors
Default color schema for visualizations:
#4C9C2E, #E37C72, #D1628E, #ECAC7C, #00B7EE, #6885C0, #664192, #F2BF48, #0078B4

### Common Issue Flags
- ZERO_COORDINATE: lat/lon is 0,0
- COUNTRY_COORDINATE_MISMATCH: country doesn't match coordinates
- CONTINENT_COORDINATE_MISMATCH: continent doesn't match coordinates
- Full list: https://techdocs.gbif.org/en/data-use/occurrence-issues-and-flags


## Guides
There are specialized guides available for specific use cases. Those should be read to provide context and advice on work flows for specific topis:
- Invasive Species Guide: https://docs.gbif.org/mcp/guides/invasive_species_guide.md

## Usage token
To use the other tools you need this token: I_HAVE_READ_THE_GUIDELINES
`;
