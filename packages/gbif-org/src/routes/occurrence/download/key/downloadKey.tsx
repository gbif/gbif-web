import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { defaultDateFormatProps, HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
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
import useBelow from '@/hooks/useBelow';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs, useI18n } from '@/reactRouterPlugins';
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
import { redirect, useLoaderData } from 'react-router-dom';
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

  const response = await graphql.query<OccurrenceQuery, OccurrenceQueryVariables>(DOWNLOAD_QUERY, {
    key,
  });

  // If the occurrence does not exist, we try to redirect to the occurrence tombstone page
  const result = await response.json();
  if (result.errors?.some((error) => error.message === '404: Not Found')) {
    return redirect('fragment');
  }

  return result;
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
              {download?.created && (
                <Card className="g-mb-4">
                  <CardHeader>
                    <CardTitle>
                      <FormattedMessage id="phrases.citation" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Properties breakpoint={800} className="[&>dt]:g-w-52">
                      <BasicField label="phrases.citeAs">
                        <div>
                          <div>
                            GBIF.org (
                            <FormattedDate value={download?.created} {...defaultDateFormatProps} />)
                            GBIF Occurrence Download{' '}
                            {download?.doi ? `https://doi.org/${download.doi}` : ''}
                          </div>
                          <div style={{ marginTop: '1em' }}>
                            <Button asChild variant="outline">
                              <a
                                href={`https://data.crosscite.org/application/x-research-info-systems/${download.doi}`}
                                className="g-me-1 g-text-inherit"
                              >
                                RIS
                              </a>
                            </Button>
                            <Button asChild variant="outline">
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
                </Card>
              )}
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
