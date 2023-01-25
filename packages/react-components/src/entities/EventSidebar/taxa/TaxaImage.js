import React, { useEffect } from 'react';
import { Image, Skeleton } from '../../../components';
import { useQuery } from '../../../dataManagement/api';

const IMAGE_QUERY = `
query image($key: String) {
  taxonMedia(key: $key) {
    identifier
    type
    subtypeLiteral
    title
    rights
    credit
    providerLiteral
    description
    accessURI
    accessOriginalURI
    format
    pixelXDimension
    pixelYDimension
  }
}
`;

export function TaxaImage({ taxon, onImageLoad }) {
  const { data, load } = useQuery(IMAGE_QUERY, { lazyLoad: true });

  // useEffect hook to load the taxon image
  useEffect(
    () =>
      load({
        keepDataWhileLoading: true,
        variables: { key: taxon.key },
      }),
    [taxon]
  );

  // useEffect hook to hoist the image data into the parent
  // component's state
  useEffect(() => {
    if (data?.taxonMedia.length > 0)
      onImageLoad({
        [taxon.key]: data.taxonMedia,
      });
  }, [data]);

  return (
    <div
      style={{
        position: 'relative',
        width: 90,
        height: 90,
        marginRight: '12px',
      }}
    >
      <Skeleton
        style={{
          position: 'absolute',
          width: 90,
          height: 90,
          marginRight: '12px',
          borderRadius: '4px',
        }}
      />
      {data?.taxonMedia?.length > 0 && (
        <Image
          alt={`Image of ${taxon}`}
          style={{ marginRight: '12px', borderRadius: '4px' }}
          src={data.taxonMedia[0].accessURI}
          width={90}
          height={90}
        />
      )}
    </div>
  );
}
