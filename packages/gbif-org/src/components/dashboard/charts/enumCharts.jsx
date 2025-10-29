import { FormattedMessage } from 'react-intl';
// import monthEnum from '../../../enums/basic/month.json';
import { ChartWrapper, EnumChartGenerator } from './EnumChartGenerator';
import { useConfig } from '@/config/config';

function StandardEnumChart({
  predicate,
  q,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  fieldName,
  enumKeys,
  enableUnknown = false,
  showUnknownInChart = false,
  enableOther = false,
  facetSize = 10,
  subtitleKey = 'dashboard.numberOfOccurrences',
  translationTemplate,
  titleTranslationId,
  ...props
}) {
  return (
    <EnumChartGenerator
      {...{
        predicate,
        q,
        detailsRoute,
        currentFilter,
        enumKeys,
        translationTemplate: translationTemplate ?? `enums.${fieldName}.{key}`,
        fieldName: fieldName,
        disableUnknown: !enableUnknown,
        showUnknownInChart,
        disableOther: !enableOther,
        facetSize,
        title: (
          <FormattedMessage
            id={titleTranslationId ?? `filters.${fieldName}.name`}
            defaultMessage={fieldName}
          />
        ),
        subtitleKey,
      }}
      {...props}
    />
  );
}

export function Licenses(props) {
  return (
    <StandardEnumChart
      {...{
        ...props,
        fieldName: 'license',
        options: ['PIE', 'TABLE', 'COLUMN'],
      }}
    />
  );
}

export function BasisOfRecord(props) {
  return (
    <StandardEnumChart
      {...{
        ...props,
        fieldName: 'basisOfRecord',
      }}
    />
  );
}

export function Months(props) {
  return (
    <StandardEnumChart
      {...{
        facetSize: 12,
        enumKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        enableUnknown: true,
        showUnknownInChart: true,
        ...props,
        fieldName: 'month',
        options: ['PIE', 'TABLE', 'COLUMN'],
      }}
    />
  );
}

export function MediaType(props) {
  return (
    <StandardEnumChart
      {...{
        facetSize: 10,
        options: ['PIE', 'TABLE', 'COLUMN'],
        ...props,
        fieldName: 'mediaType',
      }}
    />
  );
}

export function OccurrenceIssue(props) {
  return (
    <StandardEnumChart
      {...{
        ...props,
        fieldName: 'issue',
        translationTemplate: 'enums.occurrenceIssue.{key}',
        titleTranslationId: 'filters.occurrenceIssue.name',
        // options: ['TABLE'],
      }}
    />
  );
}

export function Country(props) {
  return (
    <StandardEnumChart
      {...{
        filterKey: 'country',
        fieldName: 'countryCode',
        enableOther: true,
        enableUnknown: true,
        titleTranslationId: 'filters.country.name',
        ...props,
      }}
    />
  );
}

export function PublishingCountryCode(props) {
  return (
    <StandardEnumChart
      {...{
        filterKey: 'publishingCountryCode',
        fieldName: 'publishingCountry',
        translationTemplate: 'enums.countryCode.{key}',
        enableOther: true,
        enableUnknown: true,
        titleTranslationId: 'filters.publishingCountryCode.name',
        ...props,
      }}
    />
  );
}

export function Continent(props) {
  return (
    <StandardEnumChart
      {...{
        filterKey: 'continent',
        fieldName: 'continent',
        enableOther: true,
        enableUnknown: true,
        options: ['PIE', 'TABLE', 'COLUMN'],
        titleTranslationId: 'filters.continent.name',
        ...props,
      }}
    />
  );
}

export function DwcaExtension(props) {
  return (
    <StandardEnumChart
      {...{
        ...props,
        fieldName: 'dwcaExtension',
      }}
    />
  );
}

export function Protocol(props) {
  return (
    <StandardEnumChart
      {...{
        translationTemplate: 'enums.endpointType.{key}',
        options: ['COLUMN', 'PIE', 'TABLE'],
        ...props,
        fieldName: 'protocol',
      }}
    />
  );
}

