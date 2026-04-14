import { HyperText } from '@/components/hyperText';
import { TaxonKeyQuery } from '@/gql/graphql';

const Citation = ({ taxonInfo }: { taxonInfo: TaxonKeyQuery['taxonInfo'] }) => {
  const taxon = taxonInfo?.taxon;
  return (
    <HyperText
      className="prose-links"
      text={`${taxon?.label || taxon?.scientificName} in ${taxon?.dataset?.citation?.text}`}
    />
  );
};

export default Citation;
