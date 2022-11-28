import occurrenceAPI from '../gbif/occurrence/occurrence.source';

// Export the occurrenceAPI source for the relatedTaxa field
export const occurrence = { dataSource: { occurrenceAPI } };

export { default as scalars } from '../shared/scalars';
export { default as event } from '../shared/resources/event';
