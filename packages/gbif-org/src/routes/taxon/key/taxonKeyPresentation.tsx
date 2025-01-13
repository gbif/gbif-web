import { TaxonQuery, TaxonSummaryMetricsQuery } from '@/gql/graphql';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { createContext } from 'react';
import { Helmet } from 'react-helmet-async';

// create context to pass data to children
export const TaxonKeyContext = createContext<{ key?: string; contentMetrics?: unknown }>({});

export function TaxonKey({
  data,
  taxonMetrics,
}: {
  data: TaxonQuery;
  taxonMetrics?: TaxonSummaryMetricsQuery;
}) {
  if (data.taxon == null) throw new Error('404');
  const { taxon } = data;
  return (
    <article>
      <Helmet>
        <title>{taxon.scientificName}</title>
        {/* TODO we need much richer meta data. */}
      </Helmet>

      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <h1>{taxon.scientificName}</h1>
        </ArticleTextContainer>
      </PageContainer>
    </article>
  );
}

export const TaxonPageSkeleton = ArticleSkeleton;
