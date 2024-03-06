import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { ArticleTitle } from '../components/ArticleTitle';
import { PublishedDate } from '../components/PublishedDate';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { DataUseQuery, DataUseQueryVariables } from '@/gql/graphql';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';
import { ArticleTags } from '../components/ArticleTags';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { required } from '@/utils/required';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { ArticleFooterWrapper } from '../components/ArticleFooterWrapper';

const DATA_USE_QUERY = /* GraphQL */ `
  query DataUse($key: String!) {
    dataUse(id: $key) {
      id
      title
      summary
      resourceUsed
      body
      primaryImage {
        ...ArticleBanner
      }
      primaryLink {
        label
        url
      }
      secondaryLinks {
        label
        url
      }
      countriesOfCoverage
      topics
      purposes
      audiences
      citation
      createdAt
    }
  }
`;

export function dataUsePageLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');

  return graphql.query<DataUseQuery, DataUseQueryVariables>(DATA_USE_QUERY, { key });
}

export function DataUsePage() {
  const { data } = useLoaderData() as { data: DataUseQuery };

  if (data.dataUse == null) throw new Error('404');
  const resource = data.dataUse;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticlePreTitle>
            <FormattedMessage id="cms.contentType.dataUse" />
          </ArticlePreTitle>

          <ArticleTitle>{resource.title}</ArticleTitle>

          {resource.createdAt && <PublishedDate className="mt-2" date={resource.createdAt} />}

          {resource.summary && (
            <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
          )}

          <ArticleIntro className="mt-2">
            <FormattedMessage id="cms.datause.dataViaGbif" /> : {resource.resourceUsed}
          </ArticleIntro>
        </ArticleTextContainer>

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
          )}

          <ArticleFooterWrapper>
            {resource.citation && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.auxiliary.citation" />}
                dangerouslySetInnerHTML={{
                  __html: resource.citation,
                  classNames: 'underlineLinks',
                }}
              />
            )}

            <ArticleTags resource={resource} className="mt-8" />
          </ArticleFooterWrapper>
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

export function DataUsePageSkeleton() {
  return <ArticleSkeleton />;
}
