import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import {
  MdOutlineFullscreen as ExploreAreaIcon,
  MdLanguage,
  MdMyLocation,
  MdOutlineLayers,
  MdZoomIn,
  MdZoomOut,
  MdDeleteOutline,
} from 'react-icons/md';
import { PiPolygonFill as DrawIcon } from 'react-icons/pi';
import { BsLightningFill } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { MapMenuButton as MenuButton } from '@/components/maps/mapMenuButton';
import { SimpleTooltip } from '@/components/simpleTooltip';
import StripeLoader from '@/components/stripeLoader';
import { useToast } from '@/components/ui/use-toast';
import { ModifyPolygonIcon } from '@/components/icons/icons';
import { useConfig } from '@/config/config';
import { boundingBoxToWKT } from '@/utils/boundingBoxToWKT';
import { pixelRatio } from '@/utils/pixelRatio';
import { cn } from '@/utils/shadcn';
import { useI18n } from '@/reactRouterPlugins';
import MapComponentML from './MapLibreMap';
import MapComponentOL from './OpenlayersMap';
import { getMapStyles, MapStyleConfig } from './standardMapStyles';
import { OccurrenceOverlay, MapEvent, PointClickData } from './types';
import { OccurrenceSearchMetadata } from '@/contexts/search';
import { ProjectionName } from './types';

const MAP_STYLES = `${import.meta.env.PUBLIC_WEB_UTILS}/map-styles`;
const hasGeoLocation = 'geolocation' in navigator;

type LayerOptions = Partial<Record<ProjectionName, string[]>>;
type BasemapOptions = Partial<Record<ProjectionName, MapStyleConfig>>;
type StyleLookup = Partial<Record<ProjectionName, Record<string, string>>>;

const defaultLayerOptions: LayerOptions = {
  MERCATOR: ['BRIGHT', 'NATURAL'],
};

export interface AdHocMapProps {
  overlays?: OccurrenceOverlay[];
  loading?: boolean;
  total?: number;
  registerPredicate?: () => void;
  loadPointData?: (data: PointClickData) => void;
  defaultMapSettings?: OccurrenceSearchMetadata['mapSettings'];
  style?: React.CSSProperties;
  className?: string;
  features?: string[];
  onFeaturesChange?: (params: { features: string[] }) => void;
  showList: (show: boolean) => void;
  tools:
    | boolean
    | {
        draw: boolean;
        projection: boolean;
        layer: boolean;
        location: boolean;
        zoom: boolean;
      };
}

function getStyle({
  styles = {},
  projection,
  type,
  lookup = {},
  layerOptions,
}: {
  styles: BasemapOptions;
  projection: ProjectionName;
  type: string;
  lookup: StyleLookup;
  layerOptions?: LayerOptions;
}): MapStyleConfig | undefined {
  const fallbackStyleName = `${layerOptions?.[projection]?.[0]}_${projection}`;
  const styleKey = lookup?.[projection]?.[type] || `${type}_${projection}`;
  const style = styles[styleKey] ? styles[styleKey] : styles[fallbackStyleName];
  return style;
}

