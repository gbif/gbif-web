import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useParams } from 'react-router-dom';
import { DataAboutCountryMap } from './components/dataAboutCountryMap';
import { DataFromCountryMap } from './components/dataFromCountryMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import Properties, { Property } from '@/components/properties';
import { fragmentManager } from '@/services/fragmentManager';
import { useCountryKeyLoaderData } from '.';
import { Contacts } from './components/contacts';

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

        <section>
          <Card>
            <CardHeader>
              <CardTitle>
                <FormattedMessage id="TODO" defaultMessage="Participant summary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Properties className="[&_a]:g-text-primary-500">
                <Property labelId="Memeber status" value="Voting" />
                <Property labelId="GBIF participant since" value="2001" />
                <Property labelId="GBIF region" value="Europe and Central Asia" />
                {/* Add link to contacts section */}
                <Property labelId="Head of delegation" value="Kim Steenstrup Pedersen" />
                {/* Add link to contacts section */}
                <Property
                  labelId="Node name"
                  value="DanBIF - Danish Biodiversity Information Facility"
                />
                <Property labelId="Node established" value="2001" />
                <Property
                  labelId="Website"
                  value="http://www.danbif.dk"
                  formatter={(v) => <a href={v}>{v}</a>}
                />
                {/* Add link to contacts section */}
                <Property labelId="Participant node manager" value="Isabel Calabuig" />
              </Properties>
            </CardContent>
          </Card>
        </section>

        {data?.nodeCountry?.contacts && (
          <section>
            <Contacts contacts={data.nodeCountry.contacts} />
          </section>
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

fragmentManager.register(/* GraphQL */ `
  fragment CountryKeySummary on Node {
    gbifRegion
    participationStatus
    participant {
      membershipStart
      nodeEstablishmentDate
    }
    ...NodeContacts
  }
`);
