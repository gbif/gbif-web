// @ts-nocheck
/*
Map options
it would be nice to be able to support overlays at some point. With an opacity setting I imagine
Other than that we need 4 projections
satellite map (hp participants will have to register to get a token themselves - to avoid overloading the service)
mercator maps will support both OL and MB
and some default styles for OL and MB to choose from, possibly an option to add ones own.
And probably the point overlays will have to be dependent on the basemap as well?

*/
import { useResizeDetector } from 'react-resize-detector';
import React, { useState, useEffect, useCallback } from 'react';
// import { DetailsDrawer, Menu, MenuAction, Button, Tooltip } from '../../../../components';
// import { OccurrenceSidebar } from '../../../../entities';
// import { useDialogState } from "reakit/Dialog";
// import ListBox from './ListBox';
import { MdOutlineLayers, MdZoomIn, MdZoomOut, MdLanguage, MdMyLocation } from 'react-icons/md';
import { MdOutlineFilterAlt as ExploreAreaIcon } from 'react-icons/md';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
// import { ViewHeader } from '../ViewHeader';
import MapComponentML from './MapLibreMap';
import MapComponentOL from './OpenlayersMap';
import { FormattedMessage } from 'react-intl';
import { getMapStyles } from './standardMapStyles';
import { Button } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { useConfig } from '@/config/config';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/utils/shadcn';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';
import ListBox from './ListBox';
import { useOrderedList } from '../../browseList/useOrderedList';
import { useStringParam } from '@/hooks/useParam';
import { Spinner } from '@/components/ui/spinner';
import { ViewHeader } from '@/components/ViewHeader';
// import { toast } from 'react-toast'

const MAP_STYLES = `${import.meta.env.PUBLIC_WEB_UTILS}/map-styles`;
const pixelRatio = window.devicePixelRatio || 1;
const hasGeoLocation = 'geolocation' in navigator;

const defaultLayerOptions = {
  // ARCTIC: ['NATURAL', 'BRIGHT', 'DARK'],
  // PLATE_CAREE: ['NATURAL', 'BRIGHT', 'DARK'],
  MERCATOR: ['BRIGHT', 'NATURAL'],
  // ANTARCTIC: ['NATURAL', 'BRIGHT', 'DARK'],
};

function getStyle({ styles = {}, projection, type, lookup = {}, layerOptions }) {
  const fallbackStyleName = `${layerOptions?.[projection]?.[0]}_${projection}`;
  const styleKey = lookup?.[projection]?.[type] || `${type}_${projection}`;
  let style = styles[styleKey] ? styles[styleKey] : styles[fallbackStyleName];
  return style;
}

