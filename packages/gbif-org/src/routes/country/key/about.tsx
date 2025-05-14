import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { DataAboutCountryMap } from './components/dataAboutCountryMap';
import { useParams } from 'react-router-dom';
import { CardTitle } from '@/components/ui/largeCard';
import { CardHeader } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { Trends } from './components/trends';
import { OccurrencesPerKingdom } from './components/kingdoms/occurrencesPerKingdom';
import * as charts from '@/components/dashboard';
import { useMemo } from 'react';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import { ClientSideOnly } from '@/components/clientSideOnly';

export function CountryKeyAbout() {
  const { countryCode } = useParams();

  if (!countryCode) throw new Error('Country code is required');

  const predicate = useMemo(() => {
    return {
      type: 'equals',
      key: 'countryCode',
      value: countryCode,
    };
  }, [countryCode]);

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
        <DataAboutCountryMap countryCode={countryCode} />

        <OccurrencesPerKingdom type="about" countryCode={countryCode} />

        <ClientSideOnly>
          <DashBoardLayout>
            <charts.Months
              predicate={predicate}
              defaultOption="COLUMN"
              visibilityThreshold={0}
              interactive={false}
            />
            <charts.EventDate
              predicate={predicate}
              visibilityThreshold={1}
              options={['TIME']}
              interactive={false}
            />
            <charts.BasisOfRecord
              predicate={predicate}
              visibilityThreshold={0}
              defaultOption="PIE"
            />
            <charts.Licenses predicate={predicate} visibilityThreshold={0} defaultOption="PIE" />
            <charts.PublishingCountryCode
              predicate={predicate}
              visibilityThreshold={1}
              defaultOption="TABLE"
              options={['PIE', 'TABLE']}
            />
            <charts.Datasets predicate={predicate} visibilityThreshold={0} defaultOption="TABLE" />
          </DashBoardLayout>
        </ClientSideOnly>

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
