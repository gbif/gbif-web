import { DataHeader } from '@/components/dataHeader';
import {
  defaultDateFormatProps,
  HeaderInfo,
  HeaderInfoEdit,
  HeaderInfoMain,
} from '@/components/headerComponents';

import PageMetaData from '@/components/PageMetaData';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/smallCard';
import { NotFoundError } from '@/errors';
import { DerivedDatasetQuery, DerivedDatasetQueryVariables } from '@/gql/graphql';
import { DynamicLink, LoaderArgs } from '@/reactRouterPlugins';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { required } from '@/utils/required';
import { useEffect, useState } from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import { Link, useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';
import { Button } from '@/components/ui/button';
import { MdDownload, MdLink } from 'react-icons/md';
import { CopyToClipboard } from '@/components/filters/geometryFilter/RecentInput';
import { FormattedNumber } from '@/components/dashboard/shared';
import useQuery from '@/hooks/useQuery';
import { PaginationFooter } from '@/components/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import Properties, { Term as T, Value as V } from '@/components/properties';
import { DoiTag } from '@/components/identifierTag';
import { HyperText } from '@/components/hyperText';

// import { AboutContent, ApiContent } from './help';

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

  return { errors, data };
}

export function DerivedDatasetPage() {
  const { formatMessage } = useIntl();
  const { data, errors } = useLoaderData() as { data: DerivedDatasetQuery };
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const doiPrefix = required(
    data?.derivedDataset?.doi?.split('/')[0],
    'No doiPrefix was provided in the URL'
  );
  const doiSuffix = required(
    data?.derivedDataset?.doi?.split('/')[1],
    'No doiSuffix was provided in the URL'
  );
  const {
    data: clientSideData,
    load,
    error,
    loading,
  } = useQuery(DERIVED_DATASET_KEY, {
    lazyLoad: true,
    variables: { key: `${doiPrefix}/${doiSuffix}`, limit, offset },
  });

  useEffect(() => {
    load({
      variables: { key: `${doiPrefix}/${doiSuffix}`, limit, offset },
    });

    // We are tracking the params via a calculated ID
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, load]);

  if (data.derivedDataset == null) throw new NotFoundError();
  const { derivedDataset } = data;
  const contributingDatasets = clientSideData?.derivedDataset?.contributingDatasets;

  return (
    <article className="g-bg-background">
      <PageMetaData
        title={derivedDataset.title}
        description={derivedDataset?.description}
        noindex={!!derivedDataset?.deleted}
        nofollow={!!derivedDataset?.deleted}
        path={`/derivedDataset/${derivedDataset.doi}`}
      />

      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={derivedDataset?.doi?.toString()} />}
        doi={derivedDataset.doi ?? undefined}
      ></DataHeader>

      <PageContainer topPadded hasDataHeader className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-lg">
          <ArticlePreTitle
            secondary={
              <FormattedMessage
                id="dataset.registeredDate"
                values={{
                  DATE: (
                    <FormattedDate
                      value={derivedDataset.created ?? undefined}
                      {...defaultDateFormatProps}
                    />
                  ),
                }}
              />
            }
          >
            <FormattedMessage id={`derivedDatasetKey.derivedDataset`} />
          </ArticlePreTitle>
          <ArticleTitle>
            {' '}
            <FormattedMessage
              id={`derivedDatasetKey.headlineDatasets`}
              values={{ total: derivedDataset.contributingDatasets.count }}
            />
          </ArticleTitle>

          {/*           {deletedAt && <DeletedMessage date={deletedAt} />}
           */}
          <HeaderInfo>
            <HeaderInfoMain>
              <div></div>
            </HeaderInfoMain>
            <HeaderInfoEdit className="g-flex g-mt-4 g-gap-2">
              <Button asChild className="g-py-1 g-px-2 g-h-[2rem] g-mb-4">
                <Link to={derivedDataset.sourceUrl ?? ''} target="_blank" rel="noopener noreferrer">
                  <MdLink />
                  <FormattedMessage id="derivedDatasetKey.sourceUrl" />
                </Link>
              </Button>
            </HeaderInfoEdit>
          </HeaderInfo>
        </ArticleTextContainer>
      </PageContainer>

      <div className="g-bg-slate-100">
        <ArticleContainer>
          <ArticleTextContainer className="g-max-w-screen-lg">
            <Card className="g-mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="phrases.pleaseCiteAs" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {derivedDataset.citation} <CopyToClipboard text={derivedDataset?.citation || ''} />
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="g-py-1 g-px-2 g-h-[2rem] g-mr-1">
                  <Link
                    to={`https://data.crosscite.org/application/x-bibtex/${derivedDataset.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MdDownload />
                    BibTex
                  </Link>
                </Button>
                <Button asChild variant="outline" className="g-py-1 g-px-2 g-h-[2rem]">
                  <Link
                    to={`https://data.crosscite.org/application/x-research-info-systems/${derivedDataset.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MdDownload />
                    RIS
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="g-mb-4">
              <CardHeader>
                <div></div>
              </CardHeader>
              <CardContent>
                <Properties breakpoint={800} className="[&>dt]:g-w-52">
                  <>
                    <T className="g-font-bold">
                      <FormattedMessage id={'derivedDatasetKey.title'} defaultMessage={'Title'} />
                    </T>
                    <V style={{ position: 'relative' }}>
                      <div style={{ display: 'inline-block', paddingRight: 8 }}>
                        {derivedDataset.title}
                      </div>
                    </V>
                  </>
                  {derivedDataset.description && (
                    <>
                      <T className="g-font-bold">
                        <FormattedMessage
                          id={'derivedDatasetKey.description'}
                          defaultMessage={'Description'}
                        />
                      </T>
                      <V style={{ position: 'relative' }}>
                        <div style={{ display: 'inline-block', paddingRight: 8 }}>
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
                  <>
                    <T className="g-font-bold"></T>
                    <V style={{ position: 'relative' }}>
                      <HyperText
                        text={formatMessage({ id: 'downloadKey.readDatauseAndTerms' })}
                        className="[&_a]:g-underline"
                      />
                    </V>
                  </>
                </Properties>
              </CardContent>
              <CardFooter></CardFooter>
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
              <CardContent>
                <>
                  {' '}
                  <table className="g-w-full g-text-sm g-mb-8 g-bg-white">
                    <thead className="g-shadow-sm">
                      <tr className="g-transition-colors data-[state=selected]:g-bg-muted">
                        <th
                          className="g-p-4 g-text-left g-whitespace-nowrap "
                          style={{ width: '80%' }}
                        ></th>

                        <th
                          className="g-p-4 g-text-left g-whitespace-nowrap "
                          style={{ width: '20%' }}
                        >
                          <FormattedMessage id="downloadKey.records" defaultMessage="Records" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributingDatasets?.results?.length > 0 &&
                        contributingDatasets.results.map((dataset) => (
                          <tr
                            key={dataset.datasetKey}
                            className="g-transition-colors data-[state=selected]:g-bg-muted"
                          >
                            <td className="g-p-4 ">
                              <DynamicLink
                                className="hover:g-text-primary-500"
                                pageId="datasetKey"
                                variables={{ key: dataset.datasetKey }}
                              >
                                {dataset.datasetTitle}
                              </DynamicLink>
                            </td>

                            <td className="g-p-4 ">
                              {' '}
                              <FormattedNumber value={dataset.numberRecords || 0} />
                            </td>
                          </tr>
                        ))}
                      {!contributingDatasets?.results &&
                        Array.from({ length: 10 }).map((x, i) => (
                          <tr key={i}>
                            <td>
                              <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                            </td>

                            <td>
                              <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {contributingDatasets?.results?.length > 0 && (
                    <PaginationFooter
                      offset={contributingDatasets?.offset || 0}
                      count={contributingDatasets?.count || 0}
                      limit={contributingDatasets?.limit || 0}
                      onChange={(x) => setOffset(x)}
                    />
                  )}
                </>
              </CardContent>
            </Card>
          </ArticleTextContainer>
        </ArticleContainer>
      </div>
    </article>
  );
}

export const DerivedDatasetSkeleton = ArticleSkeleton;
