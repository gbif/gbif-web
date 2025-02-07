import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { defaultDateFormatProps } from '@/components/headerComponents';
import { FeatureList, SamplingEvent } from '@/components/highlights';
import { HyperText } from '@/components/hyperText';
import { licenseUrl2enum } from '@/components/identifierTag';
import Properties from '@/components/properties';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { useConfig } from '@/config/config';
import {
  DownloadKeyQuery,
  OccurrenceQuery,
  OccurrenceQueryVariables,
  SlowDownloadKeyQuery,
  SlowDownloadKeyQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink, LoaderArgs, useI18n } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { formatBytes } from '@/utils/formatBytes';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedDate, FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { BasicField } from '../../key/properties';
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
      request {
        predicate
        format
      }
      size
      status
      totalRecords
    }
  }
`;

const SLOW_DOWNLOAD_QUERY = /* GraphQL */ `
  query SlowDownloadKey($key: ID!, $language: String!, $source: String) {
    occurrence(key: $key) {
      key
      institution {
        name
      }
      collection {
        name
      }

      acceptedTaxon {
        vernacularNames(limit: 1, language: $language, source: $source) {
          results {
            vernacularName
            source
          }
        }
      }
    }
    literatureSearch(gbifOccurrenceKey: [$key]) {
      documents(size: 100) {
        results {
          title
          abstract
          authors {
            firstName
            lastName
          }
          literatureType
          year
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
  const config = useConfig();
  const { locale } = useI18n();
  const { formatMessage } = useIntl();

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
    if (!data?.occurrence?.key) return;
    slowLoad({
      variables: {
        key: '' + data?.occurrence?.key,
        language: locale.iso3LetterCode ?? 'eng',
        source: config?.vernacularNames?.sourceTitle,
      },
    });
  }, [
    slowLoad,
    data?.occurrence?.key,
    locale?.iso3LetterCode,
    config?.vernacularNames?.sourceTitle,
  ]);

  if (data?.download == null) throw new Error('404');
  const download = data.download;
  const slowOccurrence = slowData?.occurrence;

  const datasets = [
    {
      key: 'ser',
      title: 'hej med dig',
    },
    {
      key: 'ser',
      title: 'hej med dig',
    },
    {
      key: 'ser',
      title: 'hej med dig',
    },
  ];

  const { size, unit } = formatBytes(download.size ?? 0, 0);

  const licenseEnum =
    licenseUrl2enum[(download.license ?? '').replace(/http(s)?:/, '')] || 'UNSUPPORTED';

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
          <PageContainer topPadded hasDataHeader className="g-bg-white">
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
              {/* deleted information could go here */}
              {/* <ErrorMessage>
                This file has been deleted. You can still access all metadata of the original query
                and rerun the same query on data currently available. Contact helpdesk
              </ErrorMessage> */}
              {/* <Alert variant="warning" className="g-mt-4">
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
              </Alert> */}

              {/* <HeaderInfo>
                <HeaderInfoMain></HeaderInfoMain>
              </HeaderInfo> */}

              <Card className="g-mb-4 g-pt-8 g-mt-8">
                <CardContent>
                  <Properties breakpoint={800} className="[&>dt]:g-w-52">
                    <BasicField label="downloadKey.license">
                      <a href={download.license} className="g-underline">
                        <FormattedMessage id={`enums.license.${licenseEnum}`} />
                      </a>
                    </BasicField>
                    <BasicField label="downloadKey.file">
                      <span>
                        <span>
                          <FormattedNumber value={size} /> {unit}
                        </span>
                        <span className="g-text-slate-400 g-ms-4">
                          <FormattedMessage
                            id={`enums.downloadFormat.${download?.request?.format}`}
                          />
                        </span>
                      </span>
                    </BasicField>
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
                  <CardContent className="g-border-t g-border-gray-200 g-flex g-items-center !g-py-2">
                    <Button className="" variant="default" asChild>
                      <a href={download.downloadLink} download>
                        Download
                      </a>
                    </Button>
                    <div className="g-ms-4 g-text-slate-800">
                      <HyperText
                        text={formatMessage({ id: 'downloadKey.readDatauseAndTerms' })}
                        className="[&_a]:g-underline"
                      />
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>Query</CardTitle>
                </CardHeader>
                <CardContent>
                  <Properties breakpoint={800} className="[&>dt]:g-w-52">
                    <BasicField label="User' comment">
                      I made this download for my thesis
                    </BasicField>
                  </Properties>
                  <div>Predicate + SQL + machineDescription</div>
                  <div className="gbif-predicates">
                    <PredicateDisplay predicate={download?.request?.predicate} />
                  </div>
                </CardContent>
              </Card>

              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>Includes records from 1 dataset</CardTitle>
                  <FeatureList className="g-mt-2">
                    <SamplingEvent />
                    <BasicField label="Involved datasets">1</BasicField>
                    <BasicField label="Involved publishers">1</BasicField>
                    <BasicField label="Involved publishing countries">1</BasicField>
                  </FeatureList>
                </CardHeader>
                <CardContent className="!g-px-0">
                  <table className="g-w-full g-text-sm g-text-left rtl:g-text-right g-text-gray-500 dark:g-text-gray-400">
                    <thead className="g-text-slate-500 g-font-light g-bg-gray-50 dark:g-bg-gray-700 dark:g-text-gray-400 g-border-b">
                      <tr>
                        <th scope="col" className="g-px-6 g-py-3 g-font-normal">
                          <FormattedMessage id="grscicoll.name" />
                        </th>
                        <th
                          scope="col"
                          className="g-px-6 g-py-3 g-font-normal g-text-right rtl:g-text-left"
                        >
                          <FormattedMessage id="Records" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {datasets?.map((dataset) => {
                        return (
                          <tr
                            key={dataset.key}
                            className="g-bg-white g-border-b last:g-border-0 dark:g-bg-gray-800 dark:g-border-gray-700"
                          >
                            <td
                              scope="row"
                              className="g-px-6 g-py-3 g-font-medium g-text-slate-900 dark:g-text-white g-min-w-80"
                            >
                              <DynamicLink
                                className="g-underline"
                                to={`/dataset/${dataset.key}`}
                                pageId="datasetKey"
                                variables={{ key: dataset.key }}
                              >
                                {dataset.title}
                              </DynamicLink>{' '}
                            </td>
                            <td className="g-px-6 g-py-3 g-text-right rtl:g-text-left">10</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
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
