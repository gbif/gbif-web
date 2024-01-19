import { ArticleBannerSkeleton } from "./ArticleBanner";
import { ArticleBodySkeleton } from "./ArticleBody";
import { ArticleContainer } from "./ArticleContainer";
import { ArticleIntroSkeleton } from "./ArticleIntro";
import { ArticlePreTitleSkeleton } from "./ArticlePreTitle";
import { ArticleTextContainer } from "./ArticleTextContainer";
import { ArticleTitleSkeleton } from "./ArticleTitle";

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