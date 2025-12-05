import { css } from '@emotion/react';
import qs from 'query-string';
import React, { useContext } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import env from '../../../../../.env.json';
import { Button, ResourceLink, ResourceSearchLink } from '../../../../components';
import RouteContext from '../../../../dataManagement/RouteContext';
import { InlineFilterChip, LinkOption } from '../../../../widgets/Filter/utils/FilterChip';
import StandardSearchTable from '../../../StandardSearchTable';

const QUERY = `
query list($preservationType: [String!], $contentType: [String!], $identifier: String, $alternativeCode: String, $personalCollection: Boolean, $occurrenceCount: String, $code: String, $q: String, $offset: Int, $limit: Int, $country: [Country], $city: String, $name: String, $active: Boolean, $numberSpecimens: String, $displayOnNHCPortal: Boolean, $institutionKey: [GUID], $institution: [GUID], $taxonKey: [ID!], $recordedBy: [String!], $typeStatus: [String!], $descriptorCountry: [Country!]){
  collectionSearch(institutionKey: $institutionKey, institution: $institution, preservationType: $preservationType, contentType: $contentType, identifier: $identifier, alternativeCode: $alternativeCode, sortBy: NUMBER_SPECIMENS, sortOrder: DESC,  personalCollection: $personalCollection, occurrenceCount: $occurrenceCount, code: $code, q: $q, limit: $limit, offset: $offset, country: $country, city: $city, taxonKey: $taxonKey, recordedBy: $recordedBy, name: $name, descriptorCountry: $descriptorCountry, typeStatus: $typeStatus, active: $active, numberSpecimens: $numberSpecimens, displayOnNHCPortal: $displayOnNHCPortal) {
    count
    offset
    limit
    results {
      key
      name
      code
      active
      numberSpecimens
      occurrenceCount
      city
      country
      institutionKey
      institutionName
    }
  }
}
`;

const defaultTableConfig = {
  columns: [
    {
      trKey: 'tableHeaders.title',
      value: {
        key: 'name',
        formatter: (value, item) => (
          <div>
            <div>
              <ResourceLink
                type="collectionKey"
                id={item.key}
                data-loader
                style={{ marginRight: 4 }}
              >
                {value}
              </ResourceLink>
              {!item.active && (
                <span
                  style={{
                    padding: '0 3px',
                    background: 'tomato',
                    color: 'white',
                    borderRadius: 2,
                  }}
                >
                  Inactive
                </span>
              )}
            </div>
            <div style={{ color: '#aaa' }}>
              {item.institutionKey && (
                <LinkOption discreet type="institutionKey" id={item.institutionKey}>
                  <InlineFilterChip filterName="institutionKey" values={[item.institutionKey]}>
                    <span data-loader>{item.institutionName}</span>
                  </InlineFilterChip>
                </LinkOption>
              )}
              {!item.institutionKey && (
                <span style={{ fontStyle: 'italic' }} data-loader>
                  <FormattedMessage id="collection.institutionUnknown" />
                </span>
              )}
            </div>
          </div>
        ),
      },
      width: 'wide',
    },
    {
      trKey: 'filters.code.name',
      value: {
        key: 'code',
        hideFalsy: true,
      },
      filterKey: 'code',
      cellFilter: true,
    },
    {
      trKey: 'filters.country.name',
      value: {
        key: 'key',
        formatter: (value, item) => {
          const countryCode = item.country;
          return countryCode ? (
            <InlineFilterChip filterName="country" values={[countryCode]}>
              <FormattedMessage id={`enums.countryCode.${countryCode}`} />
            </InlineFilterChip>
          ) : null;
        },
        hideFalsy: true,
      },
      filterKey: 'countryGrSciColl',
    },
    {
      trKey: 'filters.city.name',
      value: {
        filterKey: 'city',
        key: 'key',
        formatter: (value, item) => {
          const city = item.city;
          return city ? (
            <InlineFilterChip filterName="city" values={[city]}>
              {city}
            </InlineFilterChip>
          ) : null;
        },
        hideFalsy: true,
      },
      filterKey: 'city',
    },
    {
      trKey: 'tableHeaders.numberSpecimens',
      filterKey: 'numberSpecimens',
      value: {
        key: 'numberSpecimens',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true,
      },
    },
    {
      trKey: 'tableHeaders.gbifNumberSpecimens',
      value: {
        key: 'occurrenceCount',
        formatter: (value, item) => <FormattedNumber value={value} />,
        hideFalsy: true,
        rightAlign: true,
      },
    },
    // {
    //   trKey: 'tableHeaders.active',
    //   value: {
    //     key: 'active',
    //     formatter: (value, item) => {
    //       return <InlineFilterChip filterName="active" values={[value.toString()]}>
    //         <FormattedMessage
    //           id={`enums.yesNo.${value.toString()}`}
    //         /></InlineFilterChip>
    //     },
    //   },
    //   filterKey: 'active'
    // }
  ],
};

