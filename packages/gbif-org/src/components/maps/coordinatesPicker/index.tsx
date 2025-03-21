import { useOnMountUnsafe } from '@/hooks/useOnMountUnsafe';
import { Feature, Map as OpenLayersMap, View } from 'ol';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { transform } from 'ol/proj';
import { Vector as VectorSource, XYZ } from 'ol/source';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import React from 'react';
import { Button } from '@/components/ui/button';
import Marker from './marker.svg';

type Coordinates = {
  lat: number;
  lon: number;
};

type Props = {
  coordinates?: Coordinates | null;
  setCoordinates: (coordinates?: Coordinates | null) => void;
  instructions?: string;
};

export function CoordinatesPicker({
  coordinates,
  setCoordinates,
  instructions = 'Click on the map to select coordinates',
}: Props) {
  const mapElementRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<OpenLayersMap | null>(null);

  // Initialize the map on mount.
  useOnMountUnsafe(() => {
    let place: [number, number] = [0, 0];
    if (coordinates) {
      place = [coordinates.lat, coordinates.lon];
    }

    mapRef.current = new OpenLayersMap({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `${
              import.meta.env.PUBLIC_TILE_API
            }/3857/omt/{z}/{x}/{y}@1x.png?style=osm-bright-en&srs=EPSG%3A3857`,
          }),
        }),
      ],
      target: mapElementRef.current ?? undefined,
      view: new View({
        center: place,
        zoom: 2,
      }),
    });

    mapRef.current.on('singleclick', (event) => {
      const [lon, lat] = event.coordinate;
      const wgsCoordinates = transform([lon, lat], 'EPSG:3857', 'EPSG:4326');
      setCoordinates({ lat: wgsCoordinates[1], lon: wgsCoordinates[0] });
    });
  });

  // Add or update the marker on the map.
  React.useEffect(() => {
    if (!mapRef.current || !coordinates) {
      return;
    }

    const mercatorCoordinates = transform(
      [coordinates.lon, coordinates.lat],
      'EPSG:4326',
      'EPSG:3857'
    );

    const layer = new VectorLayer({
      source: new VectorSource({
        features: [new Feature(new Point([mercatorCoordinates[0], mercatorCoordinates[1]]))],
      }),
      style: new Style({
        image: new Icon({
          src: Marker,
          anchor: [0.5, 1.04], // Centers the icon
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          scale: 2, // Adjust scale as needed
        }),
      }),
    });

    mapRef.current.addLayer(layer);

    return () => {
      mapRef.current?.removeLayer(layer);
    };
  }, [coordinates]);

  return (
    <div className="g-w-full g-h-96 g-relative">
      <div className="g-w-full g-h-full" ref={mapElementRef}></div>
      <div className="g-absolute g-right-2 g-top-2">
        {coordinates ? (
          <Button variant="destructive" onClick={() => setCoordinates(null)}>
            Clear
          </Button>
        ) : (
          <span className="g-p-2 g-bg-white/70 g-rounded g-shadow-md g-block g-text-sm g-font-semibold">
            {instructions}
          </span>
        )}
      </div>
    </div>
  );
}
