// Docs: https://techdocs.gbif.org/en/openapi/v2/maps

import { stringify } from '@/utils/querystring';
import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';
import { ClientSideOnly } from '@/components/clientSideOnly';

export enum MapTypes {
  DatasetKey = 'datasetKey',
  TaxonKey = 'taxonKey',
  NetworkKey = 'networkKey',
  PublishingOrg = 'publishingOrg',
  PublishingCountry = 'publishingCountry',
}

type PrimarySearch = { type: MapTypes; identifier: string };
type BasemapStyle =
  | 'gbif-classic'
  | 'gbif-light'
  | 'gbif-middle'
  | 'gbif-dark'
  | 'gbif-geyser'
  | 'gbif-tuatara'
  | 'gbif-violet'
  | 'osm-bright'
  | 'gbif-natural';
type OverlayStyle =
  | 'classic.poly'
  | 'classic-noborder.poly'
  | 'purpleYellow.poly'
  | 'purpleYellow-noborder.poly'
  | 'green.poly'
  | 'green-noborder.poly'
  | 'green2.poly'
  | 'green2-noborder.poly'
  | 'iNaturalist.poly'
  | 'purpleWhite.poly'
  | 'red.poly'
  | 'outline.poly';

type Props = PrimarySearch & {
  basemapStyle?: BasemapStyle;
  overlayStyle?: OverlayStyle;
  className?: string;
};

export function MapThumbnail({
  type,
  identifier,
  basemapStyle = 'gbif-middle', // default value for basemapStyle
  overlayStyle = 'classic-noborder.poly', // default value for overlayStyle
  className,
}: Props) {
  const hasMap = useHasMap({ type, identifier });
  if (!hasMap) return false;

  return (
    <div
      dir="ltr"
      className={cn('g-relative g-w-full g-overflow-hidden g-flex-shrink-0', className)}
    >
      <div>
        <img
          className="g-w-1/2 g-inline-block"
          src={`${import.meta.env.PUBLIC_TILE_API}/4326/omt/0/0/0@1x.png?style=${basemapStyle}`}
        />
        <img
          className="g-w-1/2 g-inline-block"
          src={`${import.meta.env.PUBLIC_TILE_API}/4326/omt/0/1/0@1x.png?style=${basemapStyle}`}
        />
      </div>
      <div className="g-absolute g-top-0 g-left-0">
        <img
          className="g-w-1/2 g-inline-block"
          onError={(e: any) => (e.target.style.visibility = 'hidden')}
          src={`${
            import.meta.env.PUBLIC_API_V2
          }/map/occurrence/density/0/0/0@Hx.png?bin=hex&hexPerTile=20&style=${overlayStyle}&srs=EPSG:4326&${type}=${identifier}`}
        />
        <img
          className="g-w-1/2 g-inline-block"
          onError={(e: any) => (e.target.style.visibility = 'hidden')}
          src={`${
            import.meta.env.PUBLIC_API_V2
          }/map/occurrence/density/0/1/0@Hx.png?bin=hex&hexPerTile=20&style=${overlayStyle}&srs=EPSG:4326&${type}=${identifier}`}
        />
      </div>
    </div>
  );
}

export function useHasMap({ type, identifier }: PrimarySearch) {
  const [hasMap, setHasMap] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch(
      `${
        import.meta.env.PUBLIC_API_V2
      }/map/occurrence/density/capabilities.json?${type}=${identifier}`,
      { signal }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.total > 0) {
          setHasMap(true);
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          // ignore cancellation silently
        } else {
          // ignore error silently
        }
      });

    return () => {
      // cancel the request before unmounting
      controller.abort();
    };
  }, [type, identifier]);

  return hasMap;
}

export function AdHocMapThumbnail({
  filter,
  basemapStyle = 'gbif-geyser', // default value for basemapStyle
  // basemapStyle = 'gbif-middle', // default value for basemapStyle
  params,
  className,
}: {
  filter: JSON;
  basemapStyle?: BasemapStyle;
  params?: { [key: string]: string } | null;
  className?: string;
}) {
  const overlayStyleParams = params || {
    mode: 'GEO_CENTROID',
    squareSize: '256',
    style: 'scaled.circles',
  };

  const styleString = stringify(overlayStyleParams);
  const filterString = stringify(filter);

  return (
    <div
      dir="ltr"
      className={cn('g-relative g-w-full g-overflow-hidden g-flex-shrink-0', className)}
    >
      <div>
        <img
          className="g-w-1/2 g-inline-block"
          src={`${import.meta.env.PUBLIC_TILE_API}/4326/omt/0/0/0@1x.png?style=${basemapStyle}`}
        />
        <img
          className="g-w-1/2 g-inline-block"
          src={`${import.meta.env.PUBLIC_TILE_API}/4326/omt/0/1/0@1x.png?style=${basemapStyle}`}
        />
      </div>
      <div className="g-absolute g-top-0 g-left-0 g-right-0 g-bottom-0">
        <ClientSideOnly>
          <img
            className="g-w-1/2 g-inline-block"
            onError={(e: any) => (e.target.style.visibility = 'hidden')}
            src={`${
              import.meta.env.PUBLIC_API_V2
            }/map/occurrence/adhoc/0/0/0@Hx.png?srs=EPSG%3A4326&${styleString}&${filterString}`}
          />
          <img
            className="g-w-1/2 g-inline-block"
            onError={(e: any) => (e.target.style.visibility = 'hidden')}
            src={`${
              import.meta.env.PUBLIC_API_V2
            }/map/occurrence/adhoc/0/1/0@Hx.png?srs=EPSG%3A4326&${styleString}&${filterString}`}
          />
        </ClientSideOnly>
      </div>
    </div>
  );
}
