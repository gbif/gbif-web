import { ProjectionHelpers } from '@/components/maps/openlayers/projections';
import type Map from 'ol/Map';
import { useEffect } from 'react';
import { ProgressHandler } from './useTileLoadingFeedback';
import { Params } from '../../options';

type Args = {
  map?: Map | null;
  styleParams: Params[];
  filterParams: Params;
  projection: ProjectionHelpers;
  progressHandler: ProgressHandler;
};

export function useRasterOccurrenceLayers({
  map,
  progressHandler,
  projection,
  styleParams,
  filterParams,
}: Args) {
  // Update the map when the selected projection or params changes
  useEffect(() => {
    if (!map) return;

    const layersToRemove = map
      .getLayers()
      .getArray()
      .filter((layer) => layer != null && layer.get('name') !== 'baseLayer');
    layersToRemove.forEach((layer) => map.removeLayer(layer));

    for (let i = 0; i < (styleParams.length || 1); i++) {
      map.addLayer(
        projection.getOccurrenceRasterLayer({
          ...(styleParams[i] ?? {}),
          ...filterParams,
          progress: progressHandler,
        })
      );
    }
  }, [projection, styleParams, progressHandler, map, filterParams]);
}
