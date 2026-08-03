import { HyperText } from '@/components/hyperText';
import TestSiteAlert from '@/components/TestSiteAlert';
import { SkeletonParagraph } from '@/components/ui/skeleton';
import { TaxonKeyQuery } from '@/gql/graphql';
import { useDatasetCitation } from '@/routes/dataset/key/useDatasetCitation';
import { ErrorMessage } from '@/components/errorMessage';

const testSite = import.meta.env.PUBLIC_TEST_SITE === 'true';

const Citation = ({ taxonInfo }: { taxonInfo: NonNullable<TaxonKeyQuery['taxonInfo']> }) => {
  if (taxonInfo?.datasetKey) {
    return <CitationContent taxonInfo={taxonInfo} />;
  }
  return null;
};

const CitationContent = ({ taxonInfo }: { taxonInfo: NonNullable<TaxonKeyQuery['taxonInfo']> }) => {
  const { citation, loading, error } = useDatasetCitation(taxonInfo.datasetKey);
  if (loading || (!citation && !error)) {
    return <SkeletonParagraph lines={2} />;
  }
  if (error) {
    return <ErrorMessage>Error loading citation</ErrorMessage>;
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
