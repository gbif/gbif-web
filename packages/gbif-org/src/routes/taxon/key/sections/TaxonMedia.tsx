import { TaxonKeyQuery } from '@/gql/graphql';

type MediaItem = NonNullable<NonNullable<TaxonKeyQuery['taxonInfo']>['media']>[number];

function MediaThumbnail({ item }: { item: MediaItem }) {
  if (!item.identifier) return null;

  const image = (
    <div className="g-flex g-flex-col g-gap-1">
      <div className="g-overflow-hidden g-rounded g-bg-neutral-100 g-aspect-square g-flex g-items-center g-justify-center">
        <img
          src={item.identifier}
          alt={item.title ?? ''}
          className="g-object-cover g-w-full g-h-full"
          loading="lazy"
        />
      </div>
      {(item.title || item.creator || item.license) && (
        <div className="g-text-xs g-text-slate-600 g-leading-snug">
          {item.title && <div className="g-font-medium g-truncate">{item.title}</div>}
          {item.creator && <div className="g-truncate">{item.creator}</div>}
          {item.license && <div className="g-truncate g-text-slate-400">{item.license}</div>}
        </div>
      )}
    </div>
  );

  if (item.references) {
    return (
      <a href={item.references} target="_blank" rel="noopener noreferrer">
        {image}
      </a>
    );
  }

  return image;
}

export function TaxonMedia({ media }: { media: NonNullable<TaxonKeyQuery['taxonInfo']>['media'] }) {
  if (!media || media.length === 0) return null;

  return (
    <div className="g-grid g-grid-cols-2 sm:g-grid-cols-3 md:g-grid-cols-4 g-gap-3">
      {media.map((item, index) => (
        <MediaThumbnail key={item.identifier ?? index} item={item} />
      ))}
    </div>
  );
}
