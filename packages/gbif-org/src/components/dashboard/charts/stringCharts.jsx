import { GadmClassification } from '@/components/classification';
import { FormattedMessage } from 'react-intl';
import { KeyChartGenerator } from './KeyChartGenerator';

// a small wrapper to make it easier to add new charts
function getStringChart({ fieldName, title, subtitleKey, ...rest }) {
  const titleInput = title ?? (
    <FormattedMessage id={`filters.${fieldName}.name`} defaultMessage={fieldName} />
  );
  return ({
    predicate,
    detailsRoute,
    currentFilter = {}, //excluding root predicate
    disableOther = false,
    disableUnknown = false,
    title = titleInput,
    ...props
  }) => {
    return (
      <KeyChartGenerator
        {...{
          predicate,
          detailsRoute,
          currentFilter,
          fieldName: fieldName,
          disableUnknown,
          disableOther,
          facetSize: 10,
          title,
          subtitleKey: 'dashboard.numberOfOccurrences',
        }}
        {...rest}
        {...props}
      />
    );
  };
}

export const InstitutionCodes = getStringChart({
  fieldName: 'institutionCode',
  title: <FormattedMessage id="filters.institutionCode.name" defaultMessage="Institution code" />,
});

export const ProjectId = getStringChart({
  fieldName: 'projectId',
  title: <FormattedMessage id="filters.projectId.name" defaultMessage="Project ID" />,
});

export const DatasetId = getStringChart({
  fieldName: 'datasetId',
  title: <FormattedMessage id="filters.datasetId.name" defaultMessage="Dataset ID" />,
});

export const CollectionCodes = getStringChart({
  fieldName: 'collectionCode',
  title: <FormattedMessage id="filters.collectionCode.name" defaultMessage="collection code" />,
});

export const StateProvince = getStringChart({
  fieldName: 'stateProvince',
  showFreeTextWarning: true,
  title: <FormattedMessage id="filters.stateProvince.name" defaultMessage="State province" />,
  gqlEntity: `occurrences {documents(size: 1) {results {stateProvince}}}`,
  transform: (data) => {
    return data?.search?.facet?.results?.map((x) => {
      const title = x.entity?.documents?.results?.[0]?.stateProvince ?? x.key;
      return {
        key: x.key,
        count: x.count,
        title: title,
        plainTextTitle: title,
        filter: { stateProvince: [title] },
      };
    });
  },
});

export const WaterBody = getStringChart({
  fieldName: 'waterBody',
  showFreeTextWarning: true,
  title: <FormattedMessage id="filters.waterBody.name" defaultMessage="Water body" />,
  gqlEntity: `occurrences {documents(size: 1) {results {waterBody}}}`,
  transform: (data) => {
    return data?.search?.facet?.results?.map((x) => {
      const title = x.entity?.documents?.results?.[0]?.waterBody ?? x.key;
      return {
        key: x.key,
        count: x.count,
        title: title,
        plainTextTitle: title,
        filter: { waterBody: [title] },
      };
    });
  },
});

const getNormalizedName = (r) =>
  r
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

export const IdentifiedBy = getStringChart({
  fieldName: 'identifiedBy',
  title: <FormattedMessage id="filters.identifiedBy.name" defaultMessage="Identified by" />,
  gqlEntity: `occurrences {documents(size: 1) {results {identifiedBy}}}`,
  transform: (data) => {
    return data?.search?.facet?.results?.map((x) => {
      // extract the identifiedBy value from the first result. Filter the recordedBy array by lower case matching and select the first match
      const title =
        x.entity?.documents?.results?.[0]?.identifiedBy?.find(
          (r) => getNormalizedName(r) === x.key
        ) ?? x.key;
      return {
        key: x.key,
        count: x.count,
        title: title,
        plainTextTitle: title,
        filter: { identifiedBy: [title] },
      };
    });
  },
});

export const RecordedBy = getStringChart({
  fieldName: 'recordedBy',
  title: <FormattedMessage id="filters.recordedBy.name" defaultMessage="Recorded by" />,
  gqlEntity: `occurrences {documents(size: 1) {results {recordedBy}}}`,
  transform: (data) => {
    return data?.search?.facet?.results?.map((x) => {
      // extract the recordedBy value from the first result. Filter the recordedBy array by lower case matching and select the first match
      const title =
        x.entity?.documents?.results?.[0]?.recordedBy?.find(
          (r) => getNormalizedName(r) === x.key
        ) ?? x.key;
      return {
        key: x.key,
        count: x.count,
        title: title,
        plainTextTitle: title,
        filter: { recordedBy: [title] },
      };
    });
  },
});

