import { FormattedMessage } from 'react-intl';
import DisplayName, { DisplayNameGetDataProps } from './DisplayName';
import { fetchWithCancel } from '@/utils/fetchWithCancel';
import isUndefined from 'lodash/isUndefined';
import { useCallback } from 'react';

// utility function to generate label for range or equal filters
function rangeOrEqualLabel(path: string) {
  return ({ id: value }: { id: string | number | object }) => {
    if (value?.type === 'range') {
      let translationKey;
      const from = value?.value?.gte || value?.value?.gt;
      const to = value?.value?.lte || value?.value?.lt;
      if (isUndefined(from)) {
        translationKey = 'lt';
      } else if (isUndefined(to)) {
        translationKey = 'gt';
      } else {
        translationKey = 'between';
      }
      return (
        <FormattedMessage
          id={`${path}.${translationKey}`}
          defaultMessage={'Filter name'}
          values={{ from, to }}
        />
      );
    } else if (value?.type === 'equals') {
      return (
        <FormattedMessage
          id={`${path}.e`}
          defaultMessage={'Filter name'}
          values={{ from: value.value }}
        />
      );
    } else {
      return <FormattedMessage id={`invalidValue`} defaultMessage={'Invalid value'} />;
    }
  };
}

export const YearLabel = rangeOrEqualLabel('intervals.compactTime');

function getEnumLabel({ template }: { template: (id: string) => string }) {
  return ({ id }: { id: string | number | object }) => {
    const getData = useCallback(
      ({ id }: DisplayNameGetDataProps) => ({
        promise: Promise.resolve({
          title: <FormattedMessage id={template(id.toString())} defaultMessage={id.toString()} />,
        }),
      }),
      []
    );

    return <DisplayName getData={getData} id={id} useHtml={false} />;
  };
}

function getGraphQlLabel({
  query,
  transform,
}: {
  query: string;
  transform?: (response: object) => { title: string; description?: string };
}) {
  const transformer = transform ?? ((response) => ({ title: response?.data?.item?.title }));
  return ({ id }: { id: string | number | object }) => {
    const getData = useCallback(({ id, config }: DisplayNameGetDataProps) => {
      const { promise, cancel } = fetchWithCancel(
        `${config.graphqlEndpoint}?query=${encodeURIComponent(
          query
        )}&variables=${encodeURIComponent(JSON.stringify({ key: id }))}`
      );
      return {
        promise: promise.then((response) => response.json()).then(transformer),
        cancel,
      };
    }, []);

    return <DisplayName getData={getData} id={id} useHtml={false} />;
  };
}

function getEndpointLabel({
  template,
  transform,
}: {
  template: ({ id, v1Endpoint }: { id: string | number | object; v1Endpoint: string }) => string;
  transform?: (response: object) => { title: string; description?: string };
}) {
  const transformer = transform ?? ((response) => ({ title: response?.title }));
  return ({ id }: { id: string | number | object }) => {
    const getData = useCallback(({ id, config }: DisplayNameGetDataProps) => {
      const endpoint = template({ id, v1Endpoint: config.v1Endpoint });
      const { promise, cancel } = fetchWithCancel(endpoint);
      return {
        promise: promise.then((response) => response.json()).then(transformer),
        cancel,
      };
    }, []);

    return <DisplayName getData={getData} id={id} useHtml={false} />;
  };
}

export function IdentityLabel({ id }: { id: string | number | object }) {
  const getData = useCallback(
    ({ id }: DisplayNameGetDataProps) => ({
      promise: Promise.resolve({ title: id.toString() }),
    }),
    []
  );
  return <DisplayName getData={getData} id={id} useHtml={false} />;
}

export function TaxonLabel({ id }: { id: string | number | object }) {
  const getData = useCallback(({ id, config }: DisplayNameGetDataProps) => {
    const { promise, cancel } = fetchWithCancel(
      `${config.graphqlEndpoint}?query=${encodeURIComponent(
        `query {
              taxon(key: "${id}") {
                formattedName
              }
            }`
      )}`
    );
    return {
      promise: promise
        .then((response) => response.json())
        .then((response) => ({ title: response.data.taxon.formattedName })),
      cancel,
    };
  }, []);

  return <DisplayName useHtml getData={getData} id={id} />;
}

export const LiteratureTypeLabel = getEnumLabel({ template: (id) => `enums.literatureType.${id}` });
export const LicenceLabel = getEnumLabel({ template: (id) => `enums.license.${id}` });
export const DatasetTypeLabel = getEnumLabel({ template: (id) => `enums.datasetType.${id}` });
export const TypeStatusLabel = getEnumLabel({ template: (id) => `enums.typeStatus.${id}` });
export const CountryLabel = getEnumLabel({ template: (id) => `enums.countryCode.${id}` });
export const RelevanceLabel = getEnumLabel({ template: (id) => `enums.relevance.${id}` });
export const TopicsLabel = getEnumLabel({ template: (id) => `enums.topics.${id}` });
export const BasisOfRecordLabel = getEnumLabel({ template: (id) => `enums.basisOfRecord.${id}` });

export const GadmGidLabel = getEndpointLabel({
  template: ({ id, v1Endpoint }) => `${v1Endpoint}/geocode/gadm/${id}`,
  transform: (response) => ({ title: response?.name }),
});

export const CollectionLabel = getGraphQlLabel({
  query: `query($key:ID!) {item:collection(key: $key) {title: name}}`,
});
export const InstitutionLabel = getGraphQlLabel({
  query: `query($key:ID!) {item:institution(key: $key) {title: name}}`,
});
export const DatasetLabel = getGraphQlLabel({
  query: `query($key:ID!) {item:dataset(key: $key) {title}}`,
});
export const PublisherLabel = getGraphQlLabel({
  query: `query($key:ID!) {item:organization(key: $key) {title}}`,
});
export const NetworkLabel = getGraphQlLabel({
  query: `query($key:ID!) {item:network(key: $key) {title}}`,
});

export function prettifyEnum(text: string) {
  return typeof text === 'string'
    ? text.charAt(0) + text.slice(1).toLowerCase().replace(/_/g, ' ')
    : 'Unknown';
}
