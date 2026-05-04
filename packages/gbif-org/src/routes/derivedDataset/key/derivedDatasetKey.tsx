import { DataHeader } from '@/components/dataHeader';
import { LongDate } from '@/components/dateFormats';
import PageMetaData from '@/components/PageMetaData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/largeCard';
import { DerivedDatasetQuery, DerivedDatasetQueryVariables } from '@/gql/graphql';
import { DynamicLink, LoaderArgs } from '@/reactRouterPlugins';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { BasicField } from '@/routes/occurrence/key/properties';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { required } from '@/utils/required';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';
import { Button } from '@/components/ui/button';
import { MdDownload } from 'react-icons/md';
import { FormattedNumber } from '@/components/dashboard/shared';
import useQuery from '@/hooks/useQuery';
import { PaginationFooter } from '@/components/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import Properties, { Term as T, Value as V } from '@/components/properties';
import { DoiTag } from '@/components/identifierTag';
import { HyperText } from '@/components/hyperText';
import { isNoneEmptyArray } from '@/utils/isNoneEmptyArray';

const DERIVED_DATASET_KEY = /* GraphQL */ `
  query DerivedDataset($key: ID!, $limit: Int, $offset: Int) {
    derivedDataset(key: $key) {
      doi
      originalDownloadDOI
      title
      description
      sourceUrl
      created
      modified
      createdBy
      modifiedBy
      citation
      contributingDatasets(limit: $limit, offset: $offset) {
        count
        limit
        offset
        endOfRecords
        results {
          datasetKey
          datasetDOI
          datasetTitle
          citation
          numberRecords
        }
      }
    }
  }
`;

export async function derivedDatasetLoader({ params, graphql }: LoaderArgs) {
  const doiPrefix = required(params.doiPrefix, 'No doiPrefix was provided in the URL');
  const doiSuffix = required(params.doiSuffix, 'No doiSuffix was provided in the URL');

  const response = await graphql.query<DerivedDatasetQuery, DerivedDatasetQueryVariables>(
    DERIVED_DATASET_KEY,
    { key: `${doiPrefix}/${doiSuffix}`, limit: 0, offset: 0 }
  );
  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['derivedDataset'],
    errors,
    requiredObjects: [data?.derivedDataset],
  });

  return { errors, derivedDataset: data.derivedDataset! };
}

type DerivedDatasetLoaderResult = Awaited<ReturnType<typeof derivedDatasetLoader>>;

