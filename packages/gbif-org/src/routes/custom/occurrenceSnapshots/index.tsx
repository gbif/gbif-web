import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { ArticleSkeleton } from '../../resource/key/components/articleSkeleton';
import { OccurrenceSnapshotsQuery, OccurrenceSnapshotsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArticleIntro } from '../../resource/key/components/articleIntro';
import { ArticleTextContainer } from '../../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../../resource/key/components/articleTitle';
import { PageContainer } from '../../resource/key/components/pageContainer';
import OccurrenceSnapshotsTable from './table';
import PageMetaData from '@/components/PageMetaData';

const OCCURRENCE_SNAPSHOTS_QUERY = /* GraphQL */ `
  query OccurrenceSnapshots($limit: Int!, $offset: Int!) {
    occurrenceSnapshots(limit: $limit, offset: $offset) {
      limit
      offset
      count
      endOfRecords
      results {
        ...DownloadResult
      }
    }
  }
`;

const OccurrenceSnapshots = () => {
  const { formatMessage } = useIntl();
  const [limit, setLimit] = useState(500);
  const [offset, setOffset] = useState(0);
  const { data, load, loading, error } = useQuery<
    OccurrenceSnapshotsQuery,
    OccurrenceSnapshotsQueryVariables
  >(OCCURRENCE_SNAPSHOTS_QUERY, {
    lazyLoad: true,
    throwAllErrors: false,
  });

  useEffect(() => {
    load({
      variables: {
        limit,
        offset,
      },
    });
  }, [load, limit, offset]);

  const link = (href: string) => (chunks: React.ReactNode) => <a href={href}>{chunks}</a>;

  return (
    <article>
      <PageMetaData
        title={formatMessage({ id: 'occurrenceSnapshots.title' })}
        path="/occurrence-snapshots"
        nofollow
        noindex
      />

      <PageContainer topPadded className="g-bg-white g-pb-10">
        <ArticleTextContainer className="g-mb-10">
          <ArticleTitle>
            <FormattedMessage id="occurrenceSnapshots.title" />
          </ArticleTitle>
          <ArticleIntro className="g-mt-2">
            <FormattedMessage id="occurrenceSnapshots.intro" />
          </ArticleIntro>
        </ArticleTextContainer>
        <ArticleTextContainer>
          <div className="g-prose g-max-w-none dark:g-prose-invert">
            <p>
              <FormattedMessage id="occurrenceSnapshots.description" />
            </p>
            <h2>
              <FormattedMessage id="occurrenceSnapshots.cloudDatasets.title" />
            </h2>
            <p>
              <FormattedMessage
                id="occurrenceSnapshots.cloudDatasets.description"
                values={{
                  azure: link('https://planetarycomputer.microsoft.com/dataset/gbif'),
                  aws: link('https://registry.opendata.aws/gbif/'),
                  gcs: link('https://console.cloud.google.com/storage/browser/public-datasets-gbif'),
                  bq: link(
                    'https://console.cloud.google.com/marketplace/product/bigquery-public-data/gbif-occurrences'
                  ),
                  derived: link('https://www.gbif.org/citation-guidelines#derivedDatasets'),
                }}
              />
            </p>
          </div>
          <div className="g-my-8">
            <OccurrenceSnapshotsTable
              results={
                data?.occurrenceSnapshots?.results
                  ? data?.occurrenceSnapshots?.results.filter(
                      (r) => r?.request?.format === 'SIMPLE_PARQUET'
                    )
                  : null
              }
            />
          </div>
          <div className="g-prose g-max-w-none dark:g-prose-invert">
            <h2>
              <FormattedMessage id="occurrenceSnapshots.monthly.title" />
            </h2>
            <p>
              <FormattedMessage id="occurrenceSnapshots.monthly.description" />
            </p>
          </div>
          <div className="g-my-8">
            <OccurrenceSnapshotsTable results={data?.occurrenceSnapshots?.results} />
          </div>
        </ArticleTextContainer>
      </PageContainer>
    </article>
  );
};

export const occurrenceSnapshotsRoute: RouteObjectWithPlugins = {
  id: 'occurrence-snapshots',
  element: <OccurrenceSnapshots />,
  loadingElement: <ArticleSkeleton />,
  path: 'occurrence-snapshots',
};
