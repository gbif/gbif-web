// The dimensions a two-dimensional chart can put on its axes. Each one is a field the occurrence
// GraphQL API can facet (terms) or histogram (numbers). The id is the API field name; it is also
// stored in the dashboard layout URL, so it is a public contract: do not rename.

export type Dimension = {
  /** The facet or histogram field in the API. */
  id: string;
  /** `terms`: one line per value (the most frequent). `histogram`: numbers bucketed by an interval. */
  kind: 'terms' | 'histogram';
  /** The filter handle a click sets. */
  filter: string;
  /** Translation id of the dimension's name. */
  labelId: string;
  /** Histogram: values are whole numbers, so a bucket reads 2000–2009 rather than 2000–2010. */
  integer?: boolean;
  /** Taxon ranks: 1 for kingdom to 7 for species. */
  rank?: number;
  /** False when the occurrence search has no filter to set for it, so a click can do nothing. */
  clickable?: boolean;
  /** Terms: lines read in key order (months), not by count. */
  byKey?: boolean;
  /** The field takes a checklistKey, and a click filters on taxonKey. */
  checklist?: boolean;
  /** Values are not quantities (years): no thousands separator. */
  plain?: boolean;
  /** A record can have several values, so one record can be in several cells. */
  multi?: boolean;
  /** The facet takes no `from`, so its rows can't be paged (it has few values anyway). */
  noPaging?: boolean;
  /** Columns only: the API can't look inside its buckets (yes/no facets), so it can't be the rows. */
  columnsOnly?: boolean;
  /** Its cardinality takes no checklistKey, though its facet does. */
  cardinalityWithoutChecklist?: boolean;
};

const terms = (id: string, labelId: string, more: Partial<Dimension> = {}): Dimension => ({
  id,
  kind: 'terms',
  filter: id,
  labelId,
  ...more,
});

const histogram = (id: string, labelId: string, more: Partial<Dimension> = {}): Dimension => ({
  id,
  kind: 'histogram',
  filter: id,
  labelId,
  ...more,
});

const rank = (id: string, rankName: string, order: number): Dimension =>
  terms(id, `enums.taxonRank.${rankName}`, { filter: 'taxonKey', checklist: true, rank: order });

