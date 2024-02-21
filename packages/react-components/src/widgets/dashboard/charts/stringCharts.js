import { jsx, css } from '@emotion/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { KeyChartGenerator } from './KeyChartGenerator';

// a small wrapper to make it easier to add new charts
function getStringChart({ fieldName, title, subtitleKey, ...rest }) {
  return ({
    predicate,
    detailsRoute,
    currentFilter = {}, //excluding root predicate
    disableOther = false,
    disableUnknown = false,
    title = title ?? <FormattedMessage id={`filters.${fieldName}.name`} defaultMessage={fieldName} />,
    ...props
  }) => {
    return <KeyChartGenerator {...{
      predicate, detailsRoute, currentFilter,
      fieldName: fieldName,
      disableUnknown,
      disableOther,
      facetSize: 10,
      title,
      subtitleKey: "dashboard.numberOfOccurrences",
    }} {...rest} {...props} />
  }
}

export const InstitutionCodes = getStringChart({
  fieldName: 'institutionCode', 
  title: <FormattedMessage id="filters.institutionCode.name" defaultMessage="Institution code" />
});

export const CollectionCodes = getStringChart({
  fieldName: 'collectionCode', 
  title: <FormattedMessage id="filters.collectionCode.name" defaultMessage="collection code" />
});

export const StateProvince = getStringChart({
  fieldName: 'stateProvince', 
  title: <FormattedMessage id="filters.stateProvince.name" defaultMessage="State province" />
});

const getNormalizedName = r => r.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export const IdentifiedBy = getStringChart({
  fieldName: 'identifiedBy', 
  title: <FormattedMessage id="filters.identifiedBy.name" defaultMessage="Identified by" />,
  gqlEntity: `occurrences {documents(size: 1) {results {identifiedBy}}}`,
  transform: data => {
    return data?.search?.facet?.results?.map(x => {
      // extract the identifiedBy value from the first result. Filter the recordedBy array by lower case matching and select the first match
      const title = x.entity?.documents?.results?.[0]?.identifiedBy?.find(r => getNormalizedName(r) === x.key);
      return {
        key: x.key,
        count: x.count,
        title: title,
        plainTextTitle: title,
        filter: { identifiedBy: [title] },
      }
    });
  }
});

export const RecordedBy = getStringChart({
  fieldName: 'recordedBy', 
  title: <FormattedMessage id="filters.recordedBy.name" defaultMessage="Recorded by" />,
  gqlEntity: `occurrences {documents(size: 1) {results {recordedBy}}}`,
  transform: data => {
    return data?.search?.facet?.results?.map(x => {
      // extract the recordedBy value from the first result. Filter the recordedBy array by lower case matching and select the first match
      const title = x.entity?.documents?.results?.[0]?.recordedBy?.find(r => getNormalizedName(r) === x.key) ?? x.key;
      return {
        key: x.key,
        count: x.count,
        title: title,
        plainTextTitle: title,
        filter: { recordedBy: [title] },
      }
    });
  }
});

export const Preparations = getStringChart({
  fieldName: 'preparations', 
  title: <FormattedMessage id="filters.preparations.name" defaultMessage="Preparations" />,
  gqlEntity: `occurrences {documents(size: 1) {results {preparations}}}`,
  // transform: data => {
  //   return data?.search?.facet?.results?.map(x => {
  //     // extract the recordedBy value from the first result. Filter the recordedBy array by lower case matching and select the first match
  //     const title = x.entity?.documents?.results?.[0]?.recordedBy?.find(r => getNormalizedName(r) === x.key) ?? x.key;
  //     return {
  //       key: x.key,
  //       count: x.count,
  //       title: title,
  //       plainTextTitle: title,
  //       filter: { recordedBy: [title] },
  //     }
  //   });
  // }
});


