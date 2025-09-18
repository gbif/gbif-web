import { LoaderArgs, RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { ArticleSkeleton } from '../../resource/key/components/articleSkeleton';
import { OccurrenceSnapshotsQuery, OccurrenceSnapshotsQueryVariables } from '@/gql/graphql';
import { useLoaderData } from 'react-router-dom';
import useQuery from '@/hooks/useQuery';
import { useEffect, useState } from 'react';
import { CardHeader } from '@/components/ui/largeCard';
import { SearchInput } from '@/components/searchInput';
import { cn } from '@/utils/shadcn';
import { Helmet } from 'react-helmet-async';
import { ArticleBody } from '../../resource/key/components/articleBody';
import { ArticleIntro } from '../../resource/key/components/articleIntro';
import { ArticleOpenGraph } from '../../resource/key/components/articleOpenGraph';
import { ArticleTextContainer } from '../../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../../resource/key/components/articleTitle';
import { PageContainer } from '../../resource/key/components/pageContainer';
import { ArticlePreTitle } from '../../resource/key/components/articlePreTitle';
import OccurrenceSnapshotsTable from './table';
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
/* function occurrenceSnapshotsLoader(args: LoaderArgs) {
  return args.graphql.query<OccurrenceSnapshotsQuery, undefined>(
    OCCURRENCE_SNAPSHOTS_QUERY,
    undefined
  );
} */

const OccurrenceSnapshots = () => {
  //  const { data } = useLoaderData() as { data: OccurrenceSnapshotsQuery };
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

  return (
    <article>
      <Helmet>
        <title>Occurrence snapshots</title>
      </Helmet>

      <PageContainer topPadded className="g-bg-white g-pb-10">
        <ArticleTextContainer className="g-mb-2">
          <ArticleTitle>Occurrence Snapshots</ArticleTitle>
        </ArticleTextContainer>
        <ArticleTextContainer className="g-mb-10">
          Periodic exports of GBIF occurrence data
        </ArticleTextContainer>
        <ArticleTextContainer className="g-mb-10">
          {' '}
          Every month GBIF takes a full occurrence snapshot, saved in different formats to ease
          usage. All snapshots are issued with a DOI to simplify citation, and some formats are
          copied to public clouds for easy use on those environments.
        </ArticleTextContainer>
        <ArticleTextContainer className="g-mb-2">
          <ArticleTitle>Cloud-based datasets</ArticleTitle>
        </ArticleTextContainer>
        <ArticleTextContainer className="g-mb-8">
          GBIF makes data available on the{' '}
          <a href="https://planetarycomputer.microsoft.com/dataset/gbif">
            Microsoft Planetary Computer (Azure)
          </a>
          , as an <a href="https://registry.opendata.aws/gbif/">Amazon AWS Open Dataset</a> and on a
          public Google{' '}
          <a href="https://console.cloud.google.com/storage/browser/public-datasets-gbif">
            GCS bucket
          </a>{' '}
          and{' '}
          <a href="https://console.cloud.google.com/marketplace/product/bigquery-public-data/gbif-occurrences">
            BigQuery table
          </a>
          . When using cloud-based snapshots, we always recommend creating a{' '}
          <a href="https://www.gbif.org/citation-guidelines#derivedDatasets">
            Derived Dataset citation
          </a>{' '}
          for the records that you use. When referring to the full dataset, please use the
          appropriate citation found below.
        </ArticleTextContainer>
        <ArticleTextContainer className="g-mb-10">
          <OccurrenceSnapshotsTable
            results={
              data?.occurrenceSnapshots?.results
                ? data?.occurrenceSnapshots?.results.filter(
                    (r) => r?.request?.format === 'SIMPLE_PARQUET'
                  )
                : null
            }
          />
        </ArticleTextContainer>
        <ArticleTextContainer className="g-mb-2">
          <ArticleTitle>Monthly snapshot datasets</ArticleTitle>
        </ArticleTextContainer>
        <ArticleTextContainer className="g-mb-8">
          The monthly exports of GBIF are listed below, available in various formats. Please see the
          citation on each page.
        </ArticleTextContainer>
        <ArticleTextContainer className="g-mb-2">
          <OccurrenceSnapshotsTable results={data?.occurrenceSnapshots?.results} />
        </ArticleTextContainer>
      </PageContainer>
    </article>
  );
};

export const occurrenceSnapshotsRoute: RouteObjectWithPlugins = {
  id: 'occurrence-snapshots',
  element: <OccurrenceSnapshots />,
  /*   loader: occurrenceSnapshotsLoader,
   */ loadingElement: <ArticleSkeleton />,
  path: 'occurrence-snapshots',
};
