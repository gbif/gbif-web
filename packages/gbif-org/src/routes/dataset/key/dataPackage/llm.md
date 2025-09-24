# Darwin Core Data Package UI

## Overview

This system provides a user interface for browsing and exploring Darwin Core Data Packages - a standardized format for describing biodiversity-related datasets. The data packages contain structured information about biological specimens, their identifications, molecular data, and collection events, all interconnected through foreign key relationships.

## System Architecture

### Data Format

Darwin Core Data Packages follow a standardized schema that includes:

- **Resources**: Individual data tables (e.g., events, identifications, molecular protocols)
- **Schema definitions**: Field specifications with types, constraints, and relationships
- **Foreign key relationships**: Links between resources creating a relational data model

### API Endpoints

#### Metadata Endpoints

- `GET /v1/dataset/datapackage` - List all available data packages
- `GET /v1/dataset/{datasetKey}/datapackage` - Get datapackage.json metadata
- `GET /v1/dataset/{datasetKey}/datapackage/resource` - List all resources/schemas
- `GET /v1/dataset/{datasetKey}/datapackage/resourceNames` - List resource names only
- `GET /v1/dataset/{datasetKey}/datapackage/resource/{resourceName}` - Get specific resource schema
- `GET /v1/dataset/{datasetKey}/datapackage/indexedResources` - List indexed/searchable resources

#### Data Access Endpoints

- `POST /v1/dataset/datapackage/search` - Search across all data packages with filters, facets, and sorting
- `POST /v1/dataset/datapackage/export` - Export search results as TSV
- `GET /v1/dataset/{datasetKey}/datapackage/{resourceName}/search` - Resource-specific search
- `GET /v1/dataset/{datasetKey}/datapackage/{resourceName}/export` - Resource-specific export
- `GET /v1/dataset/{datasetKey}/datapackage/{resourceName}/{primaryKey}` - Get single record by primary key

### Search API Example

```json
{
  "datasetKey": "bb1bcfd9-7ee3-4c6e-9b8d-661cc4c524f4",
  "resource": "nucleotide-analysis",
  "limit": 100,
  "offset": 0,
  "filters": {
    "molecularProtocolID": ["1"],
    "gbifDatasetKey": ["bb1bcfd9-7ee3-4c6e-9b8d-661cc4c524f4"]
  },
  "sortBy": {
    "molecularProtocolID": "ASC",
    "gbifDatasetKey": "DESC"
  },
  "facets": ["gbifDatasetKey"]
}
```

## UI Components

### File Structure

- **ResourceList.tsx**: Main component that displays all available resources as expandable cards
- **ResourceCard.tsx**: Individual resource display with paginated data table
- **EntityDetailDrawer.tsx**: Side drawer for detailed record inspection
- **GenericDetail.tsx**: Generic record detail view with field-by-field display
- **ListBrowser.tsx**: Generic entity browser with navigation capabilities

### Core Functionality

#### Resource Overview

The `ResourceList` component fetches all available resources for a dataset and renders them as `ResourceCard` components. Each card shows:

- Resource title and description from schema
- Paginated data table with all fields
- Clickable rows for records with primary keys

#### Data Table Display

`ResourceCard` components:

- Fetch schema information to understand field types and constraints
- Display data in tabular format with appropriate type formatting
- Handle pagination with configurable page sizes
- Enable row selection for records with primary keys

#### Record Detail View

The detail drawer system provides:

- **EntityDetailDrawer**: URL parameter-based entity selection (`entity=resourceName__primaryKey`)
- **GenericDetail**: Field-by-field display with type-aware rendering
- Foreign key navigation between related records
- Rich field metadata display (descriptions, examples, constraints)

### Planned Enhancements

#### Specialized Field Rendering

- **Coordinates**: Display decimal latitude/longitude as interactive maps
- **Identifications**: Resolve identification IDs to display scientific names
- **URLs**: Automatic link detection and display
- **Dates**: Formatted date/time display
- **Sequences**: Specialized molecular sequence viewers

#### Relationship Visualization

- Mermaid.js diagrams showing resource relationships
- Interactive relationship navigation
- Cross-resource filtering and faceting

#### Enhanced Navigation

- Breadcrumb navigation through related records
- Back/forward navigation within record sets
- Bookmarkable URLs for specific records and views

## Development Notes

### Key Technical Decisions

- Uses URL parameters for drawer state management to enable bookmarking
- Implements generic field rendering with type-specific overrides
- Foreign key relationships enable cross-resource navigation
- Schema-driven UI generation for flexibility across different data packages

### Current Limitations

- Limited specialized field rendering (mostly generic text display)
- No map visualization for coordinate fields
- Basic foreign key display without resolved names
- Manual primary key detection from schema constraints

### Future Development

The system is designed to be extended with:

- Custom field renderers for specific data types
- Visualization components for spatial and temporal data
- Advanced search and filtering interfaces
- Export capabilities for selected records
- Integration with external taxonomic and geographic services

## Styling

It is a react site using tailwind configured with a g- prefix. We also have Shadcn components available.
