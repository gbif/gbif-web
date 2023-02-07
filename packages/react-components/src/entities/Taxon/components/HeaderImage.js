import { useState, useEffect } from 'react';
import { Skeleton, Image } from '../../../components';
import { useQuery } from '../../../dataManagement/api';

const QUERY_TAXON_MEIDA = `
query image($guid: String) {
  taxonMedia(key: $guid, size: 1) {
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

function HeaderImage({ width, height, guid, radius = 0 }) {
  const { data, error, loading, load } = useQuery(QUERY_TAXON_MEIDA, {
    lazyLoad: true,
  });

  useEffect(
    () =>
      load({
        variables: { guid },
      }),
    [guid]
  );

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
      }}
    >
      <Skeleton
        style={{
          position: 'absolute',
          width,
          height,
          borderRadius: radius,
        }}
      />
      {data?.taxonMedia[0]?.accessURI && (
        <img
          src={data.taxonMedia[0].accessURI}
          style={{ width, height, borderRadius: radius, objectFit: 'contain' }}
        />
      )}
    </div>
  );
}

export default HeaderImage;
