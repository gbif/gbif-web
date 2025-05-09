import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { DataAboutCountryMap } from './components/dataAboutCountryMap';
import { useParams } from 'react-router-dom';
import { CardTitle } from '@/components/ui/largeCard';
import { CardHeader } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { Trends } from './components/trends';
import { OccurrencesPerKingdom } from './components/kingdoms/occurrencesPerKingdom';

export function CountryKeyAbout() {
  const { countryCode } = useParams();

  if (!countryCode) throw new Error('Country code is required');

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
        <DataAboutCountryMap countryCode={countryCode} />

        <OccurrencesPerKingdom type="about" countryCode={countryCode} />

        <CardHeader>
          <CardTitle>
            <FormattedMessage
              // TODO: add i18n key
              id="countryKey.trendsAboutCountry"
              defaultMessage="Trends about Denmark"
            />
          </CardTitle>
        </CardHeader>
        <Trends type="about" countryCode={countryCode} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
