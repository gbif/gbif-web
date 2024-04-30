import {
  OrganizationOption,
  OrganizationSearchSugget,
} from '@/components/SearchSelect/OrganizationSearchSuggest';
import { useState } from 'react';
import { CheckboxField } from '../BecomeAPublisherForm';
import { cn } from '@/utils/shadcn';
import { ConditionalWrapper } from '@/components/ConditionalWrapper';
import { TimeAgo } from '@/components/TimeAgo';
import { DynamicLink } from '@/components/DynamicLink';
import { OrganizationPreviewQuery, OrganizationPreviewQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';

export function CheckRegistration() {
  const [organization, setOrganization] = useState<OrganizationOption | null | undefined>();

  return (
    <>
      <p className="pb-2 text-sm">
        First, please see if your organization is already registered as a GBIF publisher.
      </p>

      <OrganizationSearchSugget
        setSelected={setOrganization}
        selected={organization}
        noSelectionPlaceholder="Search for your organization"
      />

      {organization && <OrganizationPreview id={organization.key} />}

      <div className="pt-4">
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
    <div className={cn('bg-gray-100 p-4', className)}>
      <p className="text-sm text-gray-800">
        If you are affiliated with the selected organization, you should approach the contact for
        practical knowledge of data publishing.
      </p>
      {organization && (
        <div className="bg-white mt-2 border">
          <DynamicLink to={`/publisher/${id}`}>
            <h3 className="p-2 text-base font-semibold text-blue-500 hover:underline">
              {organization.title}
            </h3>
          </DynamicLink>

          <hr />

          <div className="p-2">
            {organization.created && (
              <span className="text-xs block text-primary-600">
                Joined <TimeAgo date={new Date(organization.created)} />
              </span>
            )}

            {contact && (
              <span className="block text-xs">
                Contact:{' '}
                <ConditionalWrapper
                  condition={typeof contact.email?.[0] === 'string'}
                  wrapper={(children) => (
                    <a
                      className="text-blue-500 hover:underline"
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

            {organization.description && <p className="text-xs mt-1">{organization.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
