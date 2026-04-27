import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Img } from '@/components/Img';
import { TaxonKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { MdImage } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { MediaGallery, MediaGalleryItem } from '@/routes/occurrence/media/MediaGallery';

type Taxon = NonNullable<NonNullable<TaxonKeyQuery['taxonInfo']>['taxon']>;
type Props = { taxon: Taxon };

function OccurrenceMediaGalleryContent({ taxon }: Props) {
  const results = taxon.occurrenceMedia?.results ?? [];
  const total = taxon.occurrenceMedia?.count ?? 0;
  const taxonKey = taxon.taxonID;

  if (results.length === 0) return null;

  const gallerySearchParams = { view: 'GALLERY', taxonKey: [taxonKey] };
  const isMultiple = results.length > 1;

  const multiStyle = {
    maxWidth: '100%',
    height: '100%',
    maxHeight: 400,
    display: 'block',
    objectFit: 'contain' as const,
  };
  const singleStyle = {
    maxWidth: '100%',
    maxHeight: 400,
    display: 'block',
    margin: 'auto',
    minHeight: 50,
  };

  const items: MediaGalleryItem[] = results.map((item) => ({
    id: `${item.occurrenceKey}-${item.identifier}`,
    content: (
      <DynamicLink
        pageId="occurrenceSearch"
        searchParams={{ ...gallerySearchParams, entity: `o_${item.occurrenceKey}` }}
        className="g-flex g-items-center g-justify-center g-w-full g-h-full"
      >
        <Img
          src={item.thumbor ?? item.identifier ?? ''}
          style={isMultiple ? multiStyle : singleStyle}
          failedClassName="g-w-full g-h-24"
        />
      </DynamicLink>
    ),
    thumbnail: (
      <img
        src={item.smallThumbnail ?? item.identifier ?? ''}
        alt=""
        className="g-w-full g-h-full g-object-cover"
        loading="lazy"
      />
    ),
    thumbnailAriaLabel: `Image`,
    info:
      item.rightsHolder || item.license ? (
        <>
          {item.rightsHolder && (
            <p>
              <span className="g-opacity-70">
                <FormattedMessage id="occurrenceFieldNames.rightsHolder" />:{' '}
              </span>
              {item.rightsHolder}
            </p>
          )}
          {item.license && (
            <p>
              <span className="g-opacity-70">
                <FormattedMessage id="occurrenceFieldNames.license" />:{' '}
              </span>
              {item.license}
            </p>
          )}
        </>
      ) : undefined,
  }));

  return (
    <MediaGallery
      items={items}
      id="occurrence-images"
      renderBottomRight={
        total > 0
          ? () => (
              <DynamicLink
                pageId="occurrenceSearch"
                searchParams={gallerySearchParams}
                className="g-absolute g-bottom-2 g-end-2 g-bg-neutral-800/70 g-text-white g-text-xs g-rounded g-px-2 g-py-0.5"
              >
                <MdImage size={12} /> <FormattedMessage id="phrases.viewAllImages" />
              </DynamicLink>
            )
          : undefined
      }
    />
  );
}

export default function OccurrenceMediaGalleryCard({ taxon }: Props) {
  return (
    <ErrorBoundary
      type="BLOCK"
      errorMessage={<FormattedMessage id="taxon.errors.occurrenceImages" />}
    >
      <OccurrenceMediaGalleryContent taxon={taxon} />
    </ErrorBoundary>
  );
}