function Table() {
  // const history = useHistory();
  const routeContext = useContext(RouteContext);

  function AdditionalEmptyMessage({ currentFilterContext, rootPredicate }) {
    const query = {
      basisOfRecord: [
        'PRESERVED_SPECIMEN',
        'FOSSIL_SPECIMEN',
        'MATERIAL_SAMPLE',
        'LIVING_SPECIMEN',
        'MATERIAL_CITATION',
      ],
    };
    if (currentFilterContext?.filter?.must?.taxonKeyGrSciColl?.length > 0) {
      query.taxonKey = currentFilterContext.filter.must.taxonKeyGrSciColl;
    }
    if (currentFilterContext?.filter?.must?.collectionDescriptorCountry?.length > 0) {
      query.country = currentFilterContext.filter.must.collectionDescriptorCountry;
    }
    if (currentFilterContext?.filter?.must?.typeStatus?.length > 0) {
      query.typeStatus = currentFilterContext.filter.must.typeStatus;
    }
    if (currentFilterContext?.filter?.must?.recordedBy?.length > 0) {
      query.recordedBy = currentFilterContext.filter.must.recordedBy;
    }
    if (currentFilterContext?.filter?.must?.identifiedBy?.length > 0) {
      query.identifiedBy = currentFilterContext.filter.must.identifiedBy;
    }
    if (currentFilterContext?.filter?.must?.institutionKeySingle?.length > 0) {
      query.institutionKey = currentFilterContext.filter.must.institutionKeySingle;
    }
    // if (Object.keys(query).length > 0) {
    const queryString = qs.stringify(query);
    return (
      <div
        css={css`
          max-width: 400px;
          margin: 12px;
          margin-top: 36px;
          color: var(--color600);
        `}
      >
        <div
          css={css`
            background: var(--paperBackground);
            border: 1px solid var(--paperBorderColor);
            border-radius: var(--borderRadiusPx);
            padding: 24px;
          `}
        >
          <div
            css={css`
              margin-bottom: 12px;
            `}
          >
            <FormattedMessage id="grscicoll.collectionSearchNoResultsMessage" />
          </div>
          <ResourceSearchLink
            type="occurrenceSearch"
            queryString={`&${queryString}`}
            style={{ fontSize: 14 }}
          >
            <Button>
              <FormattedMessage id="grscicoll.searchForSpecimens" />
            </Button>
          </ResourceSearchLink>
        </div>
      </div>
    );
  }

  return (
    <StandardSearchTable
      graphQuery={QUERY}
      AdditionalEmptyMessage={AdditionalEmptyMessage}
      resultKey="collectionSearch"
      defaultTableConfig={defaultTableConfig}
      exportTemplate={({ filter }) =>
        `${env.API_V1}/grscicoll/collection/export?format=TSV&${filter ? qs.stringify(filter) : ''}`
      }
    />
  );
}

export default Table;
