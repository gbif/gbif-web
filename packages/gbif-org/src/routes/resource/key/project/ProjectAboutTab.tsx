import { ParticipantOrFundingOrganisationDetailsFragment, ProjectQuery } from '@/gql/graphql';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleTags } from '../components/ArticleTags';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';

import { SecondaryLinks } from '../components/SecondaryLinks';
import { Documents } from '../components/Documents';
import { KeyValuePair } from '../components/KeyValuePair';
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl';
import { DynamicLink } from '@/components/DynamicLink';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { fragmentManager } from '@/services/FragmentManager';
import { ArticleFooterWrapper } from '../components/ArticleFooterWrapper';
import { notNull } from '@/utils/notNull';

fragmentManager.register(/* GraphQL */ `
  fragment ProjectAboutTab on GbifProject {
    projectId
    id
    title
    body
    start
    end
    status
    fundsAllocated
    matchingFunds
    grantType
    purposes
    leadPartner {
      ...ParticipantOrFundingOrganisationDetails
    }
    additionalPartners {
      ...ParticipantOrFundingOrganisationDetails
    }
    leadContact
    fundingOrganisations {
      ...ParticipantOrFundingOrganisationDetails
    }
    programme {
      fundingOrganisations {
        ...ParticipantOrFundingOrganisationDetails
      }
    }
    overrideProgrammeFunding {
      ...ParticipantOrFundingOrganisationDetails
    }
    programme {
      id
      title
    }
    primaryImage {
      ...ArticleBanner
    }
    primaryLink {
      label
      url
    }
    secondaryLinks {
      label
      url
    }
    documents {
      ...DocumentPreview
    }
  }
`);

fragmentManager.register(/* GraphQL */ `
  fragment ParticipantOrFundingOrganisationDetails on ParticipantOrFundingOrganisation {
    __typename
    ... on FundingOrganisation {
      id
      title
      url
    }
    ... on Participant {
      id
      title
    }
  }
`);

export function ProjectAboutTab() {
  const { data } = useParentRouteLoaderData(RouteId.Project) as { data: ProjectQuery };

  if (data.gbifProject == null) throw new Error('404');
  const resource = data.gbifProject;

  const fundedBy = (
    resource.overrideProgrammeFunding ?? resource.programme?.fundingOrganisations
  )?.filter(notNull);

  const partners = [resource.leadPartner, ...(resource.additionalPartners ?? [])].filter(notNull);

  const coFundedBy = resource.fundingOrganisations?.filter(notNull) ?? [];

  return (
    <>
      <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage} />

      <ArticleTextContainer>
        {resource.body && (
          <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
        )}

        <ArticleFooterWrapper hrClassName="mb-8">
          {resource.fundsAllocated && (
            <KeyValuePair
              label={<FormattedMessage id="cms.project.funding" />}
              value={
                <FormattedNumber value={resource.fundsAllocated} style="currency" currency="EUR" />
              }
            />
          )}

          {resource.matchingFunds && (
            <KeyValuePair
              label={<FormattedMessage id="cms.project.coFunding" />}
              value={
                <FormattedNumber value={resource.matchingFunds} style="currency" currency="EUR" />
              }
            />
          )}

          <KeyValuePair
            label={<FormattedMessage id="cms.project.typeOfGrant" />}
            value={<FormattedMessage id={`enums.cms.projectGrantType.${resource.grantType}`} />}
          />

          {/* if start date and (no end date or start date same as end date), only show one date */}
          {resource.start && (!resource.end || resource.start === resource.end) && (
            <KeyValuePair
              label={<FormattedMessage id="cms.project.projectStart" />}
              value={
                <span>
                  <FormattedDate value={resource.start} year="numeric" month="long" day="numeric" />
                </span>
              }
            />
          )}

          {/* if start date and end date and not same, show duration */}
          {resource.start && resource.end && resource.start !== resource.end && (
            <KeyValuePair
              label={<FormattedMessage id="cms.project.duration" />}
              value={
                <span>
                  <FormattedDate value={resource.start} year="numeric" month="long" day="numeric" />{' '}
                  - <FormattedDate value={resource.end} year="numeric" month="long" day="numeric" />
                </span>
              }
            />
          )}

          {resource.programme && (
            <KeyValuePair
              label={<FormattedMessage id="cms.project.programme" />}
              value={
                <DynamicLink to={`/programme/${resource.programme?.id}`} className="underline">
                  {resource.programme?.title}
                </DynamicLink>
              }
            />
          )}

          {resource.projectId && (
            <KeyValuePair
              label={<FormattedMessage id="cms.project.projectIdentifier" />}
              value={resource.projectId}
            />
          )}

          {fundedBy && (
            <KeyValuePair
              label={<FormattedMessage id="cms.project.fundedBy" />}
              value={<ParticipantOrFundingOrganisation resources={fundedBy} />}
            />
          )}

          {coFundedBy.length && (
            <KeyValuePair
              label={<FormattedMessage id="cms.project.coFundedBy" />}
              value={<ParticipantOrFundingOrganisation resources={coFundedBy} />}
            />
          )}

          {partners.length && (
            <KeyValuePair
              label={<FormattedMessage id="cms.project.partners" />}
              value={<ParticipantOrFundingOrganisation resources={partners} />}
            />
          )}

          {resource.leadContact && (
            <KeyValuePair
              label={<FormattedMessage id="cms.project.contactDetalils" />}
              dangerouslySetInnerHTML={{ __html: resource.leadContact }}
            />
          )}

          {resource.secondaryLinks && (
            <ArticleAuxiliary>
              <SecondaryLinks links={resource.secondaryLinks} className="mt-8" />
            </ArticleAuxiliary>
          )}

          {resource.documents && (
            <ArticleAuxiliary>
              <Documents documents={resource.documents} className="mt-8" />
            </ArticleAuxiliary>
          )}

          <ArticleTags resource={resource} className="mt-8" />
        </ArticleFooterWrapper>
      </ArticleTextContainer>
    </>
  );
}

export function ProjectAboutTabSkeleton() {
  return <p>Loading...</p>;
}

function ParticipantOrFundingOrganisation({
  resources,
}: {
  resources: Array<ParticipantOrFundingOrganisationDetailsFragment | null | undefined>;
}) {
  return (
    <span className="underlineLinks">
      {resources.filter(notNull).map((f, idx, array) => (
        <span>
          {f.__typename === 'FundingOrganisation' && f.url ? (
            <a href={f.url}>{f.title}</a>
          ) : (
            f.title
          )}
          {idx + 1 !== array.length && ', '}
        </span>
      ))}
    </span>
  );
}
