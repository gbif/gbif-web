import {
  CollectionLabel,
  DatasetLabel,
  DegreeOfEstablishmentLabel,
  DepthLabel,
  ElevationLabel,
  EstablishmentMeansLabel,
  GadmGidLabel,
  GeoTimeLabel,
  InstallationLabel,
  InstitutionLabel,
  LifeStageLabel,
  NetworkLabel,
  OrganismQuantityLabel,
  PathwayLabel,
  PublisherLabel,
  RelativeOrganismQuantityLabel,
  SampleSizeValueLabel,
  SexLabel,
  TaxonLabel,
  YearLabel,
} from '@/components/filters/displayNames';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfig } from '@/config/config';
import { camelCase, constantCase } from 'change-case';
import { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const fieldsWithChecklistSupport = [
  'TAXON_KEY',
  'SPECIES_KEY',
  'GENUS_KEY',
  'FAMILY_KEY',
  'ORDER_KEY',
  'CLASS_KEY',
  'PHYLUM_KEY',
  'KINGDOM_KEY',
  'ACCEPTED_TAXON_KEY',
  'IUCN_RED_LIST_CATEGORY',
];

export const PredicateDisplay = ({ predicate: predicateRaw }) => {
  const intl = useIntl();
  const { defaultChecklistKey } = useConfig();
  let predicate = predicateRaw;

  const getTranslation = useCallback(
    (key: string, fallback?: string) =>
      intl.formatMessage({ id: key, defaultMessage: fallback ?? key }),
    [intl]
  );

  const getValueTranslation = useMemo(() => {
    return (predicate) => {
      const { key, parameter, value, type, checklistKey } = predicate;
      // choose label based on key
      // if no label is found, return the value
      const predicateKey = constantCase(key ?? 'UNKNOWN_KEY');
      if (predicateKey) {
        switch (predicateKey) {
          case 'UNKNOWN_KEY':
            return value;
          case 'EVENT_ID':
            return value;
          case 'DECIMAL_LONGITUDE':
            return value;
          case 'EVENT_DATE_GTE':
            return value;
          case 'DISTANCE_FROM_CENTROID_IN_METERS':
            return value;
          case 'DATASET_NAME':
            return value;
          case 'GEOLOGICAL_TIME':
            return value;
          case 'ISLAND':
            return value;
          case 'INSTITUTION_KEY':
            return <InstitutionLabel id={value} />;
          case 'GADM_LEVEL_0_GID':
            return <GadmGidLabel id={value} />;
          case 'GADM_LEVEL_2_GID':
            return <GadmGidLabel id={value} />;
          case 'LATEST_AGE_OR_HIGHEST_STAGE':
            return <GeoTimeLabel id={value} />;
          case 'OCCURRENCE_STATUS':
            return getTranslation(`enums.occurrenceStatus.${constantCase(value)}`, `"${value}"`);
          case 'PROJECT_ID':
            return value;
          case 'LOWEST_BIOSTRATIGRAPHIC_ZONE':
            return <GeoTimeLabel id={value} />;
          case 'TAXON_CONCEPT_ID':
            return value;
          case 'TAXON_KEY':
            return <TaxonLabel id={value} checklistKey={checklistKey} />;
          case 'LATEST_EON_OR_HIGHEST_EONOTHEM':
            return <GeoTimeLabel id={value} />;
          case 'SUBGENUS_KEY':
            return <TaxonLabel id={value} checklistKey={checklistKey} />;
          case 'HAS_GEOSPATIAL_ISSUE':
            return getTranslation(`enums.yesNo.${camelCase(value)}`, `"${value}"`);
          case 'INSTITUTION_CODE':
            return value;
          case 'REPATRIATED':
            return getTranslation(`enums.yesNo.${camelCase(value)}`, `"${value}"`);
          case 'YEAR':
            return <YearLabel id={predicate} />;
          case 'STATE_PROVINCE':
            return value;
          case 'GEO_DISTANCE':
            return value;
          case 'GADM_GID':
            return <GadmGidLabel id={value} />;
          case 'SAMPLE_SIZE_VALUE':
            return <SampleSizeValueLabel id={predicate} />;
          case 'OCCURRENCE_ID':
            return value;
          case 'GEOREFERENCED_BY':
            return value;
          case 'FIELD_NUMBER':
            return value;
          case 'CATALOG_NUMBER':
            return value;
          case 'EVENT_DATE':
            return value;
          case 'ORGANISM_QUANTITY':
            return <OrganismQuantityLabel id={predicate} />;
          case 'PREVIOUS_IDENTIFICATIONS':
            return value;
          case 'END_DAY_OF_YEAR':
            return value;
          case 'IDENTIFIED_BY_ID':
            return value;
          case 'MONTH':
            return getTranslation(`enums.month.${constantCase(value)}`, `"${value}"`);
          case 'BED':
            return value;
          case 'DATASET_ID':
            return value;
          case 'LOCALITY':
            return value;
          case 'START_DAY_OF_YEAR':
            return value;
          case 'EARLIEST_ERA_OR_LOWEST_ERATHEM':
            return <GeoTimeLabel id={value} />;
          case 'HIGHEST_BIOSTRATIGRAPHIC_ZONE':
            return <GeoTimeLabel id={value} />;
          case 'COUNTRY':
            return getTranslation(`enums.countryCode.${constantCase(value)}`, `"${value}"`);
          case 'IDENTIFIED_BY':
            return value;
          case 'GBIF_ID':
            return value;
          case 'PUBLISHED_BY_GBIF_REGION':
            return getTranslation(`enums.gbifRegion.${constantCase(value)}`, `"${value}"`);
          case 'IUCN_RED_LIST_CATEGORY':
            return getTranslation(`enums.iucnRedListCategory.${constantCase(value)}`, `"${value}"`);
          case 'PATHWAY':
            return <PathwayLabel id={value} />;
          case 'NETWORK_KEY':
            return <NetworkLabel id={value} />;
          case 'DWCA_EXTENSION':
            return value;
          case 'ACCEPTED_TAXON_KEY':
            return <TaxonLabel id={value} checklistKey={checklistKey} />;
          case 'CONTINENT':
            return getTranslation(`enums.continent.${constantCase(value)}`, `"${value}"`);
          case 'OTHER_CATALOG_NUMBERS':
            return value;
          case 'TYPE_STATUS':
            return getTranslation(`enums.typeStatus.${constantCase(value)}`, `"${value}"`);
          case 'PROTOCOL':
            return getTranslation(`enums.endpointType.${constantCase(value)}`, `"${value}"`);
          case 'MEMBER':
            return value;
          case 'SPECIES_KEY':
            return <TaxonLabel id={value} checklistKey={checklistKey} />;
          case 'GADM_LEVEL_1_GID':
            return <GadmGidLabel id={value} />;
          case 'GADM_LEVEL_3_GID':
            return <GadmGidLabel id={value} />;
          case 'EARLIEST_AGE_OR_LOWEST_STAGE':
            return <GeoTimeLabel id={value} />;
          case 'DEGREE_OF_ESTABLISHMENT':
            return <DegreeOfEstablishmentLabel id={value} />;
          case 'DEPTH':
            return <DepthLabel id={predicate} />;
          case 'RELATIVE_ORGANISM_QUANTITY':
            return <RelativeOrganismQuantityLabel id={predicate} />;
          case 'ORGANISM_ID':
            return value;
          case 'PUBLISHING_COUNTRY':
            return getTranslation(`enums.countryCode.${constantCase(value)}`, `"${value}"`);
          case 'SAMPLE_SIZE_UNIT':
            return value;
          case 'LITHOSTRATIGRAPHY':
            return value;
          case 'TAXONOMIC_STATUS':
            return value;
          case 'RECORDED_BY_ID':
            return value;
          case 'ISLAND_GROUP':
            return value;
          case 'HOSTING_ORGANIZATION_KEY':
            return <PublisherLabel id={value} />;
          case 'ASSOCIATED_SEQUENCES':
            return value;
          case 'DECIMAL_LATITUDE':
            return value;
          case 'PREPARATIONS':
            return value;
          case 'EARLIEST_EON_OR_LOWEST_EONOTHEM':
            return <GeoTimeLabel id={value} />;
          case 'ORGANISM_QUANTITY_TYPE':
            return value;
          case 'MODIFIED':
            return value;
          case 'EARLIEST_EPOCH_OR_LOWEST_SERIES':
            return <GeoTimeLabel id={value} />;
          case 'IS_SEQUENCED':
            return getTranslation(`enums.yesNo.${camelCase(value)}`, `"${value}"`);
          case 'TAXON_ID':
            return value;
          case 'EARLIEST_PERIOD_OR_LOWEST_SYSTEM':
            return <GeoTimeLabel id={value} />;
          case 'MEDIA_TYPE':
            return getTranslation(`enums.mediaType.${constantCase(value)}`, `"${value}"`);
          case 'CLASS_KEY':
            return <TaxonLabel id={value} checklistKey={checklistKey} />;
          case 'LIFE_STAGE':
            return <LifeStageLabel id={value} />;
          case 'LATEST_ERA_OR_HIGHEST_ERATHEM':
            return <GeoTimeLabel id={value} />;
          case 'LATEST_PERIOD_OR_HIGHEST_SYSTEM':
            return <GeoTimeLabel id={value} />;
          case 'SCIENTIFIC_NAME':
            return value;
          case 'PHYLUM_KEY':
            return <TaxonLabel id={value} checklistKey={checklistKey} />;
          case 'FAMILY_KEY':
            return <TaxonLabel id={value} checklistKey={checklistKey} />;
          case 'ESTABLISHMENT_MEANS':
            return <EstablishmentMeansLabel id={value} />;
          case 'WATER_BODY':
            return value;
          case 'HIGHER_GEOGRAPHY':
            return value;
          case 'COLLECTION_CODE':
            return value;
          case 'SAMPLING_PROTOCOL':
            return value;
          case 'IS_IN_CLUSTER':
            return getTranslation(`enums.yesNo.${camelCase(value)}`, `"${value}"`);
          case 'RECORD_NUMBER':
            return value;
          case 'PUBLISHING_ORG':
            return <PublisherLabel id={value} />;
          case 'PROGRAMME':
            return value;
          case 'COLLECTION_KEY':
            return <CollectionLabel id={value} />;
          case 'LICENSE':
            return getTranslation(`enums.license.${constantCase(value)}`, `"${value}"`);
          case 'LAST_INTERPRETED':
            return value;
          case 'KINGDOM_KEY':
            return <TaxonLabel id={value} checklistKey={checklistKey} />;
          case 'ELEVATION':
            return <ElevationLabel id={predicate} />;
          case 'SEX':
            return <SexLabel id={value} />;
          case 'GENUS_KEY':
            return <TaxonLabel id={value} checklistKey={checklistKey} />;
          case 'CRAWL_ID':
            return value;
          case 'HAS_COORDINATE':
            return getTranslation(`enums.yesNo.${camelCase(value)}`, `"${value}"`);
          case 'GROUP':
            return value;
          case 'LATEST_EPOCH_OR_HIGHEST_SERIES':
            return <GeoTimeLabel id={value} />;
          case 'FORMATION':
            return value;
          case 'ORDER_KEY':
            return <TaxonLabel id={value} checklistKey={checklistKey} />;
          case 'ISSUE':
            return getTranslation(`enums.occurrenceIssue.${constantCase(value)}`, `"${value}"`);
          case 'TAXONOMIC_ISSUE':
            return getTranslation(`enums.occurrenceIssue.${constantCase(value)}`, `"${value}"`);
          case 'INSTALLATION_KEY':
            return <InstallationLabel id={value} />;
          case 'VERBATIM_SCIENTIFIC_NAME':
            return value;
          case 'GBIF_REGION':
            return getTranslation(`enums.gbifRegion.${constantCase(value)}`, `"${value}"`);
          case 'COORDINATE_UNCERTAINTY_IN_METERS':
            return value;
          case 'PARENT_EVENT_ID':
            return value;
          case 'RECORDED_BY':
            return value;
          case 'BASIS_OF_RECORD':
            return getTranslation(`enums.basisOfRecord.${constantCase(value)}`, `"${value}"`);
          case 'BIOSTRATIGRAPHY':
            return value;
          case 'DATASET_KEY':
            return <DatasetLabel id={value} />;
          default:
            return value;
        }
      }
      if (type === 'within') {
        return value;
      }
      return value;
    };
  }, [getTranslation]);

  if (!predicate) return null;

  if (typeof predicate === 'string') {
    predicate = JSON.parse(predicate);
  }

  if (JSON.stringify(predicate).length > 2000) {
    return <pre>{JSON.stringify(predicate, null, 2)}</pre>;
  }

  switch (predicate.type) {
    case 'and':
    case 'or':
      return (
        <ul>
          <div className="join">
            <span dir="auto" className="node">
              {getTranslation(`downloadKey.predicate.${predicate.type}`)}
            </span>
            <span dir="auto" className="discreet">
              {getTranslation(`downloadKey.predicate.joinDescriptions.${predicate.type}`)}
            </span>
          </div>
          {predicate.predicates.map((p, index) => (
            <li key={index} className={p.type === 'or' || p.type === 'and' ? 'hasChildren' : ''}>
              <div className="pipe"></div>
              <PredicateDisplay predicate={p} />
            </li>
          ))}
        </ul>
      );
    case 'not':
      return (
        <ul className="not">
          <div className="join">
            <span dir="auto" className="node">
              {getTranslation(`downloadKey.predicate.not`)}
            </span>
            <span dir="auto" className="discreet">
              {getTranslation(`downloadKey.predicate.joinDescriptions.not`)}
            </span>
          </div>
          <li>
            <div className="pipe"></div>
            <PredicateDisplay predicate={predicate.predicate} />
          </li>
        </ul>
      );
    case 'in':
      return (
        <div className="leaf">
          <span dir="auto" className="node">
            {getTranslation(
              `downloadKey.predicate.keys.${constantCase(predicate.key)}`,
              `"${predicate.key}"`
            )}
          </span>
          <ol className="inlineBulletList">
            {predicate.values.map((option, index) => (
              <li
                key={index}
                className="node-value"
                title={getTranslation(`downloadKey.predicate.joinDescriptions.or`)}
              >
                <span dir="auto">
                  {getValueTranslation({
                    key: predicate.key,
                    value: option,
                    checklistKey: predicate.checklistKey,
                  })}
                </span>
              </li>
            ))}
          </ol>
          <ChecklistLabel predicate={predicate} defaultChecklistKey={defaultChecklistKey} />
        </div>
      );
    case 'isNotNull':
    case 'isNull':
      return (
        <div className="leaf">
          <span dir="auto" className="node">
            {getTranslation(
              `downloadKey.predicate.keys.${constantCase(predicate.parameter)}`,
              `"${predicate.parameter}"`
            )}
          </span>
          <span dir="auto" className="node-value discreet--very">
            {getTranslation(`downloadKey.predicate.${predicate.type}`, `"${predicate.type}"`)}
          </span>
        </div>
      );
    case 'within':
      return (
        <div className="leaf">
          <span dir="auto" className="node">
            {getTranslation(`downloadKey.predicate.within`)}
          </span>
          <span dir="auto" className="node-value">
            {predicate.geometry}
          </span>
        </div>
      );
    case 'geoDistance':
      return (
        <div className="leaf">
          <span dir="auto" className="node">
            {getTranslation(`downloadKey.predicate.geoDistance`)}
          </span>
          <span dir="auto" className="node-value">
            {`${predicate.distance} from latitude ${predicate.latitude}, longitude ${predicate.longitude}`}
          </span>
        </div>
      );
    case 'equals':
    case 'greaterThanOrEquals':
    case 'lessThanOrEquals':
    case 'greaterThan':
    case 'lessThan':
      return (
        <div className="leaf">
          <span dir="auto" className="node">
            {getTranslation(
              `downloadKey.predicate.keys.${constantCase(predicate.key)}`,
              `"${predicate.key}"`
            )}
          </span>
          <span dir="auto" className="node-value">
            {getValueTranslation(predicate)}
          </span>
          <ChecklistLabel predicate={predicate} defaultChecklistKey={defaultChecklistKey} />
        </div>
      );
    default:
      return (
        <div className="leaf">
          <span dir="auto" className="node">
            Unknown:
          </span>
          <span dir="auto" className="node-value">
            <pre>{JSON.stringify(predicate)}</pre>
          </span>
        </div>
      );
  }
};

export const PredicateDisplaySkeleton = () => {
  return (
    <div className="g-space-y-2">
      <Skeleton className="g-w-12 g-h-6" />
      <Skeleton className="g-ml-10 g-w-28 g-h-6" />
      <Skeleton className="g-ml-10 g-w-12 g-h-6" />
      <Skeleton className="g-ml-16 g-w-12 g-h-6" />
      <Skeleton className="g-ml-16 g-w-12 g-h-6" />
    </div>
  );
};

function ChecklistLabel({
  predicate,
  defaultChecklistKey,
}: {
  predicate: any;
  defaultChecklistKey?: string;
}) {
  if (!defaultChecklistKey) return null;
  return (
    <>
      {predicate.checklistKey && predicate.checklistKey !== defaultChecklistKey && (
        <div className="g-text-slate-500 g-text-xs">
          <FormattedMessage id="downloadKey.predicate.checklist" defaultMessage="Checklist" />:{' '}
          <DatasetLabel id={predicate.checklistKey} />
        </div>
      )}
      {/* For downloads prior to multi taxonomy download */}
      {predicate.checklistKey === undefined &&
        fieldsWithChecklistSupport.includes(predicate.key) && (
          <div className="g-text-slate-500 g-text-xs">
            Checklist: <DatasetLabel id={import.meta.env.PUBLIC_CLASSIC_BACKBONE_KEY} />
          </div>
        )}
    </>
  );
}
