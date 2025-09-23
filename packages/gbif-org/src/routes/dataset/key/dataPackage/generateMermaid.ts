// function that takes a JSON schema and generateds a mermaid diagram string
// The schema describes the various classes, their fields and foreign key relationships. See exampleSchema.json
function generateMermaid(schema: any): string {
  if (!schema || !Array.isArray(schema)) {
    return 'classDiagram\n';
  }

  let mermaidString = 'classDiagram\n';

  // First pass: Create all class definitions with their fields
  for (const table of schema) {
    const className = formatClassName(table.name);
    const fields = table.schema?.fields || [];
    const primaryKey = table.schema?.primaryKey;

    mermaidString += `class ${className}:::gbif_dp_${table.name.replace('-', '')} {\n`;

    // Add fields
    for (const field of fields) {
      const fieldName = field.name;
      const fieldType = mapFieldType(field.type);
      const isRequired = field.constraints?.required;
      const isPrimaryKey = fieldName === primaryKey;

      // Use - prefix for primary keys (private), + for others (public)
      const prefix = isPrimaryKey ? '-' : '+';
      mermaidString += `  ${prefix}${fieldType} ${fieldName}\n`;
    }

    mermaidString += '}\n';
  }

  // Second pass: Create relationships based on foreign keys
  for (const table of schema) {
    const className = formatClassName(table.name);
    const foreignKeys = table.schema?.foreignKeys || [];

    for (const fk of foreignKeys) {
      const targetResource = fk.reference?.resource;
      if (targetResource) {
        const targetClassName = formatClassName(targetResource);
        const relationshipLabel = fk.fields; // Use the foreign key field name as label

        // Create a relationship: source class references target class
        // Using "1" -- "1" for one-to-one relationships with the FK field name as label
        mermaidString += `${className} "${relationshipLabel}" --> ${targetClassName}\n`;
      }
    }
  }

  // Add CSS styling for classes
  mermaidString += '\n';
  mermaidString += '%% Custom styling for tables\n';

  // Add a style definition for each table
  for (const table of schema) {
    const cssClass = `gbif_dp_${table.name.replace('-', '')}`;
    // Default styling - can be customized per table
    //mermaidString += `classDef ${cssClass} fill:#f9f9f9,stroke:#333,stroke-width:2px\n`;

    //table-specific styling. know tables get special colors
    switch (table.name.toLowerCase().replace('-', '')) {
      // Blue boxes - core survey/event/occurrence tables
      case 'survey':
      case 'event':
      case 'occurrence':
      case 'organisminteraction':
        mermaidString += `classDef ${cssClass} fill:#93bfdb,stroke:#5d7a8c,stroke-width:2px\n`;
        break;

      // Green boxes - biological/taxonomic/supplementary tables
      case 'surveytarget':
      case 'location':
      case 'organism':
      case 'identification':
      case 'taxon':
      case 'geologicalcontext':
      case 'chronometricage':
      case 'materialentity':
      case 'nucleotideanalysis':
      case 'nucleotidesequence':
      case 'molecularsequence':
      case 'molecularprotocol':
      case 'measurementorfact':
      case 'multimedia':
        mermaidString += `classDef ${cssClass} fill:#bcd6ac,stroke:#96a88b,stroke-width:2px\n`;
        break;

      // Red fallback for unknown tables
      default:
        mermaidString += `classDef ${cssClass} fill:#eea37e,stroke:#875339,stroke-width:2px\n`;
    }
  }

  return mermaidString;
}

// Helper function to format table names as class names (PascalCase)
function formatClassName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// Helper function to map JSON schema types to simple type names
function mapFieldType(type: string): string {
  switch (type?.toLowerCase()) {
    case 'string':
      return 'String';
    case 'integer':
    case 'number':
      return 'Int';
    case 'boolean':
      return 'Boolean';
    default:
      return 'String';
  }
}

export default generateMermaid;
