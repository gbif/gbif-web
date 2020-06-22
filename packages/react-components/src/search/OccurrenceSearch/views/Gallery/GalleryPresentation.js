import React from 'react';
import get from 'lodash/get';
import { Gallery, GalleryCaption } from '../../../../components';

export const GalleryPresentation = ({ first, prev, next, size, from, data, total, loading, error }) => {
  console.log(data);
// return <pre>{JSON.stringify(data, null, 2)}</pre>
  const results = data;
  if (total === 0) return <div>
    <h2>No content</h2>
    {error && <p>Backend failure</p>}
  </div>
  const itemsLeft = total ? total - from : 20;
  const loaderCount = Math.min(Math.max(itemsLeft, 0), size);

  if (loading && !total) {
    return <h2>Loading</h2>
  }

  if (error && !total) {
    return <h2>Error</h2>
  }
  return <Gallery
    caption={({ item }) => <GalleryCaption>
      <span dangerouslySetInnerHTML={{__html: item.gbifClassification.acceptedUsage.formattedName}}></span>
    </GalleryCaption>}
    title={item => <span dangerouslySetInnerHTML={{__html: item.gbifClassification.acceptedUsage.formattedName}}></span>}
    subtitle={item => item.description}
    details={item => <pre>{JSON.stringify(item, null, 2)}</pre>}
    loading={loading || error}
    items={results}
    loadMore={from + size < total ? () => next() : null}
    size={loaderCount}
    imageSrc={item => item.primaryImage.identifier}
  />
}
