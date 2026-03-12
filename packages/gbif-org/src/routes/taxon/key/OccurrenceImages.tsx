import { OccurrenceGalleryBar } from '@/components/OccurrenceGalleryBar';
import { useMemo } from 'react';

const TaxonOccurrenceImages = ({
  taxonKey,
  total,
  results,
}: {
  taxonKey: number | string;
  total: number;
  results: {
    occurrenceKey: string;
    identifier?: string | null;
    thumbor?: string | null;
  }[];
}) => {
  const searchParams = useMemo(() => ({ view: 'GALLERY', taxonKey: [taxonKey] }), [taxonKey]);
  return <OccurrenceGalleryBar images={results} total={total} searchParams={searchParams} />;
};

export default TaxonOccurrenceImages;
