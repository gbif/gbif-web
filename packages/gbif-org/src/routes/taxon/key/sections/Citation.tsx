import { HyperText } from '@/components/hyperText';
import TestSiteAlert from '@/components/TestSiteAlert';
import { SkeletonParagraph } from '@/components/ui/skeleton';
import { TaxonKeyQuery } from '@/gql/graphql';
import { useDatasetCitation } from '@/routes/dataset/key/useDatasetCitation';
const testSite = import.meta.env.PUBLIC_TEST_SITE === 'true';

const Citation = ({ taxonInfo }: { taxonInfo: NonNullable<TaxonKeyQuery['taxonInfo']> }) => {
  const { citation, loading } = useDatasetCitation(taxonInfo.datasetKey);
  if (loading) {
    return <SkeletonParagraph lines={2} />;
  }
  return (
    <div className={testSite ? 'g-select-none g-pointer-events-none' : ''}>
      <TestSiteAlert className="g-mb-4 g-text-site-dir-start" />
      <HyperText
        dir="auto"
        className="[&_a]:g-underline [&_a]:g-text-inherit g-text-site-dir-start"
        text={`${taxonInfo?.label || taxonInfo?.scientificName} in ${citation}`}
      />
    </div>
  );
};

export default Citation;
