import { fetchWithCancel } from '@/utils/fetchWithCancel';
import { VocabularyType } from '@/utils/suggestEndpoints';
import { truncate } from '@/utils/truncate';
import isUndefined from 'lodash/isUndefined';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import DisplayName, { DisplayNameGetDataProps } from './DisplayName';

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
          values={{ from: value?.value, is: value?.value }}
        />
      );
    } else {
      return <FormattedMessage id={`invalidValue`} defaultMessage={'Invalid value'} />;
    }
  };
}

export const WildcardLabel = ({ id }: { id: string | number | object }) => {
  const value = id?.value ?? id;
  if (typeof value !== 'string') {
    return <span>Unknown</span>;
  }
  const trimmed = value?.trim();
  const displayValue = trimmed.length !== value.length ? `"${value}"` : value;

  if (id?.type === 'like' && typeof id?.value === 'string') {
    return <i>{displayValue}</i>;
  }

  return displayValue;
};

export const YearLabel = rangeOrEqualLabel('intervals.compactTime');
export const CoordinateUncertaintyLabel = rangeOrEqualLabel('intervals.compactMeters');
export const DepthLabel = rangeOrEqualLabel('intervals.compactMeters');
export const ElevationLabel = rangeOrEqualLabel('intervals.compactMeters');
export const QuantityLabel = rangeOrEqualLabel('intervals.description');
export const OrganismQuantityLabel = rangeOrEqualLabel('intervals.description');
export const SampleSizeValueLabel = rangeOrEqualLabel('intervals.description');
export const RelativeOrganismQuantityLabel = rangeOrEqualLabel('intervals.description');

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

export function PolygonLabel({ id }: { id: string | number | object }) {
  const getData = useCallback(({ id }: DisplayNameGetDataProps) => {
    const { promise, cancel } = fetchWithCancel(
      `${import.meta.env.PUBLIC_WEB_UTILS}/polygon-name?wkt=${id}`
    );
    return {
      promise: promise
        .then((response) => response.json())
        .then((data) => ({ title: truncate(data.title, 100) })),
      cancel,
    };
  }, []);

  return <DisplayName getData={getData} id={id} useHtml={false} />;
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
  transform?: (
    response: object,
    { id, intl, config }: DisplayNameGetDataProps
  ) => { title: string; description?: string };
}) {
  const transformer = transform ?? ((response) => ({ title: response?.title }));
  return ({ id }: { id: string | number | object }) => {
    const getData = useCallback(({ id, intl, config, currentLocale }: DisplayNameGetDataProps) => {
      const endpoint = template({ id, v1Endpoint: config.v1Endpoint });
      const { promise, cancel } = fetchWithCancel(endpoint);
      return {
        promise: promise
          .then((response) => response.json())
          .then((response) => transformer(response, { id, intl, config, currentLocale })),
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
                formattedName(useFallback: true)
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

function getVocabularyLabel(result: VocabularyType, { currentLocale }: DisplayNameGetDataProps) {
  const vocabularyLocale = currentLocale?.vocabularyLocale ?? currentLocale.code ?? 'en';

  // transform result labels to an object with language as keys
  const labels = result.label.reduce((acc: Record<string, string>, label) => {
    acc[label.language] = label.value;
    return acc;
  }, {});

  const title = labels[vocabularyLocale] || labels.en || result.name || 'Unknown';
  return { title };
}

export const LiteratureTypeLabel = getEnumLabel({ template: (id) => `enums.literatureType.${id}` });
export const LicenceLabel = getEnumLabel({ template: (id) => `enums.license.${id}` });
export const DatasetTypeLabel = getEnumLabel({ template: (id) => `enums.datasetType.${id}` });
export const TypeStatusLabel = getEnumLabel({ template: (id) => `enums.typeStatus.${id}` });
export const CountryLabel = getEnumLabel({ template: (id) => `enums.countryCode.${id}` });
export const RelevanceLabel = getEnumLabel({ template: (id) => `enums.relevance.${id}` });
export const TopicsLabel = getEnumLabel({ template: (id) => `enums.topics.${id}` });
export const BasisOfRecordLabel = getEnumLabel({ template: (id) => `enums.basisOfRecord.${id}` });
export const MediaTypeLabel = getEnumLabel({ template: (id) => `enums.mediaType.${id}` });
export const MonthLabel = getEnumLabel({ template: (id) => `enums.month.${id}` });
export const ContinentLabel = getEnumLabel({ template: (id) => `enums.continent.${id}` });
export const EndpointTypeLabel = getEnumLabel({ template: (id) => `enums.endpointType.${id}` });
export const DwcaExtensionLabel = getEnumLabel({ template: (id) => `enums.dwcaExtension.${id}` });
export const TaxonRankLabel = getEnumLabel({ template: (id) => `enums.taxonRank.${id}` });
export const TaxonStatusLabel = getEnumLabel({ template: (id) => `enums.taxonomicStatus.${id}` });
export const IucnRedListCategoryLabel = getEnumLabel({
  template: (id) => `enums.iucnRedListCategory.${id}`,
});
export const occurrenceIssueLabel = getEnumLabel({
  template: (id) => `enums.occurrenceIssue.${id}`,
});
export const occurrenceStatusLabel = getEnumLabel({
  template: (id) => `enums.occurrenceStatus.${id}`,
});
export const booleanLabel = getEnumLabel({ template: (id) => `enums.yesNo.${id}` });

export const GadmGidLabel = getEndpointLabel({
  template: ({ id, v1Endpoint }) => `${v1Endpoint}/geocode/gadm/${id}`,
  transform: (response) => ({ title: response?.name }),
});

export const TypeStatusVocabularyLabel = getEndpointLabel({
  template: ({ id, v1Endpoint }) => `${v1Endpoint}/vocabularies/TypeStatus/concepts/${id}`,
  transform: getVocabularyLabel,
});

export const establishmentMeansLabel = getEndpointLabel({
  template: ({ id, v1Endpoint }) => `${v1Endpoint}/vocabularies/EstablishmentMeans/concepts/${id}`,
  transform: getVocabularyLabel,
});

export const preservationTypeLabel = getEndpointLabel({
  template: ({ id, v1Endpoint }) => `${v1Endpoint}/vocabularies/PreservationType/concepts/${id}`,
  transform: getVocabularyLabel,
});

export const collectionContentTypeLabel = getEndpointLabel({
  template: ({ id, v1Endpoint }) =>
    `${v1Endpoint}/vocabularies/CollectionContentType/concepts/${id}`,
  transform: getVocabularyLabel,
});

export const InstitutionTypeLabel = getEndpointLabel({
  template: ({ id, v1Endpoint }) => `${v1Endpoint}/vocabularies/InstitutionType/concepts/${id}`,
  transform: getVocabularyLabel,
});

export const InstitutionDisciplineLabel = getEndpointLabel({
  template: ({ id, v1Endpoint }) => `${v1Endpoint}/vocabularies/Discipline/concepts/${id}`,
  transform: getVocabularyLabel,
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
