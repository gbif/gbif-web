import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useParams } from 'react-router-dom';
import { DataAboutCountryMap } from './components/dataAboutCountryMap';
import { DataFromCountryMap } from './components/dataFromCountryMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import Properties, { Property } from '@/components/properties';
import { fragmentManager } from '@/services/fragmentManager';
import { CountryKeySummaryFragment } from '@/gql/graphql';
import { useCountryKeyLoaderData } from '.';
import { ContactList } from '@/components/contactList';
import { notNull } from '@/utils/notNull';
import { MaybeArray } from '@/types';

export function CountryKeySummary() {
  const { countryCode } = useParams();
  const { data } = useCountryKeyLoaderData();

  console.log(data);

  // This will only happen if the page is mounted on the wrong route (without :countryCode in the path)
  if (!countryCode) throw new Error('Country code is required');

  const preparedContacts = orderAndMergeContacts(data?.nodeCountry?.contacts);

  console.log(preparedContacts);

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

        {preparedContacts && (
          <section>
            <Card>
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="TODO" defaultMessage="Contacts" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactList contacts={preparedContacts} />
              </CardContent>
            </Card>
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
    contacts {
      key
      firstName
      lastName

      organization
      position
      roles
      type

      address
      city
      postalCode
      province
      country

      homepage
      email
      phone
      userId
    }
    participant {
      membershipStart
      nodeEstablishmentDate
    }
  }
`);

const contactOrder = ['HEAD_OF_DELEGATION', 'NODE_MANAGER'];

type Contact = NonNullable<NonNullable<CountryKeySummaryFragment['contacts']>[number]>;
type MergedContact = Omit<Contact, 'type'> & { type?: MaybeArray<Contact['type']> };

function orderAndMergeContacts(
  contacts: CountryKeySummaryFragment['contacts']
): MergedContact[] | undefined {
  if (!contacts) return;

  const clonedContacts = structuredClone(contacts);

  // Order contacts by type using contactOrder array
  const orderedContacts: Contact[] = clonedContacts.filter(notNull).sort((a, b) => {
    const aIndex = contactOrder.indexOf(a.type || '');
    const bIndex = contactOrder.indexOf(b.type || '');

    // If both types are in contactOrder, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // If only one type is in contactOrder, that one comes first
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    // If neither type is in contactOrder, maintain original order
    return 0;
  });

  // get unique contacts
  const uniqueContacts: MergedContact[] = orderedContacts.filter(
    (contact, index, self) => self.findIndex((t) => t.key === contact.key) === index
  );

  // get duplicates
  const duplicates = orderedContacts.filter(
    (contact, index, self) => self.findIndex((t) => t.key === contact.key) !== index
  );

  // merge contact.type from duplicates to unique contacts
  duplicates.forEach((contact) => {
    const existingContact = uniqueContacts.find((c) => c.key === contact.key);
    if (existingContact) {
      const types: Contact['type'][] = [];
      if (Array.isArray(existingContact.type)) types.push(...existingContact.type);
      if (typeof existingContact.type === 'string') types.push(existingContact.type);
      if (Array.isArray(contact.type)) types.push(...contact.type);
      if (typeof contact.type === 'string') types.push(contact.type);
      existingContact.type = types;
    }
  });

  return uniqueContacts;
}
