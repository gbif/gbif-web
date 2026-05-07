import { HyperText } from '@/components/hyperText';
import { SkeletonParagraph } from '@/components/ui/skeleton';
import { TaxonKeyQuery } from '@/gql/graphql';
import { useDatasetCitation } from '@/routes/dataset/key/useDatasetCitation';

const Citation = ({ taxonInfo }: { taxonInfo: NonNullable<TaxonKeyQuery['taxonInfo']> }) => {
  const { citation, loading } = useDatasetCitation(taxonInfo.datasetKey);
  if (loading) {
    return <SkeletonParagraph lines={2} />;
  }
  return (
    <HyperText
      className="[&_a]:g-underline [&_a]:g-text-inherit"
      text={`${taxonInfo?.label || taxonInfo?.scientificName} in ${citation}`}
    />
  );
};

export default Citation;
