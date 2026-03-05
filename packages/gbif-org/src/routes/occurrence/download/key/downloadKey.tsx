import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LongDate } from '@/components/dateFormats';
import { Spinner } from '@/components/ui/spinner';
import { NotFoundError } from '@/errors';
import {
  Download_Status,
  DownloadKeyQuery,
  DownloadKeyQueryVariables,
  SlowDownloadKeyQuery,
  SlowDownloadKeyQueryVariables,
  UsersDownloadKeyQuery,
  UsersDownloadKeyQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { throwCriticalErrors, usePartialDataNotification } from '@/routes/rootErrorPage';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { json, useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';
import { DatasetCard } from './sections/datasetCard';
import { DeletionNotice } from './sections/deletionNotice';
import { FileCard } from './sections/fileCard';
import { NotReadyDownload } from './sections/notReadyDownload';
import { QueryCard } from './sections/queryCard';
import { SubHeader } from './sections/subHeader';
import { UserDescription } from './sections/userDescription';
import { downloadCompleted } from './utils';
import { useUser } from '@/contexts/UserContext';

const DOWNLOAD_SENSITIVE_QUERY = /* GraphQL */ `
  query UsersDownloadKey($key: ID!) {
    download(key: $key) {
      key
      willBeDeletedSoon
      readyForDeletion
      eraseAfter
      request {
        notificationAddresses
        creator
      }
    }
  }
`;

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
        sql: sqlFormatted
        format
        description
        gbifMachineDescription
        checklistKey
        verbatimExtensions
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
    literatureSearch(gbifDownloadKey: [$key], size: 0) {
      documents {
        total
      }
    }
  }
`;

export async function downloadKeyLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  const response = await graphql.query<DownloadKeyQuery, DownloadKeyQueryVariables>(
    DOWNLOAD_QUERY,
    {
      key,
    }
  );

  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['download'],
    errors,
    requiredObjects: [data?.download],
  });

  if (
    data.download?.status === Download_Status.Preparing ||
    data.download?.status === Download_Status.Running
  ) {
    // If the download is still being prepared or is running, we can return a loading state
    return json(
      { errors, data },
      {
        headers: {
          'GBIF-Cache-Control': 'FLASH', // option are listed in gbif/entry.server but vite builds fails if trying to export/import things into the server file or vica versa
        },
      }
    );
  }

  return { errors, data };
}

export function DownloadKey() {
  const { data: initialData } = useLoaderData() as { data: DownloadKeyQuery };
  const { formatMessage } = useIntl();
  const { user } = useUser();
  const notifyOfPartialData = usePartialDataNotification();

  const { data: sensitiveData, load } = useQuery<
    UsersDownloadKeyQuery,
    UsersDownloadKeyQueryVariables
  >(DOWNLOAD_SENSITIVE_QUERY, {
    throwAllErrors: false,
    lazyLoad: true,
  });

  const {
    data: slowData,
    error: slowError,
    load: slowLoad,
  } = useQuery<SlowDownloadKeyQuery, SlowDownloadKeyQueryVariables>(SLOW_DOWNLOAD_QUERY, {
    lazyLoad: true,
    throwAllErrors: false,
  });

  useEffect(() => {
    if (slowError) {
      notifyOfPartialData();
    }
  }, [slowData, slowError, notifyOfPartialData]);

  const { data: refreshedData, load: refresh } = useQuery<
    DownloadKeyQuery,
    DownloadKeyQueryVariables
  >(DOWNLOAD_QUERY, {
    throwAllErrors: false,
    lazyLoad: true,
  });

  useEffect(() => {
    if (!initialData?.download?.key) return;
    slowLoad({
      variables: {
        key: '' + initialData?.download?.key,
      },
    });
  }, [slowLoad, initialData?.download?.key]);

  useEffect(() => {
    if (!user?.graphqlToken || !initialData?.download?.key) {
      return;
    }
    load(
      {
        variables: {
          key: initialData.download.key,
        },
      },
      { authorization: `Bearer ${user?.graphqlToken}` }
    );
  }, [initialData?.download?.key, load, user?.graphqlToken]);

  const data = refreshedData ?? initialData;
  useEffect(() => {
    // if the download is still running or preparing, we refresh the data every 30 seconds
    const isPreparingOrRunning =
      data?.download?.status === Download_Status.Preparing ||
      data?.download?.status === Download_Status.Running;
    if (isPreparingOrRunning) {
      const interval = setInterval(() => {
        refresh({
          variables: {
            key: '' + data.download?.key,
          },
        });
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [refresh, data?.download?.status, data?.download?.key]);

  const download = data?.download;
  if (!download) throw new NotFoundError();

  const literatureCount = slowData?.literatureSearch?.documents?.total;

  const showCitation = downloadCompleted(download);

  return (
    <>
      <Helmet>
        <title>
          {formatMessage({ id: 'downloadKey.download' })} {download?.created}
        </title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={download?.key?.toString()} />}
        doi={showCitation ? download?.doi : undefined}
      ></DataHeader>
      <ErrorBoundary invalidateOn={download?.key}>
        <article>
          <PageContainer topPadded hasDataHeader className="g-border-b">
            <ArticleTextContainer className="g-max-w-screen-xl g-pb-4 md:g-pb-8">
              <ArticlePreTitle
                secondary={
                  download.created ? (
                    <LongDate value={download.created} />
                  ) : (
                    <FormattedMessage id="phrases.unknownDate" />
                  )
                }
              >
                <FormattedMessage id="downloadKey.download" defaultMessage="Download" />
              </ArticlePreTitle>
              <ArticleTitle className="lg:g-text-3xl">
                <DownloadTitle download={download} />
              </ArticleTitle>

              <SubHeader download={download} literatureCount={literatureCount} />
            </ArticleTextContainer>
          </PageContainer>
          <PageContainer className="g-bg-slate-100 g-overflow-hidden">
            <ArticleTextContainer className="g-max-w-screen-xl g-pb-4 g-pt-4">
              <DeletionNotice download={download} userDownload={sensitiveData?.download} />
              {showCitation && <FileCard download={download} />}
              {!showCitation && (
                <NotReadyDownload
                  status={download.status ?? Download_Status.Failed}
                  notificationAddresses={sensitiveData?.download?.request?.notificationAddresses}
                  downloadKey={download.key}
                />
              )}
              <UserDescription download={download} />
              <QueryCard download={download} />
              {(download.numberDatasets ?? 0) > 0 && (
                <DatasetCard download={download} datasetsByDownload={data.datasetsByDownload} />
              )}
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

export function DownloadTitle({ download }: { download: DownloadKeyQuery['download'] }) {
  if (!download) return null;

  const errorClassName = 'g-text-orange-700';
  // logic to create the title based on download state and format
  if (download.status === 'KILLED' || download.status === 'FAILED') {
    return (
      <span className={errorClassName}>
        <FormattedMessage id="downloadKey.brokenDownload" />
      </span>
    );
  } else if (download.status === 'CANCELLED') {
    return (
      <span className={errorClassName}>
        <FormattedMessage id="downloadKey.cancelled" />
      </span>
    );
  } else if (download.status === 'PREPARING' || download.status === 'RUNNING') {
    return (
      <span className="g-flex g-items-center g-gap-4">
        <FormattedMessage id="downloadKey.underProcessing" />
        <Spinner className="g-h-6 g-w-6" />
      </span>
    );
  } else {
    if (download?.request?.format === 'SPECIES_LIST') {
      return (
        <FormattedMessage
          id="downloadKey.nRecordsDownloaded"
          values={{ total: download.totalRecords }}
        />
      );
    } else if (download?.request?.format === 'SQL_TSV_ZIP') {
      return (
        <FormattedMessage
          id="downloadKey.nRowsDownloaded"
          values={{ total: download.totalRecords }}
        />
      );
    } else if (download?.request?.format === 'DWCA' || download?.request?.format === 'SIMPLE_CSV') {
      return (
        <FormattedMessage
          id="downloadKey.nOccurrencesDownloaded"
          values={{ total: download.totalRecords }}
        />
      );
    } else if (download.totalRecords === 0) {
      return <FormattedMessage id="downloadKey.occurrenceDownload" />;
    } else {
      return (
        <FormattedMessage
          id="downloadKey.nRecordsDownloaded"
          values={{ total: download.totalRecords }}
        />
      );
    }
  }
}
