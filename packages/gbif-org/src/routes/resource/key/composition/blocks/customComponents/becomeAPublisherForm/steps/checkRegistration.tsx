import {
  OrganizationOption,
  OrganizationSearchSugget,
} from '@/components/searchSelect/organizationSearchSuggest';
import { useState } from 'react';
import { CheckboxField } from '../becomeAPublisherForm';
import { cn } from '@/utils/shadcn';
import { ConditionalWrapper } from '@/components/conditionalWrapper';
import { TimeAgo } from '@/components/timeAgo';
import { DynamicLink } from '@/reactRouterPlugins';
import { OrganizationPreviewQuery, OrganizationPreviewQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';

export function CheckRegistration() {
  const [organization, setOrganization] = useState<OrganizationOption | null | undefined>();

  return (
    <>
      <p className="g-pb-2 g-text-sm">
        First, please see if your organization is already registered as a GBIF publisher.
      </p>

      <OrganizationSearchSugget
        setSelected={setOrganization}
        selected={organization}
        noSelectionPlaceholder="Search for your organization"
      />

      {organization && <OrganizationPreview id={organization.key} />}

      <div className="g-pt-4">
        <CheckboxField
          name="checkRegistration"
          label="My organization is not already registered."
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

  return (
    <div className={cn('g-bg-gray-100 g-p-4', className)}>
      <p className="g-text-sm g-text-gray-800">
        If you are affiliated with the selected organization, you should approach the contact for
        practical knowledge of data publishing.
      </p>
      {organization && (
        <div className="g-bg-white g-mt-2 g-border">
          <DynamicLink to={`/publisher/${id}`}>
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

            {contact && (
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
            )}

            {organization.description && (
              <p className="g-text-xs g-mt-1">{organization.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
