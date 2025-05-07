import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useParams } from 'react-router-dom';
import { DataFromCountryMap } from './components/dataFromCountryMap';
import { FormattedMessage } from 'react-intl';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Trends } from './components/trends';

export function CountryKeyPublishing() {
  const { countryCode } = useParams();

  if (!countryCode) throw new Error('Country code is required');

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
        <DataFromCountryMap countryCode={countryCode} />

        <CardHeader>
          <CardTitle>
            <FormattedMessage
              // TODO: add i18n key
              id="countryKey.publishingTrends"
              defaultMessage="Publishing trends"
            />
          </CardTitle>
        </CardHeader>
        <Trends type="publishedBy" countryCode={countryCode} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