function Map({
  labelMap,
  query,
  q,
  pointData,
  pointError,
  pointLoading,
  loading,
  total,
  predicateHash,
  registerPredicate,
  loadPointData,
  defaultMapSettings,
  style,
  className,
  mapProps,
  features,
  onFeaturesChange,
  ...props
}) {
  const config = useConfig();
  const userLocationEnabled = true; //config?.occurrence?.mapSettings?.userLocationEnabled;
  const styleLookup = config?.maps?.styleLookup || {};
  const { setOrderedList } = useOrderedList();
  const mapStyles = config?.maps?.mapStyles?.options || defaultLayerOptions;
  const supportedProjections = Object.keys(mapStyles);
  const [projectionOptions] = useState(supportedProjections);
  let defaultProjection =
    sessionStorage.getItem('defaultOccurrenceProjection') ||
    config?.maps?.mapStyles?.defaultProjection ||
    supportedProjections[0];
  if (!supportedProjections.includes(defaultProjection)) {
    defaultProjection = supportedProjections[0];
  }
  const [projection, setProjection] = useState(defaultProjection);

  let defaultStyle =
    sessionStorage.getItem('defaultOccurrenceLayer') || config?.maps?.mapStyles?.defaultMapStyle || 'BRIGHT';
  if (!mapStyles?.[defaultProjection]?.includes(defaultStyle)) {
    defaultStyle = mapStyles?.[defaultProjection]?.[0];
  }

  const [layerOptions] = useState(mapStyles);
  const [layerId, setLayerId] = useState(defaultStyle);
  const [latestEvent, broadcastEvent] = useState();
  const [searchingLocation, setLocationSearch] = useState();
  const [basemapOptions, setBasemapOptions] = useState();
  const [listVisible, showList] = useState(false);
  const { toast } = useToast();
  const [, setPreviewKey] = useStringParam({ key: 'entity' });
  const items = React.useMemo(() => pointData?.occurrenceSearch?.documents?.results || [], [pointData]);

  // update ordered list on items change
  useEffect(() => {
    setOrderedList(items.map((item) => `o_${item.key}`));
  }, [items, setOrderedList]);

  const { width, height, ref } = useResizeDetector({
    handleHeight: true,
    refreshMode: 'debounce',
    refreshRate: 1000,
  });

  useEffect(() => {
    const mapStyles = getMapStyles({
      apiKeys: config?.apiKeys,
      language: config?.maps?.locale || 'en',
    });
    let mapStyleOverwrites = {};
    if (config?.maps?.addMapStyles) {
      mapStyleOverwrites = config.maps.addMapStyles({
        apiKeys: config.apiKeys,
        mapStyleServer: MAP_STYLES,
        pixelRatio,
        language: config?.maps?.locale || 'en',
        mapComponents: {
          OpenlayersMap: MapComponentOL,
          MapLibreMap: () => MapComponentML,
        },
      });
    }
    const newBaseMapOptions = Object.assign({}, mapStyles, mapStyleOverwrites);
    setBasemapOptions(newBaseMapOptions);
  }, [config]);

  const eventListener = useCallback(
    (event) => {
      if (onFeaturesChange && event.type === 'EXPLORE_AREA') {
        if (['PLATE_CAREE', 'MERCATOR'].indexOf(projection) < 0) {
          toast.error('This action is not supported in polar projections', {
            backgroundColor: 'tomato',
            color: '#ffffff',
          });
          return;
        }
        const { bbox } = event; //top, left, right, bottom
        // create wkt from bounds, making sure that it is counter clockwise
        const wkt = `POLYGON((${bbox.left} ${bbox.top},${bbox.left} ${bbox.bottom},${bbox.right} ${bbox.bottom},${bbox.right} ${bbox.top},${bbox.left} ${bbox.top}))`;
        onFeaturesChange({ features: [wkt] }); //remove existing geometries
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
        (err) => {
          toast.error(
            <div>
              <h3>
                <FormattedMessage
                  id="map.failedToGetUserLocation.title"
                  defaultMessage="Unable to get location."
                />
              </h3>
              <FormattedMessage
                id="map.failedToGetUserLocation.message"
                defaultMessage="Check browser settings."
              />
            </div>,
            {
              backgroundColor: 'tomato',
              color: '#ffffff',
            }
          );
          setLocationSearch(false);
        }
      );
    }
  }, [toast]);

  const menuLayerOptions = layerOptions?.[projection].map((layerId) => {
    const layerStyle = getStyle({
      styles: basemapOptions,
      projection,
      type: layerId,
      lookup: styleLookup,
    });
    const labelKey = layerStyle?.labelKey;
    return (
      <DropdownMenuItem
        key={layerId}
        onSelect={(event) => {
          setLayerId(layerId);
          sessionStorage.setItem('defaultOccurrenceLayer', layerId);
          event.preventDefault();
        }}
      >
        <FormattedMessage id={labelKey || 'unknown'} defaultMessage={labelKey} />
      </DropdownMenuItem>
    );
  });

  const projectionMenuOptions = projectionOptions.map((proj) => (
    <DropdownMenuItem
      key={proj}
      onSelect={(event) => {
        setProjection(proj);
        sessionStorage.setItem('defaultOccurrenceProjection', proj);
        event.preventDefault();
      }}
    >
      <FormattedMessage id={`map.projections.${proj}`} defaultMessage={proj} />
    </DropdownMenuItem>
  ));

  const mapConfiguration = getStyle({
    styles: basemapOptions,
    projection,
    type: layerId,
    lookup: styleLookup,
    layerOptions,
  });

  if (!basemapOptions || !mapConfiguration) return null;
  // const MapComponent = MapComponentOL;
  const MapComponent = mapConfiguration?.component || MapComponentOL;

  const notPolarProjection = ['PLATE_CAREE', 'MERCATOR'].indexOf(projection) >= 0;

  return (
    <>
      <div
        ref={ref}
        className={cn(
          'mapArea g-flex-auto g-flex g-h-fullg-h-[800px] g-flex-col g-relative',
          className
        )}
        {...{ style }}
      >
        <ViewHeader message="counts.nResultsWithCoordinates" loading={loading} total={total} />
        <DynamicHeightDiv minPxHeight={500}>
          {listVisible && (
            <ListBox
              onCloseRequest={() => showList(false)}
              labelMap={labelMap}
              onClick={({ index }) => {
                setPreviewKey(`o_${items[index].key}`);
              }}
              data={pointData}
              error={pointError}
              loading={pointLoading}
              className="gbif-resultList g-z-10 g-absolute g-start-0 g-top-0 g-m-2 g-w-96 g-max-w-full g-max-h-[calc(100%-4rem)]"
            />
          )}
          <div className="mapControls g-flex g-absolute g-bg-white g-z-10 g-border g-m-2 g-end-0 g-items-center">
            <MenuButton onClick={() => broadcastEvent({ type: 'ZOOM_IN' })}>
              <MdZoomIn />
            </MenuButton>
            <MenuButton onClick={() => broadcastEvent({ type: 'ZOOM_OUT' })}>
              <MdZoomOut />
            </MenuButton>
            {notPolarProjection && (
              <SimpleTooltip
                title={
                  <FormattedMessage id="map.filterByView" defaultMessage="Use view as filter" />
                }
              >
                <MenuButton onClick={() => broadcastEvent({ type: 'EXPLORE_AREA' })}>
                  <ExploreAreaIcon />
                </MenuButton>
              </SimpleTooltip>
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

            {layerOptions?.[projection]?.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <MenuButton>
                    <MdOutlineLayers />
                  </MenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">{menuLayerOptions}</DropdownMenuContent>
              </DropdownMenu>
            )}

            {userLocationEnabled && (
              <MenuButton loading={searchingLocation} onClick={getUserLocation}>
                <MdMyLocation />
              </MenuButton>
            )}
          </div>
          <MapComponent
            {...mapProps}
            mapConfig={mapConfiguration.mapConfig}
            latestEvent={latestEvent}
            defaultMapSettings={defaultMapSettings}
            predicateHash={predicateHash}
            q={q}
            className="mapComponent [&>canvas:focus]:g-outline-none g-border g-border-slate-200 g-rounded g-flex g-flex-col g-h-full g-flex-auto"
            query={query}
            onMapClick={(e) => showList(false)}
            onPointClick={(data) => {
              // check that it is only doing so for the top layer - it should call multiple times for each layer
              showList(true);
              loadPointData(data);
            }}
            listener={eventListener}
            registerPredicate={registerPredicate}
            height={height}
            width={width}
          />
        </DynamicHeightDiv>
      </div>
    </>
  );
}

export default Map;

const MenuButton = React.forwardRef(({ children, loading, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      className="g-p-2 g-flex-auto g-text-xl g-text-slate-800 g-whitespace-nowrap"
      {...props}
    >
      {loading ? <Spinner /> : children}
    </Button>
  );
});

