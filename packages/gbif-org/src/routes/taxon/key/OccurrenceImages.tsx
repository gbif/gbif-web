import { ClientImage as Image } from '@/components/image';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import {
  OccurrenceSearchResult,
  Predicate,
  TaxonOccurrenceImagesQuery,
  TaxonOccurrenceImagesQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEntityDrawer } from '@/routes/occurrence/search/views/browseList/useEntityDrawer';
import { cn } from '@/utils/shadcn';
import { useEffect } from 'react';
import { MdImage } from 'react-icons/md';
import { FormattedNumber } from 'react-intl';
import styles from '../../dataset/key/about/images.module.css';
import { imagePredicate } from './taxonUtil';

export function Images({
  taxonKey,
  className = '',
  images,
  total,
  ...props
}: {
  taxonKey: number;
  className?: string;
  images?: OccurrenceSearchResult;
  total?: number;
}) {
  const [, setPreviewKey] = useEntityDrawer();

  if (total && !images?.documents?.total) {
    return (
      <div className="g-inline-flex g-overflow-hidden">
        {Array.from({ length: Math.min(total, 2) }).map((x, i) => (
          <ImageSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className={cn(`galleryBar ${styles.galleryBar}`, className)} {...props}>
      <div>
        {images?.documents.results
          .filter((r) => !!r?.stillImages?.[0]?.identifier)
          .map((occurrence) => {
            return (
              <Image
                className="g-cursor-pointer g-m-2"
                key={occurrence?.key}
                src={occurrence?.stillImages?.[0]?.identifier}
                defaultSize={{ height: 200, width: 200 }}
                wrapperProps={undefined}
                onLoad={undefined}
                onClick={() => setPreviewKey(`o_${occurrence?.key}`)}
              />
            );
          })}
      </div>

      <Button asChild>
        <DynamicLink pageId="occurrenceSearch" searchParams={{ view: 'GALLERY', taxonKey }}>
          <SimpleTooltip title={<span>Records with images</span>}>
            <div className="g-flex g-place-items-center">
              <MdImage style={{ marginRight: 8 }} />{' '}
              <span>
                <FormattedNumber value={images?.documents?.total} />
              </span>
            </div>
          </SimpleTooltip>
        </DynamicLink>
      </Button>
    </div>
  );
}

const TaxonOccurrenceImages = ({ taxonKey, total }: { taxonKey: number; total: number }) => {
  const { data, load } = useQuery<TaxonOccurrenceImagesQuery, TaxonOccurrenceImagesQueryVariables>(
    TAXON_INSIGHTS,
    {
      lazyLoad: true,
      throwAllErrors: false,
    }
  );
  useEffect(() => {
    if (!taxonKey) return;
    load({
      variables: {
        imagePredicate: imagePredicate(taxonKey) as Predicate,
      },
    });
  }, [taxonKey, load]);

  return <Images taxonKey={taxonKey} total={total} images={data?.images ?? undefined} />;
};

export function ImageSkeleton() {
  return (
    <div className="g-animate-pulse g-m-2 g-flex-grow g-inline-flex g-flex-col g-overflow-hidden g-w-72">
      <div className="g-inline-block g-rounded-lg g-bg-slate-900/10 g-overflow-hidden g-h-36"></div>
    </div>
  );
}

export default TaxonOccurrenceImages;

const TAXON_INSIGHTS = /* GraphQL */ `
  query TaxonOccurrenceImages($imagePredicate: Predicate) {
    images: occurrenceSearch(predicate: $imagePredicate) {
      documents(size: 25) {
        total
        results {
          key
          stillImages {
            identifier: thumbor(height: 400)
          }
        }
      }
    }
  }
`;
