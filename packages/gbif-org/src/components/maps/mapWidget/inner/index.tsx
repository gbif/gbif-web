import { Progress } from '@/components/ui/progress';
import { Projection } from '@/config/config';
import { BoundingBox, Setter } from '@/types';
import { cn } from '@/utils/shadcn';
import Map from 'ol/Map';
import { useId, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineZoomOutMap, MdZoomInMap } from 'react-icons/md';
import { RiSubtractFill } from 'react-icons/ri';
import { MapMenuButton } from '../../mapMenuButton';
import { projections } from '../../openlayers/projections';
import { Params, RasterStyles } from '../options';
import { useRasterBaseLayer } from './hooks/useRasterBaseLayer';
import { useRasterOccurrenceLayers } from './hooks/useRasterOccurrenceLayers';
import { useSearchAreaClick } from './hooks/useSearchAreaClick';
import { useSetupMap } from './hooks/useSetupMap';
import { useSyncBoundingBox } from './hooks/useSyncBoundingBox';
import { useTileLoadingFeedback } from './hooks/useTileLoadingFeedback';
import { useZoomInteraction } from './hooks/useZoomInteraction';

type Props = {
  className?: string;
  selectedProjection: Projection;
  setBoundingBox?: Setter<BoundingBox | undefined>;
  onSearchAreaClick?: (geometryFilter: string) => void;
  enabledSearchAreaClick?: boolean;
  rasterStyles: RasterStyles;
  filterParams: Params;
  generatedAt?: string;
  isFullSize: boolean;
  toggleFullScreen: () => void;
};

export default function MapWidgetInner({
  className,
  selectedProjection,
  setBoundingBox,
  onSearchAreaClick,
  enabledSearchAreaClick = false,
  rasterStyles,
  filterParams,
  generatedAt,
  isFullSize,
  toggleFullScreen,
}: Props) {
  const mapId = useId();
  const [map, setMap] = useState<Map>();

  const projection = projections[selectedProjection];

  // Will setup the map and the interactions
  useSetupMap({
    mapId,
    setMap,
  });

  // Will setup the zoom interaction and update it when full screen mode changes
  useZoomInteraction({
    map,
    isFullScreen: isFullSize,
  });

  // Will render and re-render the base layer when relevant args change
  useRasterBaseLayer({
    map,
    projection,
    baseLayerStyle: rasterStyles.baseMapStyle,
    generatedAt,
  });

  const { hideLoadingProgress, progressHandler, loadingProgress } = useTileLoadingFeedback();

  // Will render and re-render the occurrence layers when relevant args change
  useRasterOccurrenceLayers({
    map,
    filterParams,
    styleParams: rasterStyles.params,
    projection,
    progressHandler,
  });

  // Will listen for click events on the map (if enabledSearchAreaClick) and pass the clicked area to the onSearchAreaClick callback
  useSearchAreaClick({
    map,
    onSearchAreaClick,
    enabledSearchAreaClick,
    getProjectedCoordinate: projection.getProjectedCoordinate,
  });

  // Will update the geometry filter when the map is moved
  useSyncBoundingBox({
    map,
    setBoundingBox,
  });

  return (
    <div className={cn('g-relative', className)}>
      <div className="g-size-full" id={mapId} />
      <Progress
        value={loadingProgress}
        className={cn('g-rounded-none g-absolute g-bottom-0 g-left-0 g-w-full g-h-1', {
          'g-hidden': hideLoadingProgress,
        })}
      />
      <div className="g-flex g-absolute g-bg-white g-z-10 g-border g-m-2 g-top-0 g-end-0 g-items-center">
        <MapMenuButton
          className="g-h-8 g-w-8"
          onClick={() => {
            const currentZoom = map?.getView().getZoom();
            if (currentZoom) {
              map?.getView().setZoom(currentZoom + 1);
            }
          }}
        >
          <IoMdAdd />
        </MapMenuButton>
        <MapMenuButton
          className="g-h-8 g-w-8"
          onClick={() => {
            const currentZoom = map?.getView().getZoom();
            if (currentZoom) {
              map?.getView().setZoom(currentZoom - 1);
            }
          }}
        >
          <RiSubtractFill />
        </MapMenuButton>

        <MapMenuButton className="g-h-8 g-w-8" onClick={() => toggleFullScreen()}>
          {isFullSize ? <MdZoomInMap /> : <MdOutlineZoomOutMap />}
        </MapMenuButton>
      </div>
    </div>
  );
}
