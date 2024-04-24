import React from 'react';
import { useOnMountUnsafe } from '@/hooks/useOnMountUnsafe';
import { Feature, Map as OpenLayersMap, View } from 'ol';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Marker from './marker.svg';
import { Button } from '../ui/button';

// This is not a React hook.
// eslint-disable-next-line
useGeographic();

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
          source: new OSM(),
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
      setCoordinates({ lat, lon });
    });
  });

  // Add or update the marker on the map.
  React.useEffect(() => {
    if (!mapRef.current || !coordinates) {
      return;
    }

    const layer = new VectorLayer({
      source: new VectorSource({
        features: [new Feature(new Point([coordinates.lon, coordinates.lat]))],
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
    <div className="w-full h-96 relative">
      <div className="w-full h-full" ref={mapElementRef}></div>
      <div className="absolute right-2 top-2">
        {coordinates ? (
          <Button variant="destructive" onClick={() => setCoordinates(null)}>
            Clear
          </Button>
        ) : (
          <span className="p-2 bg-white/70 rounded shadow-md block text-sm font-semibold">
            {instructions}
          </span>
        )}
      </div>
    </div>
  );
}
