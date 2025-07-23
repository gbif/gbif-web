import { BulletList } from '@/components/bulletList';
import {
  ContactActions,
  ContactAvatar,
  ContactContent,
  ContactDescription,
  ContactEmail,
  ContactHeader,
  ContactHeaderContent,
  ContactTelephone,
  ContactTitle,
} from '@/components/contact';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { NodeContactsFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { MaybeArray } from '@/types';
import { isNoneEmptyArray } from '@/utils/isNoneEmptyArray';
import { notNull } from '@/utils/notNull';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

type Props = {
  contacts: NodeContactsFragment['contacts'];
  nodeTitle?: string | null;
  nodeAddress?: null | (string | null)[];
  fullWidthCards?: boolean;
};

export function Contacts({ contacts, nodeTitle, nodeAddress, fullWidthCards = false }: Props) {
  const preparedContacts = orderAndMergeContacts(contacts);

  const hash = useLocation().hash.replace('#', '');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="country.contacts" />
        </CardTitle>
      </CardHeader>
      <CardContent className="g-flex g-flex-wrap">
        <NodeAddressCard
          fullWidthCard={fullWidthCards}
          nodeTitle={nodeTitle}
          nodeAddress={nodeAddress}
          highlighted={hash === 'nodeAddress'}
        />
        {preparedContacts?.map((contact) => (
          <PersonContactCard
            fullWidthCard={fullWidthCards}
            key={contact.key}
            contact={contact}
            highlighted={hash === `contact${contact.key}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}

type NodeAddressCardProps = {
  nodeTitle?: string | null;
  nodeAddress?: null | (string | null)[];
  highlighted?: boolean;
  fullWidthCard?: boolean;
};

function NodeAddressCard({
  nodeTitle,
  nodeAddress,
  highlighted,
  fullWidthCard = false,
}: NodeAddressCardProps) {
  return (
    <Card
      id="nodeAddress"
      className={cn(
        'g-px-6 g-py-4 g-flex-auto g-min-w-xs g-m-2 g-w-1/2',
        highlighted && 'g-bg-slate-100',
        !fullWidthCard && 'g-max-w-sm'
      )}
    >
      <ContactHeader>
        <ContactAvatar organization={nodeTitle} />
        <ContactHeaderContent>
          <ContactTitle>{nodeTitle}</ContactTitle>
        </ContactHeaderContent>
      </ContactHeader>
      <ContactContent>
        <address>
          {nodeAddress
            ?.filter(notNull)
            .map((address) => address.split('\n').map((line, i) => <div key={i}>{line}</div>))}
        </address>
      </ContactContent>
    </Card>
  );
}

type PersonContactCardProps = {
  contact: MergedContact;
  highlighted?: boolean;
  fullWidthCard?: boolean;
};

function PersonContactCard({
  contact,
  highlighted,
  fullWidthCard = false,
}: PersonContactCardProps) {
  return (
    <Card
      className={cn(
        'g-px-6 g-py-4 g-flex-auto g-min-w-xs g-m-2 g-w-1/2',
        highlighted && 'g-bg-slate-100',
        !fullWidthCard && 'g-max-w-sm'
      )}
      key={contact.key}
      id={`contact${contact.key}`}
    >
      <ContactHeader>
        <ContactAvatar
          firstName={contact.firstName}
          lastName={contact.lastName || contact.surname}
        />
        <ContactHeaderContent>
          <ContactTitle
            title={contact.title}
            firstName={contact.firstName}
            lastName={contact.lastName || contact.surname}
          />
          <ContactDescription>
            <BulletList>
              {asArray(contact.type).map((type) => (
                <li key={type}>
                  <FormattedMessage id={`enums.gbifRole.${type}`} defaultMessage={type} />
                </li>
              ))}
            </BulletList>
          </ContactDescription>
        </ContactHeaderContent>
      </ContactHeader>
      <ContactContent className="g-flex g-flex-col g-gap-1.5">
        {contact.institutionName && <p>{contact.institutionName}</p>}
        {contact.address && (
          <address>
            {contact.address
              .filter(notNull)
              .map((address) => address.split('\n').map((line, i) => <div key={i}>{line}</div>))}
            {contact.city ||
              (contact.postalCode && (
                <p>
                  {contact.city} {contact.postalCode}
                </p>
              ))}
            {contact.province && <p>{contact.province}</p>}
            {contact.country && (
              <FormattedMessage
                id={`enums.countryCode.${contact.country}`}
                defaultMessage={contact.country}
              />
            )}
          </address>
        )}
      </ContactContent>
      <ContactActions className="g-pt-2">
        {isNoneEmptyArray(contact.email) &&
          contact.email.map((email) => <ContactEmail key={email} email={email} />)}
        {isNoneEmptyArray(contact.phone) &&
          contact.phone.map((tel) => <ContactTelephone key={tel} tel={tel} />)}
      </ContactActions>
    </Card>
  );
}

fragmentManager.register(/* GraphQL */ `
  fragment NodeContacts on Node {
    contacts {
      key
      title
      firstName
      surname
      lastName
      institutionName

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

function asArray<T>(value: MaybeArray<T | null | undefined>): T[] {
  if (Array.isArray(value)) return value.filter(notNull);
  if (value === null || value === undefined) return [];
  return [value];
}
