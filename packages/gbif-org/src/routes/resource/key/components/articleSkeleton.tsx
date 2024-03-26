import { ArticleBannerSkeleton } from "./articleBanner";
import { ArticleBodySkeleton } from "./articleBody";
import { ArticleContainer } from "./articleContainer";
import { ArticleIntroSkeleton } from "./articleIntro";
import { ArticlePreTitleSkeleton } from "./articlePreTitle";
import { ArticleTextContainer } from "./articleTextContainer";
import { ArticleTitleSkeleton } from "./articleTitle";

export function ArticleSkeleton() {
  return (
    <ArticleContainer>
      <ArticleTextContainer>
        <ArticlePreTitleSkeleton className="mt-3" />
        <ArticleTitleSkeleton className="mt-3" />
        <ArticleIntroSkeleton className="mt-3" />
      </ArticleTextContainer>

      <ArticleBannerSkeleton className="mt-10" />

      <ArticleTextContainer className="mt-6">
        <ArticleBodySkeleton />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}