import { FormattedMessage } from 'react-intl';
import DisplayName, { DisplayNameGetDataProps } from './DisplayName';
import { fetchWithCancel } from '@/utils/fetchWithCancel';
import isUndefined from 'lodash/isUndefined';
import { useCallback } from 'react';

// utility function to generate label for range or equal filters
export function rangeOrEqualLabel(path: string) {
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

export function getEnumLabel({ template }: { template: (id: string) => string }) {
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

export function IdentityLabel({ id }: { id: string | number | object }) {
  const getData = useCallback(
    ({ id }: DisplayNameGetDataProps) => ({
      promise: Promise.resolve({ title: id.toString() }),
    }),
    []
  );
  return <DisplayName getData={getData} id={id} useHtml={false} />;
}

export function InstitutionLabel({ id }: { id: string | number | object }) {
  const getData = useCallback(({ id, config }: DisplayNameGetDataProps) => {
    const { promise, cancel } = fetchWithCancel(
      `${config.graphqlEndpoint}?query=${encodeURIComponent(
        `query {item:institution(key: "${id}") {title: name}}`
      )}`
    );
    return {
      promise: promise
        .then((response) => response.json())
        .then((response) => ({ title: response.data.item.title })),
      cancel,
    };
  }, []);

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

export function PublisherLabel({ id }: { id: string | number | object }) {
  const getData = useCallback(({ id, config }: DisplayNameGetDataProps) => {
    const { promise, cancel } = fetchWithCancel(
      `${config.graphqlEndpoint}?query=${encodeURIComponent(
        `query {item:organization(key: "${id.toString()}") {title}}`
      )}`
    );
    return {
      promise: promise
        .then((response) => response.json())
        .then((response) => ({ title: response.data.item.title })),
      cancel,
    };
  }, []);

  return <DisplayName getData={getData} id={id} useHtml={false} />;
}

export function DatasetLabel({ id }: { id: string | number | object }) {
  const getData = useCallback(({ id, config }: DisplayNameGetDataProps) => {
    const { promise, cancel } = fetchWithCancel(
      `${config.graphqlEndpoint}?query=${encodeURIComponent(
        `query {item:dataset(key: "${id.toString()}") {title}}`
      )}`
    );
    return {
      promise: promise
        .then((response) => response.json())
        .then((response) => ({ title: response.data.item.title })),
      cancel,
    };
  }, []);

  return <DisplayName getData={getData} id={id} useHtml={false} />;
}

export const LiteratureTypeLabel = getEnumLabel({ template: (id) => `enums.literatureType.${id}` });
export const LicenceLabel = getEnumLabel({ template: (id) => `enums.license.${id}` });
export const DatasetTypeLabel = getEnumLabel({ template: (id) => `enums.datasetType.${id}` });
export const TypeStatusLabel = getEnumLabel({ template: (id) => `enums.typeStatus.${id}` });
export const CountryLabel = getEnumLabel({ template: (id) => `enums.countryCode.${id}` });
export const RelevanceLabel = getEnumLabel({ template: (id) => `enums.relevance.${id}` });
export const TopicsLabel = getEnumLabel({ template: (id) => `enums.topics.${id}` });