export function DerivedDatasetPage() {
  const { formatMessage } = useIntl();
  const { derivedDataset } = useLoaderData() as DerivedDatasetLoaderResult;

  const limit = 10;
  const [offset, setOffset] = useState(0);

  const { data: clientSideData, load } = useQuery<
    DerivedDatasetQuery,
    DerivedDatasetQueryVariables
  >(DERIVED_DATASET_KEY, {
    lazyLoad: true,
    variables: { key: derivedDataset.doi, limit, offset },
  });

  useEffect(() => {
    load({
      variables: { key: derivedDataset.doi, limit, offset },
    });

    // We are tracking the params via a calculated ID
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, load]);

  const contributingDatasets = clientSideData?.derivedDataset?.contributingDatasets;

  return (
    <article className="g-bg-background">
      <PageMetaData
        title={derivedDataset.title}
        description={derivedDataset.description}
        path={`/derivedDataset/${derivedDataset.doi}`}
      />

      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={derivedDataset.doi} />}
        doi={derivedDataset.doi}
      />

      <PageContainer topPadded hasDataHeader className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-lg">
          <ArticlePreTitle
            secondary={
              <FormattedMessage
                id="dataset.registeredDate"
                values={{
                  DATE: derivedDataset.created ? (
                    <LongDate value={derivedDataset.created} />
                  ) : (
                    <FormattedMessage id="phrases.unknownDate" />
                  ),
                }}
              />
            }
          >
            <FormattedMessage id={`derivedDatasetKey.derivedDataset`} />
          </ArticlePreTitle>
          <ArticleTitle>
            <FormattedMessage
              id={`derivedDatasetKey.headlineDatasets`}
              values={{ total: derivedDataset.contributingDatasets.count }}
            />
          </ArticleTitle>
        </ArticleTextContainer>
      </PageContainer>

      <div className="g-bg-slate-100">
        <ArticleContainer>
          <ArticleTextContainer className="g-max-w-screen-lg">
            <Card className="g-mb-4 g-pt-8">
              <CardContent>
                <Properties breakpoint={800} className="[&>dt]:g-w-52">
                  <BasicField label="phrases.pleaseCiteAs">
                    <div>
                      <div>{derivedDataset.citation}</div>
                      <div style={{ marginTop: '1em' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="g-me-1"
                          onClick={() => {
                            navigator.clipboard.writeText(derivedDataset.citation || '');
                          }}
                        >
                          <FormattedMessage id="phrases.copy" />
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <a
                            href={`https://data.crosscite.org/application/x-research-info-systems/${derivedDataset.doi}`}
                            className="g-me-1 g-text-inherit"
                          >
                            RIS
                            <MdDownload className="g-ms-1" />
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <a
                            className="g-text-inherit"
                            href={`https://data.crosscite.org/application/x-bibtex/${derivedDataset.doi}`}
                          >
                            BibTex
                            <MdDownload className="g-ms-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </BasicField>
                </Properties>
              </CardContent>
              <CardContent className="g-border-t g-border-gray-200 !g-py-4 g-flex g-gap-4 g-flex-col md:g-flex-row">
                {derivedDataset.sourceUrl && (
                  <div className="g-w-52 g-flex-none">
                    <Button className="g-flex-none" variant="default" asChild>
                      <a href={derivedDataset.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <FormattedMessage
                          id="derivedDatasetKey.sourceUrl"
                          defaultMessage="Access derived dataset"
                        />
                      </a>
                    </Button>
                  </div>
                )}
                <div className="g-text-slate-600 g-flex-auto">
                  <HyperText
                    text={formatMessage({ id: 'downloadKey.readDatauseAndTerms' })}
                    className="[&_a]:g-underline"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="g-mb-4">
              <CardHeader>
                <div></div>
              </CardHeader>
              <CardContent>
                <Properties breakpoint={800} className="[&>dt]:g-w-52">
                  <>
                    <T>
                      <FormattedMessage id={'derivedDatasetKey.title'} defaultMessage={'Title'} />
                    </T>
                    <V>
                      <div className="g-break-all g-bg-slate-100 g-p-2 g-rounded g-font-[monospace]">
                        {derivedDataset.title}
                      </div>
                    </V>
                  </>
                  {derivedDataset.description && (
                    <>
                      <T>
                        <FormattedMessage
                          id={'derivedDatasetKey.description'}
                          defaultMessage={'Description'}
                        />
                      </T>
                      <V>
                        <div className="g-break-all g-bg-slate-100 g-p-2 g-rounded g-font-[monospace]">
                          {derivedDataset.description}
                        </div>
                      </V>
                    </>
                  )}
                  {derivedDataset.originalDownloadDOI && (
                    <>
                      <T className="g-font-bold">
                        <FormattedMessage
                          id={'derivedDatasetKey.originalDownloadDOI'}
                          defaultMessage={'Original Download DOI'}
                        />
                      </T>
                      <V style={{ position: 'relative' }}>
                        <div style={{ display: 'inline-block', paddingRight: 8 }}>
                          <DoiTag doi={derivedDataset.originalDownloadDOI} />
                        </div>
                      </V>
                    </>
                  )}
                </Properties>
              </CardContent>
            </Card>
            <Card className="g-mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage
                    id="downloadKey.nConstituentDatasets"
                    values={{ total: derivedDataset.contributingDatasets.count }}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="!g-px-0 g-overflow-auto">
                <table className="g-w-full g-text-sm g-text-left rtl:g-text-right g-text-gray-500 dark:g-text-gray-400">
                  <thead className="g-text-slate-500 g-font-light g-bg-gray-50 dark:g-bg-gray-700 dark:g-text-gray-400 g-border-b g-border-t">
                    <tr>
                      <th scope="col" className="g-px-4 md:g-px-8 g-py-3 g-font-normal">
                        <FormattedMessage id="downloadKey.title" defaultMessage="Title" />
                      </th>
                      <th
                        scope="col"
                        className="g-px-4 md:g-px-8 g-py-3 g-font-normal g-text-right rtl:g-text-left"
                      >
                        <FormattedMessage id="downloadKey.records" defaultMessage="Records" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isNoneEmptyArray(contributingDatasets?.results) &&
                      contributingDatasets.results.map((dataset) => (
                        <tr
                          key={dataset.datasetKey}
                          className="g-bg-white g-border-b last:g-border-0 dark:g-bg-gray-800 dark:g-border-gray-700"
                        >
                          <td
                            scope="row"
                            className="g-px-4 md:g-px-8 g-py-3 g-font-medium g-text-slate-900 dark:g-text-white g-min-w-80"
                          >
                            <DynamicLink
                              className="g-underline"
                              pageId="datasetKey"
                              variables={{ key: dataset.datasetKey }}
                            >
                              {dataset.datasetTitle}
                            </DynamicLink>
                          </td>
                          <td className="g-px-4 md:g-px-8 g-py-3 g-text-right rtl:g-text-left">
                            <FormattedNumber value={dataset.numberRecords} />
                          </td>
                        </tr>
                      ))}
                    {!contributingDatasets?.results &&
                      Array.from({ length: 10 }).map((_, i) => (
                        <tr
                          key={i}
                          className="g-bg-white g-border-b last:g-border-0 dark:g-bg-gray-800 dark:g-border-gray-700"
                        >
                          <td className="g-px-4 md:g-px-8 g-py-3">
                            <Skeleton className="g-w-24">&nbsp;</Skeleton>
                          </td>
                          <td className="g-px-4 md:g-px-8 g-py-3 g-text-right rtl:g-text-left">
                            <Skeleton className="g-w-12 g-ml-auto">&nbsp;</Skeleton>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {isNoneEmptyArray(contributingDatasets?.results) &&
                  (contributingDatasets.count || 0) > limit && (
                    <PaginationFooter
                      offset={contributingDatasets.offset || 0}
                      count={contributingDatasets.count || 0}
                      limit={contributingDatasets.limit || 0}
                      onChange={(x) => setOffset(x)}
                    />
                  )}
              </CardContent>
            </Card>
          </ArticleTextContainer>
        </ArticleContainer>
      </div>
    </article>
  );
}

export const DerivedDatasetSkeleton = ArticleSkeleton;
