import { DynamicLink } from '@/reactRouterPlugins';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
const SourceLink = ({ taxon }) => {
  return taxon?.sourceTaxon?.references ? (
    <a href={taxon?.sourceTaxon?.references} target="_blank" rel="noopener noreferrer">
      <FormattedMessage id="taxon.referenceTaxon" defaultMessage="Reference Taxon" /> <MdLink />
    </a>
  ) : taxon?.sourceTaxon?.key && taxon?.sourceTaxon?.datasetKey ? (
    <DynamicLink
      pageId="datasetKey"
      variables={{ key: `${taxon?.sourceTaxon?.datasetKey}/species/${taxon?.sourceTaxon?.key}` }}
    >
      <FormattedMessage id="taxon.referenceTaxon" defaultMessage="Reference Taxon" /> <MdLink />
    </DynamicLink>
  ) : null;
};

export default SourceLink;
