import { useEffect } from 'react';
import Map from 'ol/Map';
import { Extent } from 'ol/extent';

type Args = {
  map?: Map;
  capabilities?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
};

export function useInitialZoom({ map, capabilities }: Args) {
  useEffect(() => {
    if (!map || !capabilities) return;

    const extent: Extent = [
      capabilities.minLng,
      capabilities.minLat,
      capabilities.maxLng,
      capabilities.maxLat,
    ];

    map.getView().fit(extent);
  }, [map, capabilities]);
}
