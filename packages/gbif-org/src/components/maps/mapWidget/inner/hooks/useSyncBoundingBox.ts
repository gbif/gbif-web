import { BoundingBox } from '@/types';
import type Map from 'ol/Map';
import { useEffect } from 'react';
import { getBoundingBox, getCenterAndZoom } from '../../../openlayers/helpers/getBoundingBox';

type Args = {
  map?: Map | null;
  setBoundingBox?: (boundingBox: BoundingBox) => void;
  setView?: (view: { center: [number, number]; zoom: number }) => void;
};

export function useSyncBoundingBox({ map, setBoundingBox, setView }: Args) {
  useEffect(() => {
    if (!map) return;

    function moveEndHandler() {
      if (!map) return;
      if (!setBoundingBox) return;

      const bbox = getBoundingBox({ map: map });
      setBoundingBox(bbox);

      if (setView) {
        const { center, zoom } = getCenterAndZoom({ map });
        setView({ center, zoom });
      }
    }

    map.on('moveend', moveEndHandler);

    return () => {
      map.un('moveend', moveEndHandler);
    };
  }, [setBoundingBox, map]);
}
