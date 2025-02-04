import { ArticleBannerSkeleton } from './articleBanner';
import { ArticleBodySkeleton } from './articleBody';
import { ArticleContainer } from './articleContainer';
import { ArticleIntroSkeleton } from './articleIntro';
import { ArticlePreTitleSkeleton } from './articlePreTitle';
import { ArticleTextContainer } from './articleTextContainer';
import { ArticleTitleSkeleton } from './articleTitle';

export function ArticleSkeleton() {
  return (
    <ArticleContainer>
      <ArticleTextContainer>
        <ArticlePreTitleSkeleton className="g-mt-3" />
        <ArticleTitleSkeleton className="g-mt-3" />
        <ArticleIntroSkeleton className="g-mt-3" />
      </ArticleTextContainer>

      <ArticleBannerSkeleton className="g-mt-10" />

      <ArticleTextContainer className="g-mt-6">
        <ArticleBodySkeleton />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
