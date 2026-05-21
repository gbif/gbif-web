import { OccurrenceGalleryBar } from '@/components/OccurrenceGalleryBar';
import { useMemo } from 'react';

export function Images({
  datasetKey,
  total,
  results,
  className,
}: {
  datasetKey: number | string;
  total: number;
  results: {
    key?: number | string | null;
    stillImages?: Array<{
      __typename?: 'MultimediaItem';
      identifier?: string | null;
    }> | null;
  }[];
  className?: string;
}) {
  const searchParams = useMemo(() => ({ view: 'GALLERY', datasetKey: [datasetKey] }), [datasetKey]);

  const images = useMemo(() => {
    return (results || []).flatMap((result) => ({
      occurrenceKey: '' + result.key,
      thumbor: result?.stillImages?.[0]?.identifier,
    }));
  }, [results]);

  return (
    <OccurrenceGalleryBar
      images={images}
      total={total}
      searchParams={searchParams}
      className={className}
    />
  );
}
