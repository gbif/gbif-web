import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorMessage } from '@/components/errorMessage';
import { defaultDateFormatProps, HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { HyperText } from '@/components/hyperText';
import Properties from '@/components/properties';
import { Tag } from '@/components/resultCards';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import useBelow from '@/hooks/useBelow';
import useQuery from '@/hooks/useQuery';
import { DynamicLink, LoaderArgs, useI18n } from '@/reactRouterPlugins';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { BasicField } from '../../key/properties';
import { AboutContent, ApiContent } from './help';

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
  const hideGlobe = useBelow(800);
  const config = useConfig();
  const { locale } = useI18n();

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
              <ErrorMessage>
                This file has been deleted. You can still access all metadata of the original query
                and rerun the same query on data currently available. Contact helpdesk
              </ErrorMessage>
              <HeaderInfo>
                <HeaderInfoMain>
                  {download.downloadLink && (
                    <Button className="g-mt-4" variant="default" asChild>
                      <a href={download.downloadLink} download>
                        Download
                      </a>
                    </Button>
                  )}
                  {/* <div>
                        {occurrence.gbifClassification?.classification && (
                          <div>
                            <TaxonClassification
                              className="g-flex g-mb-2"
                              majorOnly
                              classification={occurrence.gbifClassification?.classification}
                            />
                          </div>
                        )}

                        {occurrence.gadm?.level1 && (
                          <GadmClassification className="g-flex g-mb-1" gadm={occurrence.gadm}>
                            {occurrence.locality && <div>{occurrence.locality}</div>}
                          </GadmClassification>
                        )}
                        {!occurrence?.gadm?.level1 && occurrence.countryCode && (
                          <Location
                            countryCode={occurrence.countryCode}
                            city={occurrence.stateProvince}
                          />
                        )}
                      </div> */}
                  {/* <FeatureList className="g-mt-2">
                      {occurrence.volatile?.features?.isSamplingEvent && <SamplingEvent />}
                      {occurrence.typeStatus && occurrence.typeStatus?.length > 0 && (
                        <TypeStatus types={occurrence.typeStatus} />
                      )}
                      {occurrence?.references && <Homepage url={occurrence?.references} />}
                      {occurrence?.volatile?.features?.isSequenced && <Sequenced />}
                      {occurrence?.volatile?.features?.firstIIIF && (
                        <IIIF url={occurrence?.volatile?.features?.firstIIIF} />
                      )}
                    </FeatureList> */}
                </HeaderInfoMain>
              </HeaderInfo>
            </ArticleTextContainer>
          </PageContainer>
          <ArticleContainer className="g-bg-slate-100 g-pt-4">
            <ArticleTextContainer className="g-max-w-screen-xl">
              <Alert variant="warning" className="g-mb-4">
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

              <Card className="g-mb-4 g-pt-8">
                <CardContent>
                  <Properties breakpoint={800} className="[&>dt]:g-w-52">
                    <BasicField label="phrases.license">{download.license}</BasicField>
                    <BasicField label="phrases.file">955 Bytes Simple</BasicField>
                    <BasicField label="Involved datasets">1</BasicField>
                    <BasicField label="Involved publishers">1</BasicField>
                    <BasicField label="Involved publishing countries">1</BasicField>
                    <BasicField label="Please cite as">
                      <div>
                        <div>
                          GBIF.org (
                          <FormattedDate value={download?.created} {...defaultDateFormatProps} />)
                          GBIF Occurrence Download{' '}
                          {download?.doi ? `https://doi.org/${download.doi}` : ''}
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
                  <div>Make sure to read the data user agreement and citation guidelines.</div>
                </CardContent>
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
                </CardContent>
              </Card>

              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>Includes records from 1 dataset</CardTitle>
                </CardHeader>
                <CardContent className="!g-px-0">
                  <table className="g-w-full g-text-sm g-text-left rtl:g-text-right g-text-gray-500 dark:g-text-gray-400">
                    <thead className="g-text-slate-500 g-font-light g-bg-gray-50 dark:g-bg-gray-700 dark:g-text-gray-400 g-border-b">
                      <tr>
                        <th scope="col" className="g-px-6 g-py-3 g-font-normal">
                          <FormattedMessage id="grscicoll.name" />
                        </th>
                        <th scope="col" className="g-px-1 g-py-3 g-font-normal">
                          <FormattedMessage id="grscicoll.code" />
                        </th>
                        <th scope="col" className="g-px-1 g-py-3 g-font-normal">
                          <FormattedMessage id="grscicoll.description" />
                        </th>
                        <th
                          scope="col"
                          className="g-px-6 g-py-3 g-font-normal g-text-right rtl:g-text-left"
                        >
                          <FormattedMessage id="grscicoll.specimens" />
                        </th>
                        <th
                          scope="col"
                          className="g-px-6 g-py-3 g-font-normal g-text-right rtl:g-text-left"
                        >
                          <FormattedMessage id="tableHeaders.gbifNumberSpecimens" />
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
                              {!dataset.active && (
                                <Tag className="g-bg-red-700 g-text-white">
                                  <FormattedMessage id="grscicoll.inactiveCollection" />
                                </Tag>
                              )}
                            </td>
                            <td className="g-px-1 g-py-3">
                              <Tag className="g-whitespace-nowrap">{dataset.code}</Tag>
                            </td>
                            <td className="g-px-1 g-py-3">
                              <div
                                className="g-line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: dataset.excerpt ?? '' }}
                              ></div>
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
          </ArticleContainer>
        </article>
      </ErrorBoundary>
    </>
  );
}

export function DownloadKeySkeleton() {
  return <ArticleSkeleton />;
}
