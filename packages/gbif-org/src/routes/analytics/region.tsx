import regions from '@/enums/basic/gbifRegion.json';
import { NotFoundError } from '@/errors';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Trends } from '../country/key/components/trends';
import { ArticleContainer } from '../resource/key/components/articleContainer';
import { ArticleIntro } from '../resource/key/components/articleIntro';
import { ArticlePreTitle } from '../resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../resource/key/components/articleTitle';
import { PageContainer } from '../resource/key/components/pageContainer';

export function RegionAnalyticsPage() {
  const { regionKey } = useParams();
  if (!regions.includes(regionKey as string)) {
    throw new NotFoundError();
  }

  return (
    <article>
      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <ArticlePreTitle>
            <FormattedMessage id="trends.analytics" />
          </ArticlePreTitle>

          <ArticleTitle>
            <FormattedMessage
              id="trends.regionDataTrends"
              values={{
                TRANSLATED_REGION: <FormattedMessage id={`enums.gbifRegion.${regionKey}`} />,
              }}
            />
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
          <Trends path={`/gbifRegion/${regionKey}/about/`} />
        </ArticleTextContainer>
      </ArticleContainer>
    </article>
  );
}
