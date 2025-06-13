import type Map from 'ol/Map';
import { useEffect } from 'react';
import { getBoundingBox } from '../../../openlayers/helpers/getBoundingBox';
import { BoundingBox } from '@/types';

type Args = {
  map?: Map | null;
  setBoundingBox?: (boundingBox: BoundingBox) => void;
};

export function useSyncBoundingBox({ map, setBoundingBox }: Args) {
  useEffect(() => {
    if (!map) return;

    function moveEndHandler() {
      if (!map) return;
      if (!setBoundingBox) return;

      const bbox = getBoundingBox({ map: map });
      setBoundingBox(bbox);
    }

    map.on('moveend', moveEndHandler);

    return () => {
      map.un('moveend', moveEndHandler);
    };
  }, [setBoundingBox, map]);
}
