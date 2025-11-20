import { ContactAction, ContactEmail, ContactTelephone } from '@/components/contact';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DirectoryContactQuery, DirectoryContactQueryVariables, NodeType } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { notNull } from '@/utils/notNull';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEffect, useMemo } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { MdLocationOn, MdPerson } from 'react-icons/md';
import { cn } from '@/utils/shadcn';

const DIRECTORY_CONTACT_QUERY = /* GraphQL */ `
  query DirectoryContact($id: ID!) {
    directoryContact(id: $id) {
      id
      firstName
      surname
      institutionName
      address
      countryCode
      phone
      email
      orcidId
      jobTitle
      profilePicture(base64: true)
      participants {
        id
        name
        type
        countryCode
        node {
          contacts(id: $id) {
            type
          }
        }
        people(id: $id) {
          role
          termStart
        }
      }
      roles {
        role
        term {
          start
          end
        }
      }
    }
  }
`;

type Props = {
  personId?: string | null;
  onClose: () => void;
};

export function DirectoryContactDialog({ personId, onClose }: Props) {
  const { data, load } = useQuery<DirectoryContactQuery, DirectoryContactQueryVariables>(
    DIRECTORY_CONTACT_QUERY,
    {
      lazyLoad: true,
    }
  );

  useEffect(() => {
    if (personId) {
      load({ variables: { id: personId } });
    }
  }, [personId, load]);

  const person = useMemo(() => {
    if (!data?.directoryContact) return undefined;
    return prepareData(data.directoryContact);
  }, [data?.directoryContact]);

  return (
    <Dialog open={!!personId} onOpenChange={onClose}>
      <DialogContent className="g-max-h-[90dvh] g-overflow-y-auto g-bg-white g-max-w-[calc(100dvw-4rem)] g-p-4 md:g-p-10 md:g-max-w-lg">
        {person && (
          <>
            <VisuallyHidden>
              <DialogHeader>
                <DialogTitle>{person.name}</DialogTitle>
              </DialogHeader>
            </VisuallyHidden>

            <div className="g-flex g-flex-row g-items-center g-flex-wrap md:g-flex-nowrap g-gap-4">
              {person.profilePicture ? (
                <img
                  src={`data:image/jpeg;base64,${person.profilePicture}`}
                  alt={person.name}
                  className="g-w-28 g-h-28 g-rounded-full g-object-cover"
                />
              ) : (
                <div className="g-h-28 g-aspect-square g-rounded-full g-bg-slate-300 g-hidden md:g-flex g-items-center g-justify-center">
                  <MdPerson className="g-w-10 g-h-10 g-text-slate-500" />
                </div>
              )}
              <div>
                <h2 className="g-text-xl g-font-bold">{person.name}</h2>
                {person.institutionName && (
                  <p className="g-text-base g-text-gray-700">{person.institutionName}</p>
                )}
              </div>
            </div>

            <div className="g-w-full g-space-y-2">
              <Separator>
                <FormattedMessage id="directory.details" />
              </Separator>

              {(person.address || person.countryCode) && (
                <ContactAction>
                  <div className="g-flex">
                    <MdLocationOn className="g-flex-none g-mt-0.5" />
                    <address
                      className="g-text-slate-500 g-not-italic"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {person.address}
                      {person.address && person.countryCode && <br />}
                      {person.countryCode && (
                        <FormattedMessage id={`enums.countryCode.${person.countryCode}`} />
                      )}
                    </address>
                  </div>
                </ContactAction>
              )}
              {person.orcidId && (
                <ContactAction>
                  <a href={person.orcidId} className="g-flex g-items-center g-text-inherit g-gap-4">
                    <img
                      style={{ pointerEvents: 'none' }}
                      src="https://www.gbif.org/img/orcid_16x16.gif"
                      alt="ORCID"
                    />
                    <span>{person.orcidId}</span>
                  </a>
                </ContactAction>
              )}
              {person.email && <ContactEmail email={person.email} />}
              {person.phone && <ContactTelephone tel={person.phone} />}
            </div>

            {person.roles.length > 0 && (
              <div>
                <Separator>
                  <FormattedMessage id="directory.roles" />
                </Separator>

                <ul className="g-space-y-4 g-mt-4">
                  {person.roles.map((role) => (
                    <li key={role.role}>
                      <div>
                        <span className="g-block g-leading-none">
                          <FormattedMessage
                            id={`enums.gbifRole.${role.role}`}
                            defaultMessage={role.role}
                          />
                        </span>
                        {role.jobTitle && (
                          <span className="g-block g-text-sm g-italic g-text-gray-500">
                            - {role.jobTitle}
                          </span>
                        )}
                        {role.countryCode && (
                          <DynamicLink
                            className="g-text-sm g-underline g-text-primary-500"
                            to={`/country/${role.countryCode}/summary`}
                          >
                            <FormattedMessage id={`enums.countryCode.${role.countryCode}`} />
                          </DynamicLink>
                        )}
                        {role.participantId && (
                          <DynamicLink
                            className="g-text-sm g-underline g-text-primary-500"
                            to={`/participant/${role.participantId}`}
                          >
                            {role.participantName}
                          </DynamicLink>
                        )}
                        {role.termStart && (
                          <span className="g-block g-text-sm g-text-gray-500">
                            <FormattedMessage
                              id="directory.sinceDate"
                              values={{
                                DATE: (
                                  <FormattedDate
                                    value={role.termStart}
                                    year="numeric"
                                    month="long"
                                    day="numeric"
                                  />
                                ),
                              }}
                            />
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

type Role = {
  role: string;
  jobTitle?: string;
  termStart?: string;
  countryCode?: string;
  participantId?: string;
  participantName?: string;
};

type PreparedData = {
  id: string;
  name: string;
  institutionName?: string;
  address?: string;
  phone?: string;
  email?: string;
  orcidId?: string;
  roles: Role[];
  profilePicture?: string;
  countryCode?: string;
};

function prepareData(data: NonNullable<DirectoryContactQuery['directoryContact']>) {
  let roles: Role[] = [];

  // Add roles from the roles property
  data.roles?.filter(notNull).forEach((rawRole) => {
    if (!rawRole.role) return;

    const role: Role = {
      role: rawRole.role ?? undefined,
      termStart: rawRole.term?.start ?? undefined,
      countryCode: undefined,
    };

    if (role.role === 'GBIFS_STAFF_MEMBER') {
      role.jobTitle = data.jobTitle ?? undefined;
    }

    roles.push(role);
  });

  // Add roles from the participants people property
  data.participants?.filter(notNull).forEach((participant) => {
    if (!participant.people) return;

    participant.people.filter(notNull).forEach((person) => {
      if (!person.role) return;
      // Don't add duplicate roles
      if (roles.some((existingRole) => existingRole.role === person.role)) return;

      const role: Role = {
        role: person.role ?? undefined,
        termStart: person.termStart ?? undefined,
      };

      if (participant.type === NodeType.Country) {
        role.countryCode = participant.countryCode ?? undefined;
      } else {
        role.participantId = participant.id;
        role.participantName = participant.name ?? undefined;
      }

      roles.push(role);
    });
  });

  // Add roles from the participants node contacts property (only if the same role has not already been added with the smae role and countryCode)
  data.participants?.filter(notNull).forEach((participant) => {
    if (!participant.node?.contacts) return;

    participant.node.contacts.filter(notNull).forEach((contact) => {
      if (!contact.type) return;
      // Don't add duplicate roles
      if (roles.some((existingRole) => existingRole.role === contact.type)) return;

      const role: Role = {
        role: contact.type ?? undefined,
      };

      if (participant.type === NodeType.Country) {
        role.countryCode = participant.countryCode ?? undefined;
      } else {
        role.participantId = participant.id;
        role.participantName = participant.name ?? undefined;
      }

      roles.push(role);
    });
  });

  // Remove roles stating with DIRECTORY
  roles = roles.filter((x) => !x.role.startsWith('DIRECTORY'));
  // Remove roles that end with _SUPPORT
  roles = roles.filter((x) => !x.role.endsWith('_SUPPORT'));

  // Replace double newlines with single newlines
  const address =
    typeof data.address === 'string'
      ? data.address.replace(/\n\n/g, '\n')
      : data.address ?? undefined;

  const result: PreparedData = {
    id: data.id,
    name: `${data.firstName} ${data.surname}`,
    institutionName: data.institutionName ?? undefined,
    address,
    phone: data.phone ?? undefined,
    countryCode: data.countryCode ?? undefined,
    email: data.email ?? undefined,
    orcidId: data.orcidId ?? undefined,
    roles,
    profilePicture: data.profilePicture ?? undefined,
  };

  return result;
}

function Separator({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('g-relative', className)}>
      <hr className="g-absolute g-top-1/2 g-left-0 g-right-0" />
      <div className="g-relative g-w-full g-text-center">
        <span className="g-bg-white g-px-2">{children}</span>
      </div>
    </div>
  );
}
