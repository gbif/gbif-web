import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useCountryKeyLoaderData } from '.';
import { Contacts } from './components/contacts';
import { DataAboutCountryMap } from './components/dataAboutCountryMap';
import { DataFromCountryMap } from './components/dataFromCountryMap';
import { ParticipantSummary } from './components/participantSummary';

export function CountryKeySummary() {
  const { countryCode } = useParams();
  const { data } = useCountryKeyLoaderData();

  // This will only happen if the page is mounted on the wrong route (without :countryCode in the path)
  if (!countryCode) throw new Error('Country code is required');

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
        <DataAboutCountryMap countryCode={countryCode} />

        <DataFromCountryMap countryCode={countryCode} />

        {data?.nodeCountry?.participant?.participationStatus === 'VOTING' && (
          <>
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="participant.participantSummary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ParticipantSummary participant={data.nodeCountry} />
                </CardContent>
              </Card>
            </section>
            <section>
              <Contacts
                contacts={data.nodeCountry.contacts}
                nodeTitle={data.nodeCountry.title}
                nodeAddress={data.nodeCountry.address}
              />
            </section>
          </>
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
