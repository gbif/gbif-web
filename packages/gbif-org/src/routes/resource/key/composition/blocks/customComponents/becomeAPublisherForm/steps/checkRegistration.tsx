import { ConditionalWrapper } from '@/components/conditionalWrapper';
import {
  OrganizationOption,
  OrganizationSearchSugget,
} from '@/components/searchSelect/organizationSearchSuggest';
import { TimeAgo } from '@/components/timeAgo';
import { OrganizationPreviewQuery, OrganizationPreviewQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CheckboxField } from '../becomeAPublisherForm';
export function CheckRegistration() {
  const [organization, setOrganization] = useState<OrganizationOption | null | undefined>();
  const intl = useIntl();
  return (
    <>
      <p className="g-pb-2 g-text-sm">
        <FormattedMessage
          id="eoi.firstPleaseSeeIfYourOrg"
          defaultMessage="First, please see if your organization is already registered as a GBIF publisher."
        />
      </p>

      <OrganizationSearchSugget
        setSelected={setOrganization}
        selected={organization}
        noSelectionPlaceholder={intl.formatMessage({
          id: 'eoi.searchOrganisations',
          defaultMessage: 'Search for your organization',
        })}
      />

      {organization && <OrganizationPreview id={organization.key} />}

      <div className="g-pt-4">
        <CheckboxField
          name="checkRegistration"
          label={
            <FormattedMessage
              id="eoi.myOrgIsNotRegistered"
              defaultMessage="My organization is not already registered."
            />
          }
        />
      </div>
    </>
  );
}

const ORGANIZATION_PREVIEW_QUERY = /* GraphQL */ `
  query OrganizationPreview($key: ID!) {
    organization(key: $key) {
      title
      created
      contacts {
        email
        firstName
        lastName
      }
      description
    }
  }
`;

function OrganizationPreview({ id, className }: { id: string; className?: string }) {
  const { data } = useQuery<OrganizationPreviewQuery, OrganizationPreviewQueryVariables>(
    ORGANIZATION_PREVIEW_QUERY,
    { variables: { key: id } }
  );

  const organization = data?.organization;
  const contact = organization?.contacts?.[0];
  const contacts = organization?.contacts || [];
  return (
    <div className={cn('g-bg-gray-100 g-p-4', className)}>
      <p className="g-text-sm g-text-gray-800">
        <FormattedMessage
          id="eoi.ifYouAreAffiliatedWithTheSelectedOrganization"
          defaultMessage="If you are affiliated with the selected organization, you should approach the contact for practical knowledge of data publishing."
        />
      </p>
      {organization && (
        <div className="g-bg-white g-mt-2 g-border">
          <DynamicLink to={`/publisher/${id}`} pageId="publisherKey" variables={{ key: id }}>
            <h3 className="g-p-2 g-text-base g-font-semibold g-text-blue-500 hover:g-underline">
              {organization.title}
            </h3>
          </DynamicLink>

          <hr />

          <div className="g-p-2">
            {organization.created && (
              <span className="g-text-xs g-block g-text-primary-600">
                Joined <TimeAgo date={new Date(organization.created)} />
              </span>
            )}
            <span className="g-text-xs g-block g-text-gray-500">
              <FormattedMessage id="eoi.contacts" defaultMessage="Contacts" />:
            </span>
            {contacts.length > 0 &&
              contacts.map((contact, index) => (
                <span key={index} className="g-block g-text-xs">
                  {contact.firstName} {contact.lastName}
                  {contact.email?.[0] && (
                    <ConditionalWrapper
                      condition={typeof contact.email?.[0] === 'string'}
                      wrapper={(children) => (
                        <a
                          className="g-text-blue-500 hover:g-underline"
                          href={`mailto:${contact.email?.[0]}`}
                        >
                          {children}
                        </a>
                      )}
                    >
                      {contact.email?.[0]}
                    </ConditionalWrapper>
                  )}
                </span>
              ))}

            {/*  {contact && (
              <span className="g-block g-text-xs">
                Contact:{' '}
                <ConditionalWrapper
                  condition={typeof contact.email?.[0] === 'string'}
                  wrapper={(children) => (
                    <a
                      className="g-text-blue-500 hover:g-underline"
                      href={`mailto:${contact.email?.[0]}`}
                    >
                      {children}
                    </a>
                  )}
                >
                  {contact.firstName} {contact.lastName}
                </ConditionalWrapper>
              </span>
            )} */}

            {organization.description && (
              <p className="g-text-xs g-mt-1">{organization.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
