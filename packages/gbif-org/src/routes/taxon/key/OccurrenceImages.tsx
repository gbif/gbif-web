import { ClientImage as Image } from '@/components/image';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import { TaxonInsightsQuery, TaxonInsightsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { useEffect } from 'react';
import { MdImage } from 'react-icons/md';
import { FormattedNumber } from 'react-intl';
import styles from '../../dataset/key/about/images.module.css';

export function Images({ taxonKey, className, images = [], ...props }) {
  if (!(images?.documents?.total > 0)) return null;
  return (
    <div className={cn(`galleryBar ${styles.galleryBar}`, className)} {...props}>
      <div>
        {images.documents.results.map((occurrence) => {
          return (
            <Image
              key={occurrence.key}
              src={occurrence.stillImages[0].identifier}
              defaultSize={{ height: 200, width: 200 }}
            />
          );
        })}
      </div>

      <Button asChild>
        <DynamicLink pageId="occurrenceSearch" searchParams={{ view: 'GALLERY', taxonKey }}>
          <SimpleTooltip title={<span>Records with images</span>} placement="auto">
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

const TaxonOccurrenceImages = ({ taxonKey }: { taxonKey: number }) => {
  const { data, error, load } = useQuery<TaxonInsightsQuery, TaxonInsightsQueryVariables>(
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
        imagePredicate: {
          type: 'and',
          predicates: [
            {
              type: 'equals',
              key: 'taxonKey',
              value: taxonKey,
            },
            {
              type: 'equals',
              key: 'mediaType',
              value: 'StillImage',
            },
          ],
        },
      },
    });
  }, [taxonKey, load]);

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Images
      taxonKey={taxonKey}
      images={{
        ...data?.images,
        documents: {
          ...data?.images?.documents,
          results: data?.images?.documents.results.filter((r) => !!r?.stillImages?.[0]?.identifier),
        },
      }}
    />
  );
};

export default TaxonOccurrenceImages;

const TAXON_INSIGHTS = /* GraphQL */ `
  query TaxonInsights($imagePredicate: Predicate) {
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
