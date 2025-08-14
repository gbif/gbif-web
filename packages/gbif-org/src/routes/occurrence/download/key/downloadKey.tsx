import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { defaultDateFormatProps } from '@/components/headerComponents';
import { Spinner } from '@/components/ui/spinner';
import { NotFoundError } from '@/errors';
import {
  Download_Status,
  DownloadKeyQuery,
  OccurrenceQuery,
  OccurrenceQueryVariables,
  SlowDownloadKeyQuery,
  SlowDownloadKeyQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';
import { DatasetCard } from './sections/datasetCard';
import { DeletionNotice } from './sections/deletionNotice';
import { FileCard } from './sections/fileCard';
import { NotReadyDownload } from './sections/notReadyDownload';
import { QueryCard } from './sections/queryCard';
import { SubHeader } from './sections/subHeader';
import { UserDescription } from './sections/userDescription';
import { downloadCompleted } from './utils';

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

  return graphql.query<OccurrenceQuery, OccurrenceQueryVariables>(DOWNLOAD_QUERY, {
    key,
  });
}

export function DownloadKey() {
  const { data } = useLoaderData() as { data: DownloadKeyQuery };
  const { formatMessage } = useIntl();

  const {
    data: slowData,
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
  }, [slowLoad, data?.download?.key]);

  const download = data?.download;
  if (!download) throw new NotFoundError();

  const literatureCount = slowData?.literatureSearch?.documents?.total;
  if (slowError) {
    // TODO, notify users that we couldn't load all data. specifically liteature in this case
  }

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
                    <FormattedDate value={download?.created} {...defaultDateFormatProps} />
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
              <DeletionNotice download={download} />
              {showCitation && <FileCard download={download} />}
              {!showCitation && (
                <NotReadyDownload status={download.status ?? Download_Status.Failed} />
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
