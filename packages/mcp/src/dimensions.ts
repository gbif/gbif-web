// The dimensions a chart can break records down by. A fixed list: the model never names a GraphQL field.
export interface Dimension {
  /** field in the GraphQL occurrence facet */
  facet: string;
  kind: 'temporal' | 'categorical';
  title: string;
  /** how many values to ask for */
  defaultSize: number;
  maxSize: number;
}

export const DIMENSIONS: Record<string, Dimension> = {
  year: { facet: 'year', kind: 'temporal', title: 'Records per year', defaultSize: 300, maxSize: 300 },
  month: { facet: 'month', kind: 'temporal', title: 'Records per month', defaultSize: 12, maxSize: 12 },
  country: { facet: 'countryCode', kind: 'categorical', title: 'Records per country', defaultSize: 15, maxSize: 50 },
  basisOfRecord: { facet: 'basisOfRecord', kind: 'categorical', title: 'Records per basis of record', defaultSize: 10, maxSize: 20 },
  dataset: { facet: 'datasetKey', kind: 'categorical', title: 'Records per dataset', defaultSize: 10, maxSize: 30 },
  continent: { facet: 'continent', kind: 'categorical', title: 'Records per continent', defaultSize: 10, maxSize: 10 },
  license: { facet: 'license', kind: 'categorical', title: 'Records per license', defaultSize: 10, maxSize: 10 },
  mediaType: { facet: 'mediaType', kind: 'categorical', title: 'Records per media type', defaultSize: 10, maxSize: 10 },
};

export const DIMENSION_NAMES = Object.keys(DIMENSIONS) as [string, ...string[]];
