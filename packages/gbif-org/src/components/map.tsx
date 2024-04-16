import React from 'react';
import { Feature, Map as OpenLayersMap, View } from 'ol';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import { useOnMountUnsafe } from '@/hooks/useOnMountUnsafe';

useGeographic();

type Props = {
  coordinates: {
    lat: number;
    lon: number;
  };
};

export default function Map({ coordinates }: Props) {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useOnMountUnsafe(() => {
    const place = [coordinates.lon, coordinates.lat];

    new OpenLayersMap({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [new Feature(new Point(place))],
          }),
          style: {
            'circle-radius': 9,
            'circle-fill-color': 'green',
          },
        }),
      ],
      target: mapRef.current ?? undefined,
      view: new View({
        center: place,
        zoom: 4,
      }),
    });
  });

  return <div style={{ width: 500, height: 500 }} ref={mapRef}></div>;
}
