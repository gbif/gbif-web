import { DataHeader } from '@/components/dataHeader';
import { DownloadAsTSVLink } from '@/components/downloadAsTSVLink';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorMessage } from '@/components/errorMessage';
import { filterConfigTypes } from '@/components/filters/filterTools';
import { rangeOrTerm } from '@/components/filters/rangeFilter';
import { defaultDateFormatProps, HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { HelpLine } from '@/components/helpText';
import { CitationIcon, FeatureList, GenericFeature } from '@/components/highlights';
import { HyperText } from '@/components/hyperText';
import { LicenceTag, licenseUrl2enum } from '@/components/identifierTag';
import Properties from '@/components/properties';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FilterType } from '@/contexts/filter';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import Base64JsonParam from '@/dataManagement/filterAdapter/useFilterParams';
import {
  DownloadKeyQuery,
  OccurrenceQuery,
  OccurrenceQueryVariables,
  SlowDownloadKeyQuery,
  SlowDownloadKeyQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink, LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { formatBytes } from '@/utils/formatBytes';
import { ParamQuery } from '@/utils/querystring';
import { required } from '@/utils/required';
import { constantCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdPerson } from 'react-icons/md';
import { FormattedDate, FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { BasicField } from '../../key/properties';
import { Filters, useFilters } from '../../search/filters';
import { searchConfig } from '../../search/searchConfig';
import { DatasetTable } from './DatasetTable';
import { AboutContent, ApiContent } from './help';
import { PredicateDisplay } from './predicate';

const DOWNLOAD_QUERY = /* GraphQL */ `
  query DownloadKey($key: ID!) {
    download(key: $key) {
      created
      doi
      downloadLink
      eraseAfter
      key
      license
      modified
      numberDatasets
      numberOrganizations
      numberPublishingCountries
      request {
        predicate
        sql
        format
        description
        gbifMachineDescription
      }
      size
      status
      totalRecords
    }
    datasetsByDownload(key: $key, limit: 50, offset: 0) {
      limit
      offset
      endOfRecords
      count
      results {
        datasetKey
        datasetTitle
        numberRecords
      }
    }
  }
`;

const SLOW_DOWNLOAD_QUERY = /* GraphQL */ `
  query SlowDownloadKey($key: ID!) {
    literatureSearch(gbifDownloadKey: [$key], size: 100) {
      documents {
        size
        from
        total
        results {
          abstract
          identifiers {
            doi
          }
          websites
        }
      }
    }
  }
`;

export async function downloadKeyLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<OccurrenceQuery, OccurrenceQueryVariables>(DOWNLOAD_QUERY, {
    key,
  });
}

export function DownloadKey() {
  const { data } = useLoaderData() as { data: DownloadKeyQuery };
  const { formatMessage } = useIntl();
  const [filter, setFilter] = useState<FilterType>();
  const [query, setQuery] = useState<ParamQuery>();
  const { filters } = useFilters({ searchConfig });

  const {
    data: slowData,
    loading: slowLoading,
    error: slowError,
    load: slowLoad,
  } = useQuery<SlowDownloadKeyQuery, SlowDownloadKeyQueryVariables>(SLOW_DOWNLOAD_QUERY, {
    lazyLoad: true,
    throwAllErrors: false,
  });

  useEffect(() => {
    if (!data?.download?.key) return;
    slowLoad({
      variables: {
        key: '' + data?.download?.key,
      },
    });
    const { error, filter } = getPredicateAsFilter({
      predicate: data?.download?.request?.predicate,
      filters,
    });
    if (!error && filter) {
      const { filter: v1Filter, errors: tooComplexError } = filter2v1(filter, searchConfig);
      if (tooComplexError) {
        // if we cannot serialize the filter to version 1 API, then just serialize the json and put it in the filter param
        setQuery({ filter: Base64JsonParam.encode(filter) });
      } else {
        setQuery(v1Filter);
      }
      setFilter(filter);
    } else {
      setFilter(undefined);
    }
  }, [slowLoad, data?.download, setFilter]);

  if (data?.download === null) throw new Error('404');
  const download = data.download;
  const literatureDocuments = slowData?.literatureSearch?.documents;

  const datasetsByDownload = data.datasetsByDownload;

  const { size, unit } = formatBytes(download.size ?? 0, 0);

  const licenseEnum =
    licenseUrl2enum[(download.license ?? '').replace(/http(s)?:/, '')] || 'UNSUPPORTED';

  const parameters = download?.request?.gbifMachineDescription?.parameters;

  const showPostponeOption = false; // TODO this should be shown if the user is the creator of the download and the download is eligible for deletion
  return (
    <>
      <Helmet>
        <title>Download</title>
      </Helmet>
      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={download?.key?.toString()} />}
        doi={download.doi}
      ></DataHeader>
      <ErrorBoundary invalidateOn={download?.key}>
        <article>
          <PageContainer topPadded hasDataHeader>
            <ArticleTextContainer className="g-max-w-screen-xl g-pb-4">
              <ArticlePreTitle
                secondary={
                  download.created ? (
                    <FormattedDate value={download?.created} {...defaultDateFormatProps} />
                  ) : (
                    <FormattedMessage id="phrases.unknownDate" />
                  )
                }
              >
                <FormattedMessage id="downloadKey.download" defaultMessage="Download" />
              </ArticlePreTitle>
              <ArticleTitle className="lg:g-text-3xl">
                845,705 occurrences included in download
              </ArticleTitle>

              <HeaderInfo>
                <HeaderInfoMain>
                  <FeatureList>
                    <GenericFeature>
                      <LicenceTag value={download.license} />
                    </GenericFeature>

                    {literatureDocuments?.total > 0 && (
                      <GenericFeature>
                        <CitationIcon />
                        <DynamicLink
                          className="hover:g-underline g-text-inherit"
                          pageId="literatureSearch"
                          searchParams={{ gbifDownloadKey: download.key }}
                        >
                          <FormattedMessage
                            id="counts.nCitations"
                            values={{ total: literatureDocuments?.total }}
                          />
                        </DynamicLink>
                      </GenericFeature>
                    )}
                  </FeatureList>

                  {showPostponeOption && (
                    <Alert variant="warning" className="g-mt-4">
                      <AlertDescription>
                        <HyperText
                          className="[&_a]:g-underline [&_a]:g-text-inherit"
                          text={
                            'Unless GBIF discovers citations of this download, the data file is eligible for deletion after March 14, 2019.\n\nRead more about our deletion policy.'
                          }
                          sanitizeOptions={{ ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br'] }}
                        />
                        <Button className="g-mt-2" variant="outline">
                          Postpone deletion
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  {download?.status === 'FILE_ERASED' && (
                    <ErrorMessage>
                      This file has been deleted. You can still access all metadata of the original
                      query and rerun the same query on data currently available. Contact helpdesk
                    </ErrorMessage>
                  )}
                </HeaderInfoMain>
              </HeaderInfo>
            </ArticleTextContainer>
          </PageContainer>
          <PageContainer className="g-bg-slate-100 g-pt-4">
            <ArticleTextContainer className="g-max-w-screen-xl g-pb-4">
              <Card className="g-mb-4 g-pt-8 g-mt-8">
                <CardContent>
                  <Properties breakpoint={800} className="[&>dt]:g-w-52">
                    <BasicField label="phrases.pleaseCiteAs">
                      <div>
                        <div>
                          GBIF.org (
                          <FormattedDate value={download?.created} {...defaultDateFormatProps} />)
                          GBIF Occurrence Download{' '}
                          {download?.doi
                            ? `https://doi.org/${download.doi}`
                            : `${import.meta.env.PUBLIC_GBIF_ORG}/occurrence/download/${
                                download.key
                              }`}
                        </div>
                        <div style={{ marginTop: '1em' }}>
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={`https://data.crosscite.org/application/x-research-info-systems/${download.doi}`}
                              className="g-me-1 g-text-inherit"
                            >
                              RIS
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a
                              className="g-text-inherit"
                              href={`https://data.crosscite.org/application/x-bibtex/${download.doi}`}
                            >
                              BibTex
                            </a>
                          </Button>
                        </div>
                      </div>
                    </BasicField>
                  </Properties>
                </CardContent>
                {download.downloadLink && (
                  <CardContent className="g-border-t g-border-gray-200 !g-py-4 g-flex g-gap-4">
                    <div className="g-w-52 g-flex-none">
                      <Button className="g-flex-none" variant="default" asChild>
                        <a href={download.downloadLink} download>
                          Download archive
                        </a>
                      </Button>
                      <div className="g-text-slate-800 g-flex-auto g-text-sm">
                        <div>
                          <FormattedNumber value={size} /> {unit}
                        </div>
                        <div className="g-text-slate-400">
                          <FormattedMessage
                            id={`enums.downloadFormat.${download?.request?.format}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="g-text-slate-600 g-flex-auto">
                      <HyperText
                        text={formatMessage({ id: 'downloadKey.readDatauseAndTerms' })}
                        className="[&_a]:g-underline"
                      />

                      <div className="g-mt-2 g-text-sm">
                        Related FAQs
                        <ul className="g-list-disc g-ps-4">
                          <li>
                            <HelpLine id="opening-gbif-csv-in-excel" />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
              {download?.request?.description && (
                <div className="g-flex g-gap-4 g-mb-8 g-mt-8">
                  <div className="g-flex-none">
                    <div className="g-rounded-full g-bg-gray-200 g-p-2">
                      <MdPerson className="md:g-text-4xl sm:g-text-2xl" />
                    </div>
                  </div>
                  <div className="g-flex-auto g-flex-grow g-gap-4">
                    <div className="g-flex-auto g-inline-block">
                      <div className="g-text-slate-600">Description by download creator</div>
                      <Card className="g-p-4">{download?.request?.description}</Card>
                    </div>
                  </div>
                </div>
              )}
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle className="g-flex g-items-center g-gap-4">
                    <span className="g-py-1">Query</span>
                    {query && (
                      <Button asChild variant="primaryOutline" size="sm">
                        <DynamicLink pageId="occurrenceSearch" searchParams={query}>
                          Rerun
                        </DynamicLink>
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                {parameters && (
                  <CardContent>
                    <div>
                      <div className="g-mb-4">
                        <FormattedMessage id="customSqlDownload.sqlMachineDescriptionIntro" />
                      </div>
                      <Properties breakpoint={800} className="[&>dt]:g-w-52">
                        {parameters?.taxonomy && (
                          <BasicField label="customSqlDownload.taxonomicDimension">
                            <FormattedMessage
                              id={`customSqlDownload.taxon.${parameters.taxonomy}`}
                            />
                          </BasicField>
                        )}
                        {parameters?.temporal && (
                          <BasicField label="customSqlDownload.temporalDimension">
                            <FormattedMessage
                              id={`customSqlDownload.taxon.${parameters.temporal}`}
                            />
                          </BasicField>
                        )}
                        {parameters?.spatial && (
                          <BasicField label="customSqlDownload.spatialDimension">
                            <FormattedMessage
                              id={`customSqlDownload.taxon.${parameters.spatial}`}
                            />
                          </BasicField>
                        )}
                        {parameters?.resolution && (
                          <BasicField label="customSqlDownload.spatialResolution">
                            <FormattedMessage
                              id={`customSqlDownload.resolution.${parameters.spatial}.${parameters.resolution}`}
                            />
                          </BasicField>
                        )}
                      </Properties>
                    </div>
                  </CardContent>
                )}
                <CardContent className="g-border-t g-border-gray-200 g-pt-4 md:g-pt-8">
                  <div className="gbif-predicates">
                    <PredicateDisplay predicate={download?.request?.predicate} />
                  </div>
                </CardContent>
                {download?.request?.sql && (
                  <CardContent className="g-border-t g-border-gray-200 !g-p-0">
                    <div className="g-text-sm">
                      <pre className="g-max-full g-overflow-auto g-p-4 md:g-p-8">
                        {download?.request.sql}
                      </pre>
                    </div>
                  </CardContent>
                )}
              </Card>
              <Card className="g-mb-4">
                <CardHeader className="!g-pb-1">
                  <CardTitle>
                    <FormattedMessage
                      id="downloadKey.nConstituentDatasets"
                      values={{ total: download?.numberDatasets }}
                    />
                  </CardTitle>
                  <FeatureList className="g-mt-2 g-text-slate-700">
                    <GenericFeature>
                      <FormattedMessage id="downloadKey.constituentOrganizations" />
                      <span className="g-me-1">:</span>
                      <FormattedNumber value={download.numberOrganizations} />
                    </GenericFeature>
                    <GenericFeature>
                      <FormattedMessage id="downloadKey.constituentPublishingCountries" />
                      <span className="g-me-1">:</span>
                      <FormattedNumber value={download.numberPublishingCountries} />
                    </GenericFeature>
                  </FeatureList>
                  <div className="g-flex g-justify-end">
                    <DownloadAsTSVLink
                      tsvUrl={`${import.meta.env.PUBLIC_API_V1}/occurrence/download/${
                        download.key
                      }/datasets/export?format=TSV`}
                    />
                  </div>
                </CardHeader>
                {datasetsByDownload && (download?.numberDatasets ?? 0) > 0 && (
                  <CardContent className="!g-px-0 g-border-t">
                    <DatasetTable
                      downloadKey={download.key}
                      initialDatasets={datasetsByDownload.results}
                      limit={datasetsByDownload.limit}
                      count={datasetsByDownload.count}
                    />
                  </CardContent>
                )}
              </Card>
            </ArticleTextContainer>
          </PageContainer>
        </article>
      </ErrorBoundary>
    </>
  );
}

export function DownloadKeySkeleton() {
  return <ArticleSkeleton />;
}

const predicateExample = {
  predicate: {
    type: 'and',
    predicates: [
      {
        type: 'equals',
        key: 'TAXON_KEY',
        value: '1',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'LAST_INTERPRETED',
        value: '2024-01-02',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'ESTABLISHMENT_MEANS',
        value: 'introduced',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'VERBATIM_SCIENTIFIC_NAME',
        value: 'somtehign',
        matchCase: false,
      },
      {
        type: 'and',
        predicates: [
          {
            type: 'greaterThanOrEquals',
            key: 'ORGANISM_QUANTITY',
            value: '1.0',
            matchCase: false,
          },
          {
            type: 'lessThanOrEquals',
            key: 'ORGANISM_QUANTITY',
            value: '100000.0',
            matchCase: false,
          },
        ],
      },
      {
        type: 'equals',
        key: 'ORGANISM_QUANTITY_TYPE',
        value: 'uniy',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'SAMPLE_SIZE_UNIT',
        value: 'm',
        matchCase: false,
      },
      {
        type: 'and',
        predicates: [
          {
            type: 'greaterThanOrEquals',
            key: 'SAMPLE_SIZE_VALUE',
            value: '426.0',
            matchCase: false,
          },
          {
            type: 'lessThanOrEquals',
            key: 'SAMPLE_SIZE_VALUE',
            value: '1000000.0',
            matchCase: false,
          },
        ],
      },
      {
        type: 'and',
        predicates: [
          {
            type: 'greaterThanOrEquals',
            key: 'RELATIVE_ORGANISM_QUANTITY',
            value: '1.0E-5',
            matchCase: false,
          },
          {
            type: 'lessThanOrEquals',
            key: 'RELATIVE_ORGANISM_QUANTITY',
            value: '1.0',
            matchCase: false,
          },
        ],
      },
      {
        type: 'equals',
        key: 'OCCURRENCE_STATUS',
        value: 'present',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'LIFE_STAGE',
        value: 'Hatchling',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'PATHWAY',
        value: 'hullFouling',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'DEGREE_OF_ESTABLISHMENT',
        value: 'widespreadInvasive',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'IUCN_RED_LIST_CATEGORY',
        value: 'CR',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'PREPARATIONS',
        value: 'tes',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'SEX',
        value: 'MALE',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'SEX',
        value: 'Male',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'EARLIEST_EON_OR_LOWEST_EONOTHEM',
        value: 'g',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'EARLIEST_EON_OR_LOWEST_EONOTHEM',
        value: 'Cenozoic',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'GROUP',
        value: 'h',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'FORMATION',
        value: 'f',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'MEMBER',
        value: 'm',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'BED',
        value: 'b',
        matchCase: false,
      },
      {
        type: 'equals',
        key: 'GBIF_REGION',
        value: 'NORTH_AMERICA',
        matchCase: false,
      },
    ],
  },
  notificationAddresses: [],
  sendNotification: false,
  format: 'SIMPLE_CSV',
  type: 'OCCURRENCE',
  verbatimExtensions: [],
};

/* 
attempt to get a predicate as an occurrence filter. This isn't a perfect implementation, it just aims to catch the most frequent cases. 
Aside from that we could choose to add a predicate filter on occurrence search and link to that
*/
function getPredicateAsFilter({ predicate, filters }: { predicate: any; filters: Filters }): {
  error?: string;
  filter?: FilterType;
} {
  if (!predicate) {
    return { error: 'NO_PREDICATE' };
  }
  if (predicate.type === 'or') {
    return { error: 'UNABLE_TO_CONVERT' };
  }
  if (predicate.type === 'not') {
    return { error: 'UNABLE_TO_CONVERT' };
  }
  if (predicate.type !== 'and') {
    predicate = { type: 'and', predicates: [predicate] };
  }
  if (!searchConfig.fields) {
    return { error: 'NO_SEARCH_CONFIG' };
  }
  const supportConstantCaseFields = Object.keys(searchConfig.fields).map((x) => constantCase(x));

  // make mapping of key values from constant to those existing in searchConfig.fields
  const fieldMap = Object.keys(searchConfig.fields).reduce((acc, key) => {
    acc[constantCase(key)] = key;
    return acc;
  }, {} as { [key: string]: string });

  // check that all predicates. With a different test per type
  // for example if 'AND', then only acceptable if exactly 2 children and it is a range greatherThanOrEquals and lessThanOrEquals of the same key and a known range type
  // if 'EQUALS' then it is a simple key value pair and always okay if we support the filter

  const filter: FilterType = {
    must: {},
    mustNot: {},
  };

  /*
  check if there are not predicates among the children. If so, they must be of different keys. And they must be either 'in' or 'equals' or 'like'
  this isn't a catch all solution since type:or predicates with children of type:and could be used to create a not predicate. And it would in some cases be accepted by the UI. 
  For those edge cases I tend to say we should create a predicate filter and link to that instead
   */
  const notPredicates = predicate.predicates.filter((p) => p.type === 'not');
  // split predicates into type:not and others
  const regularPredicates = predicate.predicates.filter((p) => p.type !== 'not');
  const flattenedNotPredicates = notPredicates.flatMap((p) => p.predicate);

  // check that they are all different keys
  const notKeys = flattenedNotPredicates.map((p) => p.key);
  if (notKeys.length !== new Set(notKeys).size) {
    return { error: 'UNABLE_TO_CONVERT' };
  }
  // now check that they all use supported types
  for (const p of flattenedNotPredicates) {
    if (!supportConstantCaseFields.includes(p.key)) {
      return { error: 'UNABLE_TO_CONVERT' };
    }
    if (p.type !== 'equals' && p.type !== 'in' && p.type !== 'like') {
      return { error: 'UNABLE_TO_CONVERT' };
    }
  }

  // process not predicates
  for (const p of flattenedNotPredicates) {
    const camelKey = fieldMap[p.key];
    if (p.key && !supportConstantCaseFields.includes(p.key)) {
      return { error: 'UNABLE_TO_CONVERT' };
    }
    if (p.type === 'equals') {
      filter.mustNot[camelKey] = (filter.mustNot[camelKey] ?? []).concat([p.value]);
      continue;
    }

    if (p.type === 'in') {
      filter.mustNot[camelKey] = (filter.mustNot[camelKey] ?? []).concat(p.values);
      continue;
    }

    if (p.type === 'like') {
      // TODO we should check that the field supports like filtering in the UI
      if (filters[camelKey].filterType === filterConfigTypes.WILDCARD) {
        filter.mustNot[camelKey] = (filter.mustNot[camelKey] ?? []).concat([
          { type: 'like', value: p.value },
        ]);
        continue;
      }
      return { error: 'UNABLE_TO_CONVERT' };
    }

    return { error: 'UNABLE_TO_CONVERT' };
  }

  // proces regular predicates
  for (const p of regularPredicates) {
    const camelKey = fieldMap[p.key];
    const camelParameter = fieldMap[p.parameter];
    if (p.key && !supportConstantCaseFields.includes(p.key)) {
      return { error: 'UNABLE_TO_CONVERT' };
    }
    if (p.type === 'equals') {
      filter.must[camelKey] = (filter.must[camelKey] ?? []).concat([p.value]);
      continue;
    }

    if (p.type === 'in') {
      filter.must[camelKey] = (filter.must[camelKey] ?? []).concat(p.values);
      continue;
    }

    if (p.type === 'like') {
      // TODO we should check that the field supports like filtering in the UI
      if (filters[camelKey].filterType === filterConfigTypes.WILDCARD) {
        filter.must[camelKey] = (filter.must[camelKey] ?? []).concat([
          { type: 'like', value: p.value },
        ]);
        continue;
      }
      return { error: 'UNABLE_TO_CONVERT' };
    }

    if (p.type === 'greaterThanOrEquals') {
      if (searchConfig.fields[camelKey]?.v1?.supportedTypes?.includes('range')) {
        filter.must[camelKey] = (filter.must[camelKey] ?? []).concat([rangeOrTerm(`${p.value},`)]);
        continue;
      }
      return { error: 'UNABLE_TO_CONVERT' };
    }

    if (p.type === 'lessThanOrEquals') {
      if (searchConfig.fields[camelKey]?.v1?.supportedTypes?.includes('range')) {
        filter.must[camelKey] = (filter.must[camelKey] ?? []).concat([rangeOrTerm(`,${p.value}`)]);
        continue;
      }
      return { error: 'UNABLE_TO_CONVERT' };
    }

    if (p.type === 'and') {
      // this is only accepted in the case that there are exactly 2 children and they are of the same key. One greaterThanOrEquals and one lessThanOrEquals
      if (p.predicates.length === 2) {
        const subPredicates = p.predicates.sort((a, b) => a.type.localeCompare(b.type));
        const p1 = subPredicates[0];
        const p2 = subPredicates[1];
        if (
          p1.type === 'greaterThanOrEquals' &&
          p2.type === 'lessThanOrEquals' &&
          p1.key === p2.key
        ) {
          // check that it is a known key
          if (!supportConstantCaseFields.includes(p1.key)) {
            return { error: 'UNABLE_TO_CONVERT' };
          }
          if (searchConfig.fields[fieldMap[p1.key]]?.v1?.supportedTypes?.includes('range')) {
            filter.must[fieldMap[p1.key]] = (filter.must[fieldMap[p1.key]] ?? []).concat([
              rangeOrTerm(`${p1.value},${p2.value}`),
            ]);
            continue;
          }
        }
      }
      console.log('Failed to convert', p);
      return { error: 'UNABLE_TO_CONVERT' };
    }

    if (p.type === 'isNotNull') {
      // check if allowed. There is a risk here that different naming is used. I will ignore that for now
      if (filters[camelParameter].allowExistence) {
        filter.must[camelParameter] = (filter.must[camelParameter] ?? []).concat([
          { type: 'isNotNull' },
        ]);
        continue;
      }
      console.log('Failed to convert', p);
      return { error: 'UNABLE_TO_CONVERT' };
    }

    if (p.type === 'isNull') {
      // check if allowed. There is a risk here that different naming is used. I will ignore that for now
      if (filters[camelParameter].allowExistence) {
        filter.must[camelParameter] = (filter.must[camelParameter] ?? []).concat([
          { type: 'isNull' },
        ]);
        continue;
      }
      console.log('Failed to convert', p);
      return { error: 'UNABLE_TO_CONVERT' };
    }

    return { error: 'UNABLE_TO_CONVERT' };
  }
  return { filter };
}
