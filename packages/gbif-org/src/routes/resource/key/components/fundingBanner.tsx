import { ProgrammeFundingBannerFragment, ProjectFundingBannerFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { notNull } from '@/utils/notNull';
import { FormattedMessage, FormattedNumber } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment FundingOrganisationDetails on FundingOrganisation {
    id
    title
    url
    logo {
      title
      file {
        url
      }
    }
  }
`);

fragmentManager.register(/* GraphQL */ `
  fragment ProgrammeFundingBanner on Programme {
    __typename
    fundingOrganisations {
      ...FundingOrganisationDetails
    }
  }
`);

fragmentManager.register(/* GraphQL */ `
  fragment ProjectFundingBanner on GbifProject {
    __typename
    fundsAllocated
    programme {
      ...ProgrammeFundingBanner
    }
    overrideProgrammeFunding {
      ...FundingOrganisationDetails
    }
  }
`);

type Props = {
  resource: ProgrammeFundingBannerFragment | ProjectFundingBannerFragment;
};

export function FundingBanner({ resource }: Props) {
  const fundingOrganisations =
    resource.__typename === 'GbifProject'
      ? resource.overrideProgrammeFunding ?? resource.programme?.fundingOrganisations
      : resource.fundingOrganisations;

  const fundsAllocated =
    resource.__typename === 'GbifProject' ? resource.fundsAllocated : undefined;

  return (
    <div className='g-bg-slate-100 g-mt-6 g-p-6 g-flex g-flex-col g-items-center'>
      {fundsAllocated && (
        <span className='g-text-gray-500 g-text-xs'>
          € <FormattedNumber value={fundsAllocated} />{' '}
          <FormattedMessage id="cms.project.fundedBy" />
        </span>
      )}

      <div className='g-mt-4 g-flex g-gap-8 g-flex-wrap g-justify-center'>
        {fundingOrganisations
          ?.filter(notNull)
          .filter((x) => !x.logo)
          .map((fundingOrganisation) => (
            <div key={fundingOrganisation.id}>
              <a href={fundingOrganisation.url!} className='g-flex g-flex-col g-items-center g-group'>
                <span className='g-text-gray-500 g-text-sm g-pt-2 group-hover:g-underline'>
                  {fundingOrganisation.title}
                </span>
              </a>
            </div>
          ))}
      </div>

      <div className='g-mt-4 g-flex g-gap-8 g-flex-wrap g-justify-center'>
        {fundingOrganisations
          ?.filter(notNull)
          .filter((x) => x.logo)
          .map((fundingOrganisation) => (
            <div key={fundingOrganisation.id}>
              <a href={fundingOrganisation.url!} className='g-flex g-flex-col g-items-center g-group'>
                <img className='g-max-w-28' src={fundingOrganisation.logo?.file.url} />
                <span className='g-text-gray-500 g-text-sm g-pt-2 group-hover:g-underline'>
                  {fundingOrganisation.title}
                </span>
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}
