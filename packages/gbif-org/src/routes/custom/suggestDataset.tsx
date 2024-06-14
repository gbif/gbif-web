import { Helmet } from 'react-helmet-async';
import { PageContainer } from '../resource/key/components/pageContainer';
import { ArticleTextContainer } from '../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../resource/key/components/articleTitle';
import { SuggestDatasetForm } from '../resource/key/composition/blocks/customComponents/suggestDatasetForm';
import { ArticleIntro } from '../resource/key/components/articleIntro';

export function SuggestDatasetPage() {
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
