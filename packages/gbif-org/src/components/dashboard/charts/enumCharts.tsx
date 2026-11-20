import { useConfig } from '@/config/config';
import { FormattedMessage, useIntl } from 'react-intl';
import { ChartWrapper, EnumChartGenerator } from './EnumChartGenerator';
import { FacetResultRow } from './GroupByTable';

type StandardEnumChartProps = {
  predicate?: unknown;
  q?: string;
  detailsRoute?: string;
  currentFilter?: Record<string, unknown>; //excluding root predicate
  fieldName: string;
  enumKeys?: Array<string | number>;
  enableUnknown?: boolean;
  showUnknownInChart?: boolean;
  enableOther?: boolean;
  facetSize?: number;
  subtitleKey?: string;
  translationTemplate?: string;
  titleTranslationId?: string;
  [key: string]: unknown;
};

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
}: StandardEnumChartProps) {
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

type ChartProps = Omit<StandardEnumChartProps, 'fieldName'>;

export function Licenses(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        ...props,
        includeMapPredicate: true,
        fieldName: 'license',
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
      }}
    />
  );
}

export function BasisOfRecord(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        ...props,
        includeMapPredicate: true,
        fieldName: 'basisOfRecord',
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
      }}
    />
  );
}

export function Months(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        facetSize: 12,
        enumKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        enableUnknown: true,
        showUnknownInChart: true,
        options: ['COLUMN', 'TABLE', 'PIE', 'MAP'],
        includeMapPredicate: true,
        ...props,
        fieldName: 'month',
      }}
    />
  );
}

export function MediaType(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        facetSize: 10,
        ...props,
        fieldName: 'mediaType',
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        includeMapPredicate: true,
      }}
    />
  );
}

export function OccurrenceIssue(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        ...props,
        fieldName: 'issue',
        translationTemplate: 'enums.occurrenceIssue.{key}',
        titleTranslationId: 'filters.occurrenceIssue.name',
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        includeMapPredicate: true,
      }}
    />
  );
}

export function Country(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        filterKey: 'country',
        fieldName: 'countryCode',
        enableOther: true,
        enableUnknown: true,
        titleTranslationId: 'filters.country.name',
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        includeMapPredicate: true,
        ...props,
      }}
    />
  );
}

export function PublishingCountryCode(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        filterKey: 'publishingCountryCode',
        fieldName: 'publishingCountry',
        translationTemplate: 'enums.countryCode.{key}',
        enableOther: true,
        enableUnknown: true,
        titleTranslationId: 'filters.publishingCountryCode.name',
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        includeMapPredicate: true,
        ...props,
      }}
    />
  );
}

export function PublishedByGbifRegion(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        filterKey: 'publishedByGbifRegion',
        fieldName: 'publishedByGbifRegion',
        translationTemplate: 'enums.gbifRegion.{key}',
        enableOther: true,
        enableUnknown: true,
        titleTranslationId: 'filters.publishedByGbifRegion.name',
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        includeMapPredicate: true,
        ...props,
      }}
    />
  );
}

export function Continent(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        filterKey: 'continent',
        fieldName: 'continent',
        enableOther: true,
        enableUnknown: true,
        titleTranslationId: 'filters.continent.name',
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        includeMapPredicate: true,
        ...props,
      }}
    />
  );
}

export function DwcaExtension(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        includeMapPredicate: true,
        ...props,
        fieldName: 'dwcaExtension',
      }}
    />
  );
}

export function Protocol(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        translationTemplate: 'enums.endpointType.{key}',
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        includeMapPredicate: true,
        ...props,
        fieldName: 'protocol',
      }}
    />
  );
}

