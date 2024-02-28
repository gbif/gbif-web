// Docs: https://techdocs.gbif.org/en/openapi/v2/maps

import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';

type Srs = 'EPSG:3857' | 'EPSG:4326' | 'EPSG:3575' | 'EPSG:3031';
type Format = '@1x.png' | '@2x.png' | '@3x.png' | '@4x.png';
type PrimarySearch =
  | { taxonKey: string }
  | { datasetKey: string }
  | { networkKey: string }
  | { publishingOrg: string }
  | { publishingCountry: string };
type TileStyle =
  | 'gbif-classic'
  | 'gbif-light'
  | 'gbif-middle'
  | 'gbif-dark'
  | 'gbif-geyser'
  | 'gbif-tuatara'
  | 'gbif-violet'
  | 'osm-bright'
  | 'gbif-natural';
type MapStyle =
  | 'classic.point'
  | 'classic.poly'
  | 'classic-noborder.poly'
  | 'purpleYellow.point'
  | 'purpleYellow.poly'
  | 'purpleYellow-noborder.poly'
  | 'green.point'
  | 'green.poly'
  | 'green-noborder.poly'
  | 'purpleHeat.point'
  | 'blueHeat.point'
  | 'orangeHeat.point'
  | 'greenHeat.point'
  | 'fire.point'
  | 'glacier.point'
  | 'green2.poly'
  | 'green2-noborder.poly'
  | 'iNaturalist.poly'
  | 'purpleWhite.poly'
  | 'red.poly'
  | 'blue.marker'
  | 'orange.marker'
  | 'outline.poly'
  | 'scaled.circles';
type BinningOptions = { bin: 'hex'; hexPerTile: number } | { bin: 'square'; squareSize: number };

type Props = PrimarySearch &
  BinningOptions & {
    z: number;
    x: number;
    y: number;
    format: Format;
    srs: Srs;
    tileStyle: TileStyle;
    mapStyle: MapStyle;
    className?: string;
  };

export function MapThumbnail(props: Props) {
  const hasMap = useHasMap(props);

  if (!hasMap) return;

  return (
    <div className={cn("relative w-32 flex-shrink-0", props.className)}>
      <img
        className="absolute top-0 left-0 w-32"
        src={createTileUrl({
          ...props,
          style: props.tileStyle,
        })}
        alt="Map background"
      />
      <img
        className="relative w-32"
        src={createMapUrl({
          ...props,
          style: props.mapStyle,
        })}
        alt="Map"
      />
    </div>
  );
}

function useHasMap(options: PrimarySearch) {
  const [hasMap, setHasMap] = useState(false);

  useEffect(() => {
    fetch(createCapabilitiesUrl(options))
      .then((response) => response.json())
      .then((data) => {
        if (data.total > 0) {
          setHasMap(true);
        }
      });
  });

  return hasMap;
}

function createCapabilitiesUrl(options: PrimarySearch) {
  const url = new URL('https://api.gbif.org/v2/map/occurrence/density/capabilities.json');

  if ('taxonKey' in options) url.searchParams.append('taxonKey', options.taxonKey);
  if ('datasetKey' in options) url.searchParams.append('datasetKey', options.datasetKey);
  if ('networkKey' in options) url.searchParams.append('networkKey', options.networkKey);
  if ('publishingOrg' in options) url.searchParams.append('publishingOrg', options.publishingOrg);
  if ('publishingCountry' in options)
    url.searchParams.append('publishingCountry', options.publishingCountry);

  return url.toString();
}

type MapOptions = PrimarySearch &
  BinningOptions & {
    z: number;
    x: number;
    y: number;
    format: Format;
    srs: Srs;
    style: MapStyle;
    // TODO: Do we need more options?
  };

function createMapUrl(options: MapOptions) {
  const url = new URL(
    `https://api.gbif.org/v2/map/occurrence/density/${options.z}/${options.x}/${options.y}${options.format}`
  );

  url.searchParams.append('srs', options.srs);
  url.searchParams.append('style', options.style);
  url.searchParams.append('bin', options.bin);
  if ('hexPerTile' in options) url.searchParams.append('hexPerTile', options.hexPerTile.toString());
  if ('squareSize' in options) url.searchParams.append('squareSize', options.squareSize.toString());

  // Add the primary search parameters
  if ('taxonKey' in options) url.searchParams.append('taxonKey', options.taxonKey);
  if ('datasetKey' in options) url.searchParams.append('datasetKey', options.datasetKey);
  if ('networkKey' in options) url.searchParams.append('networkKey', options.networkKey);
  if ('publishingOrg' in options) url.searchParams.append('publishingOrg', options.publishingOrg);
  if ('publishingCountry' in options)
    url.searchParams.append('publishingCountry', options.publishingCountry);

  return url.toString();
}

type TileOptions = {
  z: number;
  x: number;
  y: number;
  format: Format;
  srs: Srs;
  style: TileStyle;
};

function createTileUrl(options: TileOptions) {
  // The tile api only uses the number from the srs
  const tileSrs = options.srs.split(':')[1];

  const url = new URL(
    `https://tile.gbif.org/${tileSrs}/omt/${options.z}/${options.x}/${options.y}${options.format}`
  );

  url.searchParams.append('style', options.style);

  return url.toString();
}