export const Preparations = getStringChart({
  fieldName: 'preparations',
  title: <FormattedMessage id="filters.preparations.name" defaultMessage="Preparations" />,
  gqlEntity: `occurrences {documents(size: 1) {results {preparations}}}`,
});

export const HigherGeography = getStringChart({
  showFreeTextWarning: true,
  fieldName: 'higherGeography',
  title: <FormattedMessage id="filters.higherGeography.name" defaultMessage="Higher geography" />,
  gqlEntity: `occurrences {documents(size: 1) {results {higherGeography}}}`,
  transform: (data) => {
    return data?.search?.facet?.results?.map((x) => {
      const title = x.key;
      return {
        key: x.key,
        count: x.count,
        title: x.key,
        // description: <Classification>
        //   {x.entity?.documents?.results?.[0]?.higherGeography.map(h => <span>{h}</span>)}
        // </Classification>,
        plainTextTitle: title,
        filter: { higherGeography: [x.key] },
      };
    });
  },
});

export const CatalogNumber = getStringChart({
  fieldName: 'catalogNumber',
  title: <FormattedMessage id="filters.catalogNumber.name" defaultMessage="Catalogue number" />,
  gqlEntity: `occurrences {documents(size: 1) {results {catalogNumber}}}`,
  transform: (data) => {
    return data?.search?.facet?.results?.map((x) => {
      // extract the catalogNumber value from the first result.
      const title = x.entity?.documents?.results?.[0]?.catalogNumber ?? x.key;
      return {
        key: x.key,
        count: x.count,
        title: title,
        plainTextTitle: title,
        filter: { catalogNumber: [title] },
      };
    });
  },
});

export const EventId = getStringChart({
  fieldName: 'eventId',
  title: <FormattedMessage id="filters.eventId.name" defaultMessage="Event ID" />,
});

export const SampleSizeUnit = getStringChart({
  fieldName: 'sampleSizeUnit',
  title: <FormattedMessage id="filters.sampleSizeUnit.name" defaultMessage="Sample size unit" />,
});

export const SamplingProtocol = getStringChart({
  fieldName: 'samplingProtocol',
  showFreeTextWarning: true,
  title: <FormattedMessage id="filters.samplingProtocol.name" defaultMessage="Sampling protocol" />,
  gqlEntity: `occurrences {documents(size: 1) {results {samplingProtocol}}}`,
  transform: (data) => {
    return data?.search?.facet?.results?.map((x) => {
      // extract the recordedBy value from the first result. Filter the recordedBy array by lower case matching and select the first match
      const title =
        x.entity?.documents?.results?.[0]?.samplingProtocol?.find(
          (r) => getNormalizedName(r) === x.key
        ) ?? x.key;
      return {
        key: x.key,
        count: x.count,
        title: title,
        plainTextTitle: title,
        filter: { samplingProtocol: [title] },
      };
    });
  },
});

function filterLevels(obj, targetGid) {
  const result = {};

  for (const level in obj) {
    if (obj.hasOwnProperty(level)) {
      const currentGid = obj[level].gid;
      result[level] = obj[level];

      if (currentGid === targetGid) {
        break;
      }
    }
  }

  return result;
}

export const GadmGid = getStringChart({
  fieldName: 'gadmGid',
  title: <FormattedMessage id="filters.gadmGid.name" defaultMessage="Gadm GID" />,
  gqlEntity: `occurrences {documents(size: 1) {results {gadm}}}`,
  transform: (data) => {
    return data?.search?.facet?.results?.map((x) => {
      const a = Object.keys(x.entity?.documents?.results?.[0]?.gadm ?? {});
      const gadm = filterLevels(x.entity?.documents?.results?.[0]?.gadm, x.key);
      const titleEntry = a?.find((r) => r.gid === x.key);
      const title = titleEntry?.name ?? x.key;
      return {
        key: x.key,
        count: x.count,
        title: <GadmClassification gadm={gadm} />,
        plainTextTitle: title,
        filter: { gadmGid: [x.key] },
      };
    });
  },
});
