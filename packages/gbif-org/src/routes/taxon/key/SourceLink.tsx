import { TaxonKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

const SourceLink = ({ taxonData }: { taxonData: TaxonKeyQuery }) => {
  const sourceTaxon = taxonData?.taxonInfo?.taxon?.sourceTaxon;
  const sourceID = taxonData?.taxonInfo?.taxon?.sourceID;
  if (!sourceTaxon || !sourceID) return null;

  return sourceTaxon.references ? (
    <a href={sourceTaxon.references} target="_blank" rel="noopener noreferrer">
      <FormattedMessage id="taxon.referenceTaxon" defaultMessage="Reference Taxon" /> <MdLink />
    </a>
  ) : sourceTaxon.taxonID && sourceTaxon.datasetKey ? (
    <DynamicLink
      pageId="datasetKey"
      variables={{ key: `${sourceTaxon.datasetKey}/taxon/${sourceTaxon.taxonID}` }} // TODO taxonapi link should use taxon instead
    >
      <FormattedMessage id="taxon.referenceTaxon" defaultMessage="Reference Taxon" /> <MdLink />
    </DynamicLink>
  ) : null;
};

export default SourceLink;
