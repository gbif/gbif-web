import { ContactList } from '@/components/contactList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { NodeContactsFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { MaybeArray } from '@/types';
import { notNull } from '@/utils/notNull';
import { FormattedMessage } from 'react-intl';

type Props = {
  contacts: NodeContactsFragment['contacts'];
};

export function Contacts({ contacts }: Props) {
  const preparedContacts = orderAndMergeContacts(contacts);

  return (
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
  );
}

fragmentManager.register(/* GraphQL */ `
  fragment NodeContacts on Node {
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
  }
`);

const contactOrder = ['HEAD_OF_DELEGATION', 'NODE_MANAGER'];

type Contact = NonNullable<NonNullable<NodeContactsFragment['contacts']>[number]>;
type MergedContact = Omit<Contact, 'type'> & { type?: MaybeArray<Contact['type']> };

function orderAndMergeContacts(
  contacts: NodeContactsFragment['contacts']
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
