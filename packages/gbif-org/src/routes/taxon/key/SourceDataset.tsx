import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';
const SourceDataset = ({ taxon }) => {
  return taxon?.sourceTaxon?.dataset?.title && taxon?.sourceTaxon?.datasetKey ? (
    <>
      <FormattedMessage id="taxon.source" defaultMessage="Source" />
      {': '}
      <DynamicLink
        className="hover:g-underline g-text-primary-500"
        pageId="datasetKey"
        variables={{ key: taxon?.sourceTaxon?.datasetKey }}
      >
        {taxon?.sourceTaxon?.dataset?.title}
      </DynamicLink>
    </>
  ) : null;
};

export default SourceDataset;