export function IucnCounts(props) {
  const { theme } = useConfig();
  const GQL_QUERY = `
    query summary($q: String, $hasPredicate: Predicate, $size: Int, $from: Int, $checklistKey: ID) {
      search: occurrenceSearch(q: $q, predicate: $hasPredicate) {
        documents(size: 0) {
          total
        }
        cardinality {
          total: iucnRedListCategory(checklistKey: $checklistKey)
        }
        facet {
          results: iucnRedListCategory(size: $size, from: $from, checklistKey: $checklistKey) {
            key
            count
          }
        }
      }
    }
  `;

  return (
    <ChartWrapper
      {...{
        fieldName: 'iucnRedListCategory',
        options: ['PIE', 'TABLE', 'COLUMN'],
        enableUnknown: false,
        showUnknownInChart: false,
        value2colorMap: theme?.iucnColors,
        enableOther: false,
        facetSize: 10,
        disableUnknown: true,
        disableOther: true,
        subtitleKey: 'dashboard.numberOfOccurrences',
        gqlQuery: GQL_QUERY,
        predicateKey: 'iucnRedListCategory',
        applyChecklistKey: true,
        translationTemplate: 'enums.iucnRedListCategory.{key}',
        title: (
          <FormattedMessage
            id="filters.iucnRedListCategory.name"
            defaultMessage="iucnRedListCategory"
          />
        ),
        ...props,
      }}
    />
  );
}

export function LiteratureTopics({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return (
    <EnumChartGenerator
      {...{
        predicate,
        detailsRoute,
        currentFilter,
        fieldName: 'topics',
        translationTemplate: 'enums.topics.{key}',
        facetSize: 50,
        disableOther: true,
        disableUnknown: true,
        options: ['PIE'],
        searchType: 'literatureSearch',
        title: <FormattedMessage id="filters.topics.name" defaultMessage="Topics" />,
        subtitleKey: 'dashboard.numberOfOccurrences',
      }}
      {...props}
    />
  );
}

export function LiteratureType({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return (
    <EnumChartGenerator
      {...{
        predicate,
        detailsRoute,
        currentFilter,
        fieldName: 'literatureType',
        translationTemplate: 'enums.literatureType.{key}',
        facetSize: 50,
        disableOther: true,
        disableUnknown: true,
        options: ['PIE'],
        searchType: 'literatureSearch',
        title: <FormattedMessage id="filters.literatureType.name" defaultMessage="Type" />,
        subtitleKey: 'dashboard.numberOfOccurrences',
      }}
      {...props}
    />
  );
}

export function LiteratureRelevance({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return (
    <EnumChartGenerator
      {...{
        predicate,
        detailsRoute,
        currentFilter,
        fieldName: 'relevance',
        translationTemplate: 'enums.relevance.{key}',
        facetSize: 50,
        disableOther: true,
        disableUnknown: true,
        options: ['PIE'],
        searchType: 'literatureSearch',
        title: <FormattedMessage id="filters.relevance.name" defaultMessage="Relevance" />,
        subtitleKey: 'dashboard.numberOfOccurrences',
      }}
      {...props}
    />
  );
}

export function LiteratureCountriesOfResearcher({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return (
    <EnumChartGenerator
      {...{
        predicate,
        detailsRoute,
        currentFilter,
        fieldName: 'countriesOfResearcher',
        translationTemplate: 'enums.countryCode.{key}',
        facetSize: 10,
        disableOther: true,
        disableUnknown: true,
        options: ['TABLE', 'PIE', 'COLUMN'],
        searchType: 'literatureSearch',
        title: (
          <FormattedMessage
            id="filters.countriesOfResearcher.name"
            defaultMessage="countriesOfResearcher"
          />
        ),
        subtitleKey: 'dashboard.numberOfOccurrences',
      }}
      {...props}
    />
  );
}

export function LiteratureCountriesOfCoverage({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return (
    <EnumChartGenerator
      {...{
        predicate,
        detailsRoute,
        currentFilter,
        fieldName: 'countriesOfCoverage',
        translationTemplate: 'enums.countryCode.{key}',
        facetSize: 10,
        disableOther: true,
        disableUnknown: true,
        options: ['TABLE', 'PIE', 'COLUMN'],
        searchType: 'literatureSearch',
        title: (
          <FormattedMessage
            id="filters.countriesOfCoverage.name"
            defaultMessage="countriesOfCoverage"
          />
        ),
        subtitleKey: 'dashboard.numberOfOccurrences',
      }}
      {...props}
    />
  );
}
