import {
  BasisOfRecordLabel,
  CountryLabel,
  DatasetLabel,
  EstablishmentMeansLabel,
  LifeStageLabel,
  SexLabel,
  TaxonLabel,
  TypeStatusVocabularyLabel,
} from '@/components/filters/displayNames';
import { ComponentType } from 'react';

export type MediaGroupMode = 'default' | 'random' | 'group' | 'yearDesc' | 'yearAsc';

export type GroupValueLabel = ComponentType<{ id: string | number | object }>;

export type GroupField = {
  /** GraphQL facet field name (e.g. 'datasetKey', 'sex'). */
  id: string;
  /** i18n key shown in the dropdown menu. */
  labelId: string;
  /** Component used to render an individual bucket value (e.g. TaxonLabel).
   *  Omit for plain values (e.g. year — just render the integer). */
  ValueLabel?: GroupValueLabel;
  /** Filter field name to use when the user clicks "Filter by this".
   *  Defaults to `id` when omitted. */
  filterField?: string;
  /** For rank fields: the groupBy id to switch to when drilling down one rank. */
  drillDownTo?: string;
};

/**
 * To add a new group, append an entry to GROUP_FIELDS below:
 *
 *   { id: 'myField', labelId: 'some.i18n.key' }
 *
 * - `id`          – the GraphQL facet field name (must be facetable in the occurrence search API).
 * - `labelId`     – i18n message key shown in the dropdown.
 * - `ValueLabel`  – optional React component that renders a bucket value nicely (e.g. a label
 *                   that resolves a key to a human-readable name). Omit for plain text/number
 *                   fields like `recordedBy` or `year` — the raw value is shown directly.
 *                   To add a new label component, create (or find) one in
 *                   `@/components/filters/displayNames`, import it here, and set `ValueLabel`.
 * - `filterField` – the filter key used when clicking "Use as filter". Defaults to `id`.
 *                   Override when the facet field name differs from the filter param
 *                   (e.g. `speciesKey` facets but filters on `taxonKey`).
 * - `drillDownTo` – id of the next finer-grained group to suggest drilling into.
 *                   Only relevant for the taxonomic rank hierarchy.
 *
 * Nothing else needs to change — the dropdown, GraphQL query, cardinality count, and
 * "unspecified" bucket are all generated automatically from this array.
 */
export const GROUP_FIELDS: GroupField[] = [
  { id: 'datasetKey', labelId: 'filters.datasetKey.name', ValueLabel: DatasetLabel },
  {
    id: 'speciesKey',
    labelId: 'occurrenceFieldNames.species',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
  },
  {
    id: 'genusKey',
    labelId: 'occurrenceFieldNames.genus',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
    drillDownTo: 'speciesKey',
  },
  {
    id: 'familyKey',
    labelId: 'occurrenceFieldNames.family',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
    drillDownTo: 'genusKey',
  },
  {
    id: 'orderKey',
    labelId: 'occurrenceFieldNames.order',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
    drillDownTo: 'familyKey',
  },
  {
    id: 'classKey',
    labelId: 'occurrenceFieldNames.class',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
    drillDownTo: 'orderKey',
  },
  {
    id: 'phylumKey',
    labelId: 'occurrenceFieldNames.phylum',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
    drillDownTo: 'classKey',
  },
  {
    id: 'kingdomKey',
    labelId: 'occurrenceFieldNames.kingdom',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
    drillDownTo: 'phylumKey',
  },
  {
    id: 'countryCode',
    labelId: 'filters.occurrenceCountry.name',
    ValueLabel: CountryLabel,
    filterField: 'country',
  },
  { id: 'basisOfRecord', labelId: 'filters.basisOfRecord.name', ValueLabel: BasisOfRecordLabel },
  { id: 'sex', labelId: 'occurrenceFieldNames.sex', ValueLabel: SexLabel },
  { id: 'lifeStage', labelId: 'occurrenceFieldNames.lifeStage', ValueLabel: LifeStageLabel },
  {
    id: 'typeStatus',
    labelId: 'occurrenceFieldNames.typeStatus',
    ValueLabel: TypeStatusVocabularyLabel,
  },
  {
    id: 'establishmentMeans',
    labelId: 'occurrenceFieldNames.establishmentMeans',
    ValueLabel: EstablishmentMeansLabel,
  },
  { id: 'recordedBy', labelId: 'filters.recordedBy.name' },
];

export type MediaGroupState = {
  mode: MediaGroupMode;
  groupBy?: string;
};

export const DEFAULT_MEDIA_GROUP_STATE: MediaGroupState = {
  mode: 'default',
  groupBy: undefined,
};

type GroupOccurrence = {
  verbatimScientificName?: string;
  classification?: {
    usage?: { name?: string };
    taxonMatch?: { usage?: { canonicalName?: string } };
  } | null;
};

export function getFormattedName(occ: GroupOccurrence): string {
  return (
    occ.classification?.taxonMatch?.usage?.canonicalName ??
    occ.classification?.usage?.name ??
    occ.verbatimScientificName ??
    ''
  );
}