export default function AdHocMap({
  overlays = [],
  registerPredicate,
  loadPointData,
  defaultMapSettings,
  style,
  className,
  features,
  onFeaturesChange,
  showList,
  tools,
}: AdHocMapProps) {
  const { formatMessage } = useIntl();
  const config = useConfig();
  const { locale } = useI18n();
  const userLocationEnabled = config?.occurrenceSearch?.mapSettings?.userLocationEnabled;
  const styleLookup = (config?.maps?.styleLookup || {}) as StyleLookup;
  const mapStyles = config?.maps?.mapStyles?.options || defaultLayerOptions;
  const supportedProjections = Object.keys(mapStyles) as ProjectionName[];
  const [projectionOptions] = useState<ProjectionName[]>(supportedProjections);

  let defaultProjection =
    (sessionStorage.getItem('defaultOccurrenceProjection') as ProjectionName) ||
    config?.maps?.mapStyles?.defaultProjection ||
    supportedProjections[0];
  if (!supportedProjections.includes(defaultProjection)) {
    defaultProjection = supportedProjections[0];
  }
  const [projection, setProjection] = useState<ProjectionName>(defaultProjection);

  let defaultStyle =
    sessionStorage.getItem('defaultOccurrenceLayer') ||
    config?.maps?.mapStyles?.defaultMapStyle ||
    'BRIGHT';
  if (!mapStyles?.[defaultProjection]?.includes(defaultStyle)) {
    defaultStyle = mapStyles?.[defaultProjection]?.[0] ?? 'BRIGHT';
  }

  const [layerOptions] = useState<LayerOptions>(mapStyles);
  const [layerId, setLayerId] = useState<string>(defaultStyle);
  const [latestEvent, broadcastEvent] = useState<MapEvent | undefined>();
  const [searchingLocation, setLocationSearch] = useState<boolean>(false);
  const [basemapOptions, setBasemapOptions] = useState<BasemapOptions | undefined>();
  const [drawingTool, setDrawingTool] = useState<string | null>(null);
  const { toast } = useToast();
  const [mapLoading, setMapLoading] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateLoading = useCallback((loading: boolean) => {
    setMapLoading(loading);
  }, []);

  const failedTileHandler = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Show the div
    setShowErrorMessage(true);

    // Set a new timeout to hide it after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setShowErrorMessage(false);
    }, 3000);
  }, []);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const { width, height, ref } = useResizeDetector({
    handleHeight: true,
    refreshMode: 'debounce',
    refreshRate: 1000,
  });

  useEffect(() => {
    const mapStyles = getMapStyles({
      apiKeys: config?.apiKeys,
      language: locale.mapTileLocale || 'en',
    });
    let mapStyleOverwrites: BasemapOptions = {};
    if (config?.maps?.addMapStyles) {
      mapStyleOverwrites = config.maps.addMapStyles({
        apiKeys: config.apiKeys,
        mapStyleServer: MAP_STYLES,
        pixelRatio,
        language: config?.maps?.locale || 'en',
        mapComponents: {
          OpenlayersMap: MapComponentOL,
          MapLibreMap: MapComponentML,
        },
      });
    }
    const newBaseMapOptions = Object.assign({}, mapStyles, mapStyleOverwrites);
    setBasemapOptions(newBaseMapOptions);
  }, [config, locale]);

  const eventListener = useCallback(
    (event: MapEvent) => {
      if (onFeaturesChange && event.type === 'EXPLORE_AREA') {
        if (['PLATE_CAREE', 'MERCATOR'].indexOf(projection) < 0) {
          toast({
            title: 'This action is not supported in polar projections',
            variant: 'destructive',
          });
          return;
        }
        const { bbox } = event;
        if (!bbox) return;

        const wkt = boundingBoxToWKT(bbox);
        onFeaturesChange({ features: [wkt] });
      }
    },
    [onFeaturesChange, projection, toast]
  );

  const getUserLocation = useCallback(() => {
    if (hasGeoLocation) {
      setLocationSearch(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationSearch(false);
          const { latitude, longitude } = position.coords;
          broadcastEvent({ type: 'ZOOM_TO', lat: latitude, lng: longitude, zoom: 11 });
        },
        () => {
          toast({
            title: formatMessage({
              id: 'map.failedToGetUserLocation.title',
              defaultMessage: 'Unable to get location.',
            }),
            description: formatMessage({
              id: 'map.failedToGetUserLocation.message',
              defaultMessage: 'Check browser settings.',
            }),
            variant: 'destructive',
          });
          setLocationSearch(false);
        }
      );
    }
  }, [toast, formatMessage]);

  const toggleDrawingTool = useCallback(() => {
    setDrawingTool((current) => (current === 'DRAW' ? null : 'DRAW'));
  }, []);

  const toggleDeleteTool = useCallback(() => {
    setDrawingTool((current) => (current === 'DELETE' ? null : 'DELETE'));
  }, []);

  const toggleSelectTool = useCallback(() => {
    setDrawingTool((current) => (current === 'SELECT' ? null : 'SELECT'));
  }, []);

  const menuLayerOptions = layerOptions?.[projection]?.map((currentLayerId) => {
    const layerStyle = getStyle({
      styles: basemapOptions || {},
      projection,
      type: currentLayerId,
      lookup: styleLookup,
    });
    const labelKey = layerStyle?.labelKey;
    const isSelected = currentLayerId === layerId;
    return (
      <DropdownMenuItem
        key={currentLayerId}
        onSelect={(event) => {
          setLayerId(currentLayerId);
          sessionStorage.setItem('defaultOccurrenceLayer', currentLayerId);
          event.preventDefault();
        }}
      >
        <span className="g-flex g-items-center g-gap-2">
          <span className="g-w-4">{isSelected ? '✓' : ''}</span>
          <FormattedMessage id={labelKey || 'unknown'} defaultMessage={labelKey} />
        </span>
      </DropdownMenuItem>
    );
  });

  const projectionMenuOptions = projectionOptions.map((proj: ProjectionName) => {
    const isSelected = proj === projection;
    return (
      <DropdownMenuItem
        key={proj}
        onSelect={(event) => {
          setProjection(proj);
          sessionStorage.setItem('defaultOccurrenceProjection', proj);
          event.preventDefault();
        }}
      >
        <span className="g-flex g-items-center g-gap-2">
          <span className="g-w-4">{isSelected ? '✓' : ''}</span>
          <FormattedMessage id={`map.projections.${proj}`} defaultMessage={proj} />
        </span>
      </DropdownMenuItem>
    );
  });

  const mapConfiguration = getStyle({
    styles: basemapOptions || {},
    projection,
    type: layerId,
    lookup: styleLookup,
    layerOptions,
  });

  if (!basemapOptions || !mapConfiguration) return null;

  const MapComponent = mapConfiguration?.component || MapComponentOL;

  const notPolarProjection = ['PLATE_CAREE', 'MERCATOR'].indexOf(projection) >= 0;

  return (
    <div className={cn(`g-flex-auto g-h-96 g-relative g-z-10`, className)} style={style} ref={ref}>
      {showErrorMessage && (
        <div className="g-z-10 g-absolute g-start-0 g-bottom-0 g-end-0 g-pointer-events-none">
          <div className="g-p-2 g-bg-slate-800 g-text-slate-100 g-inline-block g-m-2 g-rounded g-text-sm">
            <BsLightningFill style={{ color: 'orange' }} />{' '}
            <FormattedMessage
              id="error.partialMapFailure"
              defaultMessage="Some tiles failed to load"
            />
          </div>
        </div>
      )}
      <div className="g-z-10 g-absolute g-start-0 g-top-0 g-end-0">
        <StripeLoader active={mapLoading} className="g-w-full" />
      </div>
      <div className="mapControls g-flex g-absolute g-bg-white g-z-10 g-border g-border-solid g-m-2 g-end-0 g-items-center">
        <MenuButton onClick={() => broadcastEvent({ type: 'ZOOM_IN' })}>
          <MdZoomIn />
        </MenuButton>
        <MenuButton onClick={() => broadcastEvent({ type: 'ZOOM_OUT' })}>
          <MdZoomOut />
        </MenuButton>
        {userLocationEnabled && (
          <MenuButton loading={searchingLocation} onClick={getUserLocation}>
            <MdMyLocation />
          </MenuButton>
        )}
        {notPolarProjection && (
          <>
            <ToolSeparator />
            <SimpleTooltip
              asChild
              title={<FormattedMessage id="map.filterByView" defaultMessage="Use view as filter" />}
            >
              <MenuButton
                onClick={() => broadcastEvent({ type: 'EXPLORE_AREA' })}
                className="g-p-2"
              >
                <ExploreAreaIcon />
              </MenuButton>
            </SimpleTooltip>
            <SimpleTooltip
              asChild
              title={<FormattedMessage id="map.drawPolygon" defaultMessage="Draw polygon" />}
            >
              <MenuButton
                onClick={toggleDrawingTool}
                className={cn('g-p-2', drawingTool === 'DRAW' && 'g-bg-primary g-text-white')}
              >
                <DrawIcon />
              </MenuButton>
            </SimpleTooltip>
            {MapComponent === MapComponentML && (
              <SimpleTooltip
                asChild
                title={
                  <FormattedMessage id="map.selectPolygon" defaultMessage="Select/edit polygon" />
                }
              >
                <MenuButton
                  onClick={toggleSelectTool}
                  className={cn('g-p-2', drawingTool === 'SELECT' && 'g-bg-primary g-text-white')}
                >
                  <ModifyPolygonIcon />
                </MenuButton>
              </SimpleTooltip>
            )}
            <SimpleTooltip
              asChild
              title={<FormattedMessage id="map.deletePolygon" defaultMessage="Delete polygon" />}
            >
              <MenuButton
                onClick={toggleDeleteTool}
                className={cn('g-p-2', drawingTool === 'DELETE' && 'g-bg-primary g-text-white')}
              >
                <MdDeleteOutline />
              </MenuButton>
            </SimpleTooltip>
            <ToolSeparator />
          </>
        )}

        {projectionOptions.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MenuButton>
                <MdLanguage />
              </MenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{projectionMenuOptions}</DropdownMenuContent>
          </DropdownMenu>
        )}

        {(layerOptions?.[projection]?.length ?? 0) > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MenuButton>
                <MdOutlineLayers />
              </MenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{menuLayerOptions}</DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <MapComponent
        mapConfig={mapConfiguration.mapConfig}
        latestEvent={latestEvent}
        defaultMapSettings={defaultMapSettings}
        overlays={overlays}
        className="mapComponent g-relative [&>canvas:focus]:g-outline-none g-border g-border-solid g-border-slate-200 g-rounded g-flex g-flex-col g-h-full g-flex-auto g-z-0"
        onLoading={updateLoading}
        onTileError={failedTileHandler}
        onMapClick={() => showList(false)}
        onPointClick={(data: PointClickData) => {
          if (loadPointData) {
            showList(true);
            loadPointData(data);
          }
        }}
        listener={eventListener}
        registerPredicate={registerPredicate}
        containerHeight={height}
        containerWidth={width}
        drawingTool={drawingTool}
        onDrawingToolChange={setDrawingTool}
        features={features}
        onFeaturesChange={onFeaturesChange}
      />
    </div>
  );
}

function ToolSeparator() {
  return <div className="g-h-6 g-border-r g-border-solid g-border-slate-200"></div>;
}