export const dimensions: Dimension[] = [
  terms('basisOfRecord', 'filters.basisOfRecord.name'),
  terms('countryCode', 'filters.country.name', { filter: 'country' }),
  terms('continent', 'filters.continent.name'),
  terms('publishingCountry', 'filters.publishingCountryCode.name', {
    filter: 'publishingCountry',
  }),
  terms('publishedByGbifRegion', 'filters.publishedByGbifRegion.name'),
  terms('gbifRegion', 'filters.gbifRegion.name'),
  terms('datasetKey', 'filters.datasetKey.name'),
  terms('publishingOrg', 'filters.publisherKey.name'),
  terms('license', 'filters.license.name'),
  terms('protocol', 'filters.protocol.name'),
  terms('occurrenceStatus', 'filters.occurrenceStatus.name', { noPaging: true }),
  terms('issue', 'filters.occurrenceIssue.name', { multi: true }),
  terms('mediaType', 'filters.mediaType.name', { multi: true }),
  terms('typeStatus', 'filters.typeStatus.name', { multi: true }),
  terms('sex', 'filters.sex.name', { multi: true }),
  terms('lifeStage', 'filters.lifeStage.name', { multi: true }),
  terms('establishmentMeans', 'filters.establishmentMeans.name', { multi: true }),
  terms('iucnRedListCategory', 'filters.iucnRedListCategory.name', { checklist: true }),
  terms('taxonomicIssue', 'filters.occurrenceTaxonomicIssue.name', {
    checklist: true,
    multi: true,
    cardinalityWithoutChecklist: true,
  }),
  terms('degreeOfEstablishment', 'filters.degreeOfEstablishment.name', { multi: true }),
  terms('pathway', 'filters.pathway.name', { multi: true }),
  terms('datasetCategory', 'filters.datasetCategory.name', { multi: true }),
  // Yes/no
  terms('isInCluster', 'filters.isInCluster.name', { columnsOnly: true }),
  terms('isSequenced', 'filters.isSequenced.name', { columnsOnly: true }),
  terms('repatriated', 'filters.repatriated.name', { columnsOnly: true, noPaging: true }),
  // Publishing and holding
  terms('hostingOrganizationKey', 'filters.hostingOrganizationKey.name'),
  // There is no installation filter on the search page.
  terms('installationKey', 'installation.installation', { clickable: false }),
  terms('networkKey', 'filters.networkKey.name', { multi: true }),
  terms('institutionKey', 'filters.institutionKey.name'),
  terms('collectionKey', 'filters.collectionKey.name'),
  terms('institutionCode', 'filters.institutionCode.name'),
  terms('collectionCode', 'filters.collectionCode.name'),
  terms('catalogNumber', 'filters.catalogNumber.name'),
  terms('datasetId', 'filters.datasetId.name', { multi: true }),
  terms('projectId', 'filters.projectId.name', { multi: true }),
  terms('programme', 'filters.programme.name'),
  terms('dwcaExtension', 'filters.dwcaExtension.name', { multi: true }),
  // People
  terms('recordedBy', 'filters.recordedBy.name', { multi: true }),
  terms('identifiedBy', 'filters.identifiedBy.name', { multi: true }),
  terms('georeferencedBy', 'filters.georeferencedBy.name'),
  // Event and sampling
  terms('eventId', 'filters.eventId.name'),
  terms('parentEventId', 'filters.parentEventId.name'),
  terms('fieldNumber', 'filters.fieldNumber.name'),
  terms('recordNumber', 'filters.recordNumber.name'),
  terms('samplingProtocol', 'filters.samplingProtocol.name', { multi: true }),
  terms('sampleSizeUnit', 'filters.sampleSizeUnit.name'),
  // Organism and material
  terms('organismId', 'filters.organismId.name'),
  terms('organismQuantityType', 'filters.organismQuantityType.name'),
  terms('preparations', 'filters.preparations.name', { multi: true }),
  terms('verbatimScientificName', 'filters.verbatimScientificName.name'),
  terms('nucleotideSequenceTargetGene', 'filters.nucleotideSequenceTargetGene.name', {
    multi: true,
  }),
  // Place
  terms('stateProvince', 'filters.stateProvince.name'),
  terms('waterBody', 'filters.waterBody.name'),
  terms('higherGeography', 'filters.higherGeography.name', { multi: true }),
  terms('locality', 'filters.locality.name'),
  terms('island', 'filters.island.name'),
  terms('islandGroup', 'filters.islandGroup.name'),
  // Geology
  terms('lithostratigraphy', 'filters.lithostratigraphy.name', { multi: true }),
  terms('biostratigraphy', 'filters.biostratigraphy.name', { multi: true }),
  rank('kingdomKey', 'KINGDOM', 1),
  rank('phylumKey', 'PHYLUM', 2),
  rank('classKey', 'CLASS', 3),
  rank('orderKey', 'ORDER', 4),
  rank('familyKey', 'FAMILY', 5),
  rank('genusKey', 'GENUS', 6),
  rank('speciesKey', 'SPECIES', 7),
  histogram('year', 'filters.year.name', { integer: true, plain: true }),
  terms('month', 'filters.month.name', { byKey: true }),
  histogram('startDayOfYear', 'filters.startDayOfYear.name', { integer: true, plain: true }),
  histogram('elevation', 'filters.elevation.name'),
  histogram('depth', 'filters.depth.name'),
  histogram('nucleotideSequenceSequenceLength', 'filters.nucleotideSequenceSequenceLength.name', {
    integer: true,
    multi: true,
  }),
  // The search page has no latitude or longitude filter, so these can be looked at but not clicked.
  histogram('decimalLatitude', 'dashboard.crosstab.dimension.latitude', { clickable: false }),
  histogram('decimalLongitude', 'dashboard.crosstab.dimension.longitude', { clickable: false }),
];

const byId = new Map(dimensions.map((d) => [d.id, d]));

/** The dimension with this id, or the fallback: ids come from shared URLs, so they can be anything. */
export function getDimension(id: unknown, fallback: string): Dimension {
  return byId.get(String(id)) ?? (byId.get(fallback) as Dimension);
}
