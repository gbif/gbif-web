import { TaxonKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';

const SourceDataset = ({ taxonData }: { taxonData: TaxonKeyQuery }) => {
  const sourceDataset = taxonData?.taxonInfo?.taxon?.sourceDataset;
  if (!sourceDataset) return null;
  return (
    <>
      <FormattedMessage id="taxon.source" defaultMessage="Source" />
      {': '}
      <DynamicLink
        className="hover:g-underline g-text-primary-500"
        pageId="datasetKey"
        variables={{ key: sourceDataset.key }}
      >
        {sourceDataset.title}
      </DynamicLink>
    </>
  );
};

export default SourceDataset;
