import { FormattedMessage, useIntl } from 'react-intl';
import { Trends } from '../country/key/components/trends';
import { ArticleContainer } from '../resource/key/components/articleContainer';
import { ArticleIntro } from '../resource/key/components/articleIntro';
import { ArticlePreTitle } from '../resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../resource/key/components/articleTitle';
import { PageContainer } from '../resource/key/components/pageContainer';
import { TrendsSelector } from './trendsSelector';
import PageMetaData from '@/components/PageMetaData';

export function GlobalAnalyticsPage() {
  const { formatMessage } = useIntl();

  const title = formatMessage({ id: 'trends.globalDataTrends' });

  const description = formatMessage(
    { id: 'trends.trendsInDataAvailabilityOnTheGbifNetwork' },
    { YEAR: new Date().getFullYear().toString() }
  );

  return (
    <article>
      <PageMetaData
        title={title}
        description={description}
        // TODO: Add image url
        path="/analytics/global"
      />
      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <ArticlePreTitle secondary={<FormattedMessage id="trends.global" />}>
            <FormattedMessage id="trends.analytics" />
          </ArticlePreTitle>

          <ArticleTitle>{title}</ArticleTitle>

          <ArticleIntro>{description}</ArticleIntro>

          <TrendsSelector value="GLOBAL" />
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
