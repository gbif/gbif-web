import { ClientImage as Image } from '@/components/image';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import {
  Predicate,
  TaxonOccurrenceMediaQuery,
  TaxonOccurrenceMediaQueryVariables,
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
  images?: TaxonOccurrenceMediaQuery;
  total?: number;
}) {
  const [, setPreviewKey] = useEntityDrawer();

  if (total && !images?.results) {
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
        {images?.results
          .filter((r) => !!r?.identifier)
          .map((img) => {
            return (
              <Image
                className="g-cursor-pointer g-m-2"
                key={img?.occurrenceKey}
                src={img?.identifier}
                defaultSize={{ height: 200, width: 200 }}
                wrapperProps={undefined}
                onLoad={undefined}
                onClick={() => setPreviewKey(`o_${img?.occurrenceKey}`)}
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
                <FormattedNumber value={images?.count} />
              </span>
            </div>
          </SimpleTooltip>
        </DynamicLink>
      </Button>
    </div>
  );
}

const TaxonOccurrenceImages = ({ taxonKey, total }: { taxonKey: number; total: number }) => {
  const { data, load } = useQuery<TaxonOccurrenceMediaQuery, TaxonOccurrenceMediaQueryVariables>(
    TAXON_OCCURRENCE_MEDIA,
    {
      lazyLoad: true,
      throwAllErrors: false,
    }
  );
  useEffect(() => {
    if (!taxonKey) return;
    load({
      variables: {
        key: taxonKey as unknown as string,
      },
    });
  }, [taxonKey, load]);

  return (
    <Images taxonKey={taxonKey} total={total} images={data?.taxon?.occurrenceMedia ?? undefined} />
  );
};

export function ImageSkeleton() {
  return (
    <div className="g-animate-pulse g-m-2 g-flex-grow g-inline-flex g-flex-col g-overflow-hidden g-w-72">
      <div className="g-inline-block g-rounded-lg g-bg-slate-900/10 g-overflow-hidden g-h-36"></div>
    </div>
  );
}

export default TaxonOccurrenceImages;

const TAXON_OCCURRENCE_MEDIA = /* GraphQL */ `
  query TaxonOccurrenceMedia($key: ID!) {
    taxon(key: $key) {
      occurrenceMedia(limit: 10, offset: 0) {
        taxonKey
        count
        results {
          occurrenceKey
          identifier
        }
      }
    }
  }
`;
