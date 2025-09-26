import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArticleIntro } from '../resource/key/components/articleIntro';
import { ArticleSkeleton } from '../resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../resource/key/components/articleTitle';
import { PageContainer } from '../resource/key/components/pageContainer';
import { SuggestDatasetForm } from '../resource/key/composition/blocks/customComponents/suggestDatasetForm';
import { ProtectedForm } from '@/components/protectedForm';

function SuggestDatasetPage() {
  const { formatMessage } = useIntl();

  return (
    <PageContainer className="g-bg-white" topPadded bottomPadded>
      <Helmet>
        <title>{formatMessage({ id: 'suggestDataset.pageTitle' })}</title>
      </Helmet>

      <ArticleTextContainer>
        <ArticleTitle>
          <FormattedMessage id="suggestDataset.pageTitle" />
        </ArticleTitle>

        <ArticleIntro>
          <FormattedMessage id="suggestDataset.pageDescription" />
        </ArticleIntro>

        <hr className="g-my-4" />

        <ProtectedForm
          className="g-mt-8"
          title={<FormattedMessage id="suggestDataset.loginToSuggestDataset.title" />}
          message={<FormattedMessage id="suggestDataset.loginToSuggestDataset.message" />}
        >
          <SuggestDatasetForm />
        </ProtectedForm>
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
