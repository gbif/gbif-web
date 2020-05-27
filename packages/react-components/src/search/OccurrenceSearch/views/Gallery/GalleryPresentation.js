import React from 'react';
import get from 'lodash/get';
import { Gallery, GalleryCaption } from '../../../../components';

export const GalleryPresentation = ({ first, prev, next, size, from, result, loading, error }) => {
  const total = get(result, 'hits.total', 0);
  const hits = get(result, 'hits.hits');
  if (!hits) return <div>no content</div>
  const itemsLeft = total ? total - from : 20;
  const loaderCount = Math.min(Math.max(itemsLeft, 0), size);

  return <Gallery
    caption={({ item }) => <GalleryCaption>
      {item.gbifClassification.usage.name}
    </GalleryCaption>}
    title={item => item.gbifClassification.usage.name}
    subtitle={item => item.description}
    details={item => <pre>{JSON.stringify(item, null, 2)}</pre>}
    loading={loading || error}
    items={hits}
    loadMore={from + size < total ? () => next() : null}
    size={loaderCount}
    imageSrc={item => item._galleryImages[0].identifier}
  />
}
