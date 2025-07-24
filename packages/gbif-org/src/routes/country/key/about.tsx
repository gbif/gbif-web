import { ClientSideOnly } from '@/components/clientSideOnly';
import * as charts from '@/components/dashboard';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { DataAboutCountryMap } from './components/dataAboutCountryMap';
import { OccurrencesPerKingdom } from './components/kingdoms/occurrencesPerKingdom';
import { Trends } from './components/trends';

export function CountryKeyAbout() {
  const { countryCode } = useParams();
  const { formatMessage } = useIntl();

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
              id="country.trendsAboutCountry"
              values={{
                TRANSLATED_COUNTRY: formatMessage({ id: `enums.countryCode.${countryCode}` }),
              }}
            />
          </CardTitle>
        </CardHeader>
        <Trends path={`country/${countryCode}/about`} countryCode={countryCode} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
