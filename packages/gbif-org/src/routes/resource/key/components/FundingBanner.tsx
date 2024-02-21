import { ProgrammeFundingBannerFragment, ProjectFundingBannerFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/FragmentManager';
import { notNull } from '@/utils/notNull';
import { FormattedMessage } from 'react-intl';

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
    <div className="bg-slate-100 mt-6 p-6 flex flex-col items-center">
      <span className="text-gray-500 text-xs">
        {fundsAllocated && `€ ${fundsAllocated} `}
        <FormattedMessage id="cms.project.fundedBy" />
      </span>

      <div className="pt-6 flex gap-8 flex-wrap justify-center">
        {fundingOrganisations?.filter(notNull).map((fundingOrganisation) => (
          <div key={fundingOrganisation.id}>
            <a href={fundingOrganisation.url!} className="flex flex-col items-center group">
              <img
                className="max-w-28"
                src={fundingOrganisation.logo?.file.url}
              />
              <span className="text-gray-500 text-sm pt-2 group-hover:underline">
                {fundingOrganisation.title}
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
