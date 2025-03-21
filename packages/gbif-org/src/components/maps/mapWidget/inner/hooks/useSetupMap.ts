import Map from 'ol/Map';
import { defaults as defaultInteractions } from 'ol/interaction/defaults';
import AttributionControl from 'ol/control/Attribution';
import { useEffect } from 'react';
import { Setter } from '@/types';

type Args = {
  mapId: string;
  setMap: Setter<Map | undefined>;
};

export function useSetupMap({ mapId, setMap }: Args) {
  // Setup the map when the component is mounted
  useEffect(() => {
    const target = document.getElementById(mapId);
    if (!target) return;

    const map = new Map({
      target: target,
      interactions: defaultInteractions({
        // Disable rotation of the map
        altShiftDragRotate: false,
        pinchRotate: false,
        // We use a custom instance of MouseWheelZoom that does not zoom when scrolling by the map.
        mouseWheelZoom: false,
      }),
      controls: [new AttributionControl()],
    });

    setMap(map);

    return () => {
      map.dispose();
    };
  }, [setMap, mapId]);
}
