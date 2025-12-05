import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { ArticleBody } from '@/routes/resource/key/components/articleBody';
import { ArticleIntro } from '@/routes/resource/key/components/articleIntro';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContactUsLoaderData } from '.';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';

export function ContactUsTab() {
  const { data } = useContactUsLoaderData();
  const resource = data.resource;

  // This should not happen as long as the contact-us page is of type Article in Contentful
  if (resource?.__typename !== 'Article') {
    throw new Error('Invalid resource type');
  }

  return (
    <PageContainer bottomPadded className="g-bg-white">
      <ArticleTextContainer className="g-mb-10">
        {resource.summary && (
          <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="g-mt-2" />
        )}
      </ArticleTextContainer>

      <ArticleBanner className="g-mt-8 g-mb-6" image={resource?.primaryImage} />

      <ArticleTextContainer>
        {resource.body && (
          <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="g-mt-2" />
        )}
      </ArticleTextContainer>
    </PageContainer>
  );
}
