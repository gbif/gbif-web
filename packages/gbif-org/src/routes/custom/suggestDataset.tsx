import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { Helmet } from 'react-helmet-async';
import { ArticleIntro } from '../resource/key/components/articleIntro';
import { ArticleSkeleton } from '../resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../resource/key/components/articleTitle';
import { PageContainer } from '../resource/key/components/pageContainer';
import { SuggestDatasetForm } from '../resource/key/composition/blocks/customComponents/suggestDatasetForm';

function SuggestDatasetPage() {
  return (
    <PageContainer className="g-bg-white" topPadded bottomPadded>
      <Helmet>
        <title>Suggest dataset</title>
      </Helmet>

      <ArticleTextContainer>
        <ArticleTitle>Suggest a dataset</ArticleTitle>

        <ArticleIntro>Please descripe your dataset in the form below.</ArticleIntro>

        <hr className="g-my-4" />

        <SuggestDatasetForm />
      </ArticleTextContainer>
    </PageContainer>
  );
}

export const suggestDatasetRoute: RouteObjectWithPlugins = {
  id: 'suggest-dataset',
  element: <SuggestDatasetPage />,
  loadingElement: <ArticleSkeleton />,
  path: 'suggest-dataset',
};
