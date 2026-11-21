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
  /** Terms: lines read in key order (months), not by count. */
  byKey?: boolean;
  /** The field takes a checklistKey, and a click filters on taxonKey. */
  checklist?: boolean;
  /** Values are not quantities (years): no thousands separator. */
  plain?: boolean;
  /** A record can have several values, so one record can be in several cells. */
  multi?: boolean;
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

const rank = (id: string, rankName: string): Dimension =>
  terms(id, `enums.taxonRank.${rankName}`, { filter: 'taxonKey', checklist: true });

export const dimensions: Dimension[] = [
  terms('basisOfRecord', 'filters.basisOfRecord.name'),
  terms('countryCode', 'filters.country.name', { filter: 'country' }),
  terms('continent', 'filters.continent.name'),
  terms('publishingCountry', 'filters.publishingCountryCode.name', {
    filter: 'publishingCountryCode',
  }),
  terms('publishedByGbifRegion', 'filters.publishedByGbifRegion.name'),
  terms('gbifRegion', 'filters.gbifRegion.name'),
  terms('datasetKey', 'filters.datasetKey.name'),
  terms('publishingOrg', 'filters.publisherKey.name'),
  terms('license', 'filters.license.name'),
  terms('protocol', 'filters.protocol.name'),
  terms('occurrenceStatus', 'filters.occurrenceStatus.name'),
  terms('issue', 'filters.occurrenceIssue.name', { multi: true }),
  terms('mediaType', 'filters.mediaType.name', { multi: true }),
  terms('typeStatus', 'filters.typeStatus.name', { multi: true }),
  terms('sex', 'filters.sex.name'),
  terms('lifeStage', 'filters.lifeStage.name'),
  terms('establishmentMeans', 'filters.establishmentMeans.name'),
  terms('iucnRedListCategory', 'filters.iucnRedListCategory.name', { checklist: true }),
  rank('kingdomKey', 'KINGDOM'),
  rank('phylumKey', 'PHYLUM'),
  rank('classKey', 'CLASS'),
  rank('orderKey', 'ORDER'),
  rank('familyKey', 'FAMILY'),
  rank('genusKey', 'GENUS'),
  rank('speciesKey', 'SPECIES'),
  histogram('year', 'filters.year.name', { integer: true, plain: true }),
  terms('month', 'filters.month.name', { byKey: true }),
  histogram('startDayOfYear', 'filters.startDayOfYear.name', { integer: true, plain: true }),
  histogram('elevation', 'filters.elevation.name'),
  histogram('depth', 'filters.depth.name'),
  histogram('decimalLatitude', 'dashboard.crosstab.dimension.latitude'),
  histogram('decimalLongitude', 'dashboard.crosstab.dimension.longitude'),
];

const byId = new Map(dimensions.map((d) => [d.id, d]));

/** The dimension with this id, or the fallback: ids come from shared URLs, so they can be anything. */
export function getDimension(id: unknown, fallback: string): Dimension {
  return byId.get(String(id)) ?? (byId.get(fallback) as Dimension);
}