export function IucnCounts(props: ChartProps) {
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
            occurrences {
              metaPredicate
              _meta
            }
          }
        }
      }
    }
  `;

  return (
    <ChartWrapper
      {...{
        fieldName: 'iucnRedListCategory',
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
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

export function OccurrenceStatus(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        includeMapPredicate: true,
        disablePaging: true,
        ...props,
        fieldName: 'occurrenceStatus',
      }}
    />
  );
}

export function GbifRegion(props: ChartProps) {
  return (
    <StandardEnumChart
      {...{
        enableOther: true,
        enableUnknown: true,
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        includeMapPredicate: true,
        ...props,
        fieldName: 'gbifRegion',
      }}
    />
  );
}

export function TaxonomicIssue(props: ChartProps) {
  // taxonomic issues depend on the checklist, so the facet takes a checklistKey like the IUCN chart
  const GQL_QUERY = `
    query summary($q: String, $predicate: Predicate, $size: Int, $from: Int, $checklistKey: ID) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        documents(size: 0) {
          total
        }
        cardinality {
          total: taxonomicIssue
        }
        facet {
          results: taxonomicIssue(size: $size, from: $from, checklistKey: $checklistKey) {
            key
            count
            occurrences {
              metaPredicate
              _meta
            }
          }
        }
      }
    }
  `;

  return (
    <ChartWrapper
      {...{
        options: ['PIE', 'TABLE', 'COLUMN', 'MAP'],
        facetSize: 10,
        disableUnknown: true,
        disableOther: true,
        subtitleKey: 'dashboard.numberOfOccurrences',
        gqlQuery: GQL_QUERY,
        predicateKey: 'taxonomicIssue',
        applyChecklistKey: true,
        translationTemplate: 'enums.occurrenceIssue.{key}',
        title: (
          <FormattedMessage
            id="filters.occurrenceTaxonomicIssue.name"
            defaultMessage="Taxonomic issues"
          />
        ),
        ...props,
      }}
    />
  );
}

type BooleanFacetData = {
  search?: {
    facet?: {
      results?: Array<{
        key: boolean | string;
        count: number;
        occurrences?: FacetResultRow['occurrences'];
      }>;
    };
  };
};

// Boolean facets return true/false keys, while the boolean filters store the strings 'true' and
// 'false'. Use string keys so that clicking a value sets the same filter as the filter UI does.
function BooleanChart({ fieldName, ...props }: ChartProps & { fieldName: string }) {
  const intl = useIntl();
  return (
    <EnumChartGenerator
      {...{
        fieldName,
        translationTemplate: 'enums.yesNo.{key}',
        disableUnknown: true,
        disableOther: true,
        disablePaging: true,
        facetSize: 2,
        // no map view: the map predicate for boolean facets is rejected by the API
        options: ['PIE', 'TABLE', 'COLUMN'],
        subtitleKey: 'dashboard.numberOfOccurrences',
        title: <FormattedMessage id={`filters.${fieldName}.name`} defaultMessage={fieldName} />,
        transform: (data: unknown): FacetResultRow[] | undefined => {
          return (data as BooleanFacetData)?.search?.facet?.results?.map((x) => {
            const key = String(x.key);
            const title = intl.formatMessage({ id: `enums.yesNo.${key}`, defaultMessage: key });
            return {
              key,
              title,
              plainTextTitle: title,
              count: x.count,
              occurrences: x.occurrences,
              filter: { [fieldName]: [key] },
            };
          });
        },
        ...props,
      }}
    />
  );
}

export function IsInCluster(props: ChartProps) {
  return <BooleanChart {...props} fieldName="isInCluster" />;
}

export function IsSequenced(props: ChartProps) {
  return <BooleanChart {...props} fieldName="isSequenced" />;
}

export function IsRepatriated(props: ChartProps) {
  return <BooleanChart {...props} fieldName="repatriated" />;
}

type LiteratureChartProps = {
  predicate?: unknown;
  detailsRoute?: string;
  currentFilter?: Record<string, unknown>; //excluding root predicate
  [key: string]: unknown;
};

export function LiteratureTopics({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}: LiteratureChartProps) {
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
        options: ['TABLE'],
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
}: LiteratureChartProps) {
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
}: LiteratureChartProps) {
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
        options: ['PIE', 'TABLE', 'COLUMN'],
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
}: LiteratureChartProps) {
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
}: LiteratureChartProps) {
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
