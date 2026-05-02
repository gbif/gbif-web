import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LongDate } from '@/components/dateFormats';
import { Spinner } from '@/components/ui/spinner';
import {
  Download_Status,
  DownloadKeyQuery,
  DownloadKeyQueryVariables,
  EventDownloadKeyQuery,
  EventDownloadKeyQueryVariables,
  SlowDownloadKeyQuery,
  SlowDownloadKeyQueryVariables,
  UsersDownloadKeyQuery,
  UsersDownloadKeyQueryVariables,
  UsersEventDownloadKeyQuery,
  UsersEventDownloadKeyQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { required } from '@/utils/required';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { json, useLoaderData } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { downloadCompleted } from '@/routes/occurrence/download/key/utils';
import { SubHeader } from '@/routes/occurrence/download/key/sections/subHeader';
import { FileCard } from '@/routes/occurrence/download/key/sections/fileCard';
import { DeletionNotice } from '@/routes/occurrence/download/key/sections/deletionNotice';
import { NotReadyDownload } from '@/routes/occurrence/download/key/sections/notReadyDownload';
import { QueryCard } from '@/routes/occurrence/download/key/sections/queryCard';
import { UserDescription } from '@/routes/occurrence/download/key/sections/userDescription';
import { DatasetCard } from '@/routes/occurrence/download/key/sections/datasetCard';

const DOWNLOAD_SENSITIVE_QUERY = /* GraphQL */ `
  query UsersEventDownloadKey($key: ID!) {
    eventDownload(key: $key) {
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
  query EventDownloadKey($key: ID!) {
    download: eventDownload(key: $key) {
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
        type
        description
        gbifMachineDescription
        checklistKey
        verbatimExtensions
      }
      size
      status
      totalRecords
    }
    datasetsByDownload: datasetsByEventDownload(key: $key, limit: 50, offset: 0) {
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

  const response = await graphql.query<EventDownloadKeyQuery, EventDownloadKeyQueryVariables>(
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

  const result = { errors, data: { ...data, download: data.download! } };

  if (
    data.download?.status === Download_Status.Preparing ||
    data.download?.status === Download_Status.Running
  ) {
    // If the download is still being prepared or is running, we can return a loading state
    return json(result, {
      headers: {
        'GBIF-Cache-Control': 'FLASH', // option are listed in gbif/entry.server but vite builds fails if trying to export/import things into the server file or vica versa
      },
    });
  }

  return result;
}

type DownloadKeyLoaderResult = Exclude<Awaited<ReturnType<typeof downloadKeyLoader>>, Response>;
export type Download = DownloadKeyLoaderResult['data']['download'];

export function DownloadKey() {
  const { datasetsByDownload, download } = useDownloadDataWithAutoRefresh();
  const sensitiveData = useSensitiveData(download.key);
  const { formatMessage } = useIntl();

  const { data: slowData } = useQuery<SlowDownloadKeyQuery, SlowDownloadKeyQueryVariables>(
    SLOW_DOWNLOAD_QUERY,
    {
      lazyLoad: false,
      throwAllErrors: false,
      notifyOnErrors: true,
      variables: { key: download.key },
    }
  );

  const literatureCount = slowData?.literatureSearch?.documents?.total;
  const showCitation = downloadCompleted(download);

  return (
    <>
      <Helmet>
        <title>
          {formatMessage({ id: 'downloadKey.download' })} {download.created}
        </title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <DataHeader
        className="g-bg-white"
        // apiContent={<ApiContent id={download.key} />}
        doi={showCitation ? download?.doi : undefined}
      />
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
                <DatasetCard
                  download={download}
                  datasetsByDownload={datasetsByDownload}
                  downloadType="event"
                />
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

export function DownloadTitle({ download }: { download: Download }) {
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

function useDownloadDataWithAutoRefresh() {
  const { data: initialData } = useLoaderData() as DownloadKeyLoaderResult;
  const [data, setData] = useState<DownloadKeyLoaderResult['data']>(initialData);

  const {
    data: refreshedData,
    error,
    load: refresh,
  } = useQuery<DownloadKeyQuery, DownloadKeyQueryVariables>(DOWNLOAD_QUERY, {
    throwAllErrors: false,
    lazyLoad: true,
  });

  useEffect(() => {
    if (refreshedData?.download != null) {
      setData({
        ...refreshedData,
        download: refreshedData.download!,
      });
    }
  }, [refreshedData]);

  const { formatMessage } = useIntl();
  const { toast } = useToast();
  useEffect(() => {
    if (error) {
      toast({
        title: formatMessage({ id: 'download.failedToRefreshDownloadStatus' }),
        variant: 'warning',
      });
    }
  }, [error, formatMessage, toast]);

  useEffect(() => {
    // if the download is still running or preparing, we refresh the data every 30 seconds
    const isPreparingOrRunning =
      data.download.status === Download_Status.Preparing ||
      data.download.status === Download_Status.Running;
    if (isPreparingOrRunning) {
      const interval = setInterval(() => {
        refresh({
          variables: {
            key: data.download.key,
          },
        });
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [refresh, data.download.status, data.download.key]);

  return data;
}

function useSensitiveData(downloadKey: string) {
  const { user } = useUser();

  const { data: sensitiveData, load } = useQuery<
    UsersEventDownloadKeyQuery,
    UsersEventDownloadKeyQueryVariables
  >(DOWNLOAD_SENSITIVE_QUERY, {
    throwAllErrors: false,
    lazyLoad: true,
  });

  useEffect(() => {
    if (!user?.graphqlToken) return;
    load(
      {
        variables: {
          key: downloadKey,
        },
      },
      { authorization: `Bearer ${user.graphqlToken}` }
    );
  }, [downloadKey, load, user?.graphqlToken]);

  return sensitiveData;
}
