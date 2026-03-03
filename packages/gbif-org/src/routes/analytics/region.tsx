import regions from '@/enums/basic/gbifRegion.json';
import { NotFoundLoaderResponse } from '@/errors';
import { LoaderArgs } from '@/reactRouterPlugins';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Trends } from '../country/key/components/trends';
import { ArticleContainer } from '../resource/key/components/articleContainer';
import { ArticleIntro } from '../resource/key/components/articleIntro';
import { ArticlePreTitle } from '../resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../resource/key/components/articleTitle';
import { PageContainer } from '../resource/key/components/pageContainer';
import { TrendsSelector } from './trendsSelector';
import PageMetaData from '@/components/PageMetaData';

export function regionLoader({ params }: LoaderArgs) {
  const regionKey = params.regionKey;

  if (typeof regionKey !== 'string' || !regions.includes(regionKey)) {
    throw new NotFoundLoaderResponse(`There is no region with a key of ${regionKey}`);
  }

  return null;
}

export function RegionAnalyticsPage() {
  const { regionKey } = useParams();
  const { formatMessage } = useIntl();

  const title = formatMessage(
    { id: 'trends.regionDataTrends' },
    { TRANSLATED_REGION: formatMessage({ id: `enums.gbifRegion.${regionKey}` }) }
  );

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
        path={`/analytics/region/${regionKey}`}
      />
      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <ArticlePreTitle secondary={<FormattedMessage id={`enums.gbifRegion.${regionKey}`} />}>
            <FormattedMessage id="trends.analytics" />
          </ArticlePreTitle>

          <ArticleTitle>{title}</ArticleTitle>

          <ArticleIntro>{description}</ArticleIntro>

          <TrendsSelector value={regionKey} />
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
