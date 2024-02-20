import { ProgrammeFundingBannerFragment, ProjectFundingBannerFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/FragmentManager';
import { FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment ProgrammeFundingBanner on Programme {
    __typename
    fundingOrganisations {
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
  }
`);

fragmentManager.register(/* GraphQL */ `
  fragment ProjectFundingBanner on GbifProject {
    __typename
    fundsAllocated
    programme {
      ...ProgrammeFundingBanner
    }
  }
`);

type Props = {
  resource: ProgrammeFundingBannerFragment | ProjectFundingBannerFragment;
};

export function FundingBanner({ resource }: Props) {
  const fundingOrganisations =
    resource.__typename === 'GbifProject'
      ? resource.programme?.fundingOrganisations
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
        {fundingOrganisations?.map((fundingOrganisation) => (
          <div key={fundingOrganisation.id}>
            <a href="http://europa.eu/" className="flex flex-col items-center group">
              <img
                className="max-w-28"
                src="//images.ctfassets.net/uo17ejk9rkwj/6DO53L2kCckOgSKiyoU28i/73ce7be12fe8c9e90dd4c2516db099b7/flag-yellow-low.jpg"
                // TODO: How to get the image? None of the images are available in the CMS
                // src={fundingOrganisation.logo?.file.url}
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
