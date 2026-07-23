/**
 * Reduces a DwC-DP table schema reference to the resource it describes, collapsing the relative and
 * absolute forms and every schema version onto one name. Already reduced values pass through.
 *
 *   table-schemas/event.json                                     -> event
 *   https://rs.gbif.org/.../dwc-dp/0.1/table-schemas/event.json  -> event
 */
export function dwcdpResourceName(schema: string): string {
  return schema.split('/').pop()?.replace(/\.json$/, '') ?? schema;
}
