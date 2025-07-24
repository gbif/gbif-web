import { FormattedMessage } from 'react-intl';
import { Trends } from '../country/key/components/trends';
import { ArticleContainer } from '../resource/key/components/articleContainer';
import { ArticleIntro } from '../resource/key/components/articleIntro';
import { ArticlePreTitle } from '../resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../resource/key/components/articleTitle';
import { PageContainer } from '../resource/key/components/pageContainer';

export function GlobalAnalyticsPage() {
  return (
    <article>
      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <ArticlePreTitle>
            <FormattedMessage id="trends.analytics" />
          </ArticlePreTitle>

          <ArticleTitle>
            <FormattedMessage id="trends.globalDataTrends" />
          </ArticleTitle>

          <ArticleIntro>
            <FormattedMessage
              id="trends.trendsInDataAvailabilityOnTheGbifNetwork"
              values={{ YEAR: new Date().getFullYear().toString() }}
            />
          </ArticleIntro>
        </ArticleTextContainer>
      </PageContainer>
      <ArticleContainer className="g-bg-slate-100 g-pt-4">
        <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
          <Trends path="global" />
        </ArticleTextContainer>
      </ArticleContainer>
    </article>
  );
}
