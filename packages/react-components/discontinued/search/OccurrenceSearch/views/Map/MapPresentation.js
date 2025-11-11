/*
Map options
it would be nice to be able to support overlays at some point. With an opacity setting I imagine
Other than that we need 4 projections
satellite map (hp participants will have to register to get a token themselves - to avoid overloading the service)
mercator maps will support both OL and MB
and some default styles for OL and MB to choose from, possibly an option to add ones own.
And probably the point overlays will have to be dependent on the basemap as well?

*/
import { jsx } from '@emotion/react';
import { useResizeDetector } from 'react-resize-detector';
import React, { useContext, useState, useEffect, useCallback } from "react";
import { DetailsDrawer, Menu, MenuAction, Button, Tooltip } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { useDialogState } from "reakit/Dialog";
import ListBox from './ListBox';
import { MdOutlineLayers, MdZoomIn, MdZoomOut, MdLanguage, MdMyLocation } from 'react-icons/md'
import { MdOutlineFilterAlt as ExploreAreaIcon } from "react-icons/md";

import { ViewHeader } from '../ViewHeader';
import MapComponentMB from './MapboxMap';
import MapComponentOL from './OpenlayersMap';
import * as css from './map.styles';
import env from '../../../../../.env.json';
import SiteContext from '../../../../dataManagement/SiteContext';
import { FormattedMessage } from 'react-intl';
import { getMapStyles } from './standardMapStyles';
import { toast } from 'react-toast'

const pixelRatio = parseInt(window.devicePixelRatio) || 1;
const hasGeoLocation = "geolocation" in navigator;

const defaultLayerOptions = {
  // ARCTIC: ['NATURAL', 'BRIGHT', 'DARK'],
  // PLATE_CAREE: ['NATURAL', 'BRIGHT', 'DARK'],
  MERCATOR: ['BRIGHT', 'NATURAL'],
  // ANTARCTIC: ['NATURAL', 'BRIGHT', 'DARK']
};

function getStyle({ styles = {}, projection, type, lookup = {}, layerOptions }) {
  const fallbackStyleName = `${layerOptions?.[projection]?.[0]}_${projection}`
  const styleKey = lookup?.[projection]?.[type] || `${type}_${projection}`;
  let style = styles[styleKey] ? styles[styleKey] : styles[fallbackStyleName];
  return style;
}

function Map({ labelMap, query, q, pointData, pointError, pointLoading, loading, total, predicateHash, registerPredicate, loadPointData, defaultMapSettings, style, className, mapProps, features, onFeaturesChange, ...props }) {
  const dialog = useDialogState({ animated: true, modal: false });
  const theme = useContext(ThemeContext);
  const siteContext = useContext(SiteContext);
  const userLocationEnabled = siteContext?.occurrence?.mapSettings?.userLocationEnabled;

  const styleLookup = siteContext?.maps?.styleLookup || {};

  const mapStyles = siteContext?.maps?.mapStyles || defaultLayerOptions;
  const supportedProjections = Object.keys(mapStyles);
  const [projectionOptions, setProjectionOptions] = useState(supportedProjections);
  let defaultProjection = sessionStorage.getItem('defaultOccurrenceProjection') || siteContext?.maps?.defaultProjection || supportedProjections[0];
  if (!supportedProjections.includes(defaultProjection)) {
    defaultProjection = supportedProjections[0];
  }
  const [projection, setProjection] = useState(defaultProjection);

  let defaultStyle = sessionStorage.getItem('defaultOccurrenceLayer') || siteContext?.maps?.defaultMapStyle || 'BRIGHT';
  if (!mapStyles?.[defaultProjection]?.includes(defaultStyle)) {
    defaultStyle = mapStyles?.[defaultProjection]?.[0];
  }

  const [layerOptions, setLayerOptions] = useState(mapStyles);
  const [layerId, setLayerId] = useState(defaultStyle);
  const [latestEvent, broadcastEvent] = useState();
  const [searchingLocation, setLocationSearch] = useState();
  const [basemapOptions, setBasemapOptions] = useState();
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const [listVisible, showList] = useState(false);

  const items = pointData?.occurrenceSearch?.documents?.results || [];

  const { width, height, ref } = useResizeDetector({
    handleHeight: true,
    refreshMode: 'debounce',
    refreshRate: 1000
  });

  useEffect(() => {
    const mapStyles = getMapStyles({ apiKeys: siteContext.apiKeys, language: siteContext?.maps?.locale || 'en', });
    let mapStyleOverwrites = {};
    if (siteContext?.maps?.addMapStyles) {
      mapStyleOverwrites = siteContext.maps.addMapStyles({
        apiKeys: siteContext.apiKeys,
        mapStyleServer: env.MAP_STYLES,
        pixelRatio,
        language: siteContext?.maps?.locale || 'en',
        mapComponents: {
          OpenlayersMap: MapComponentOL,
          MapboxMap: MapComponentMB,
        }
      });
    }
    setBasemapOptions(Object.assign({}, mapStyles, mapStyleOverwrites));
  },
    [siteContext],
  );

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [items, activeId]);

  const eventListener = useCallback((event) => {
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
      onFeaturesChange({features: [wkt]});//remove existing geometries
    }
  }, [onFeaturesChange, projection]);

  const getUserLocation = useCallback(() => {
    if (hasGeoLocation) {
      setLocationSearch(true);
      navigator.geolocation.getCurrentPosition((position) => {
        setLocationSearch(false);
        const { latitude, longitude } = position.coords;
        broadcastEvent({ type: 'ZOOM_TO', lat: latitude, lng: longitude, zoom: 11 });
      }, err => {
        toast.error(<div>
          <h3><FormattedMessage id='map.failedToGetUserLocation.title' defaultMessage="Unable to get location." /></h3>
          <FormattedMessage id='map.failedToGetUserLocation.message' defaultMessage="Check browser settings." />
        </div>, {
          backgroundColor: 'tomato',
          color: '#ffffff',
        });
        setLocationSearch(false);
      });
    }
  }, []);

  const menuLayerOptions = menuState => layerOptions?.[projection].map((layerId) => {
    const layerStyle = getStyle({ styles: basemapOptions, projection, type: layerId, lookup: styleLookup });
    const labelKey = layerStyle.labelKey;
    return <MenuAction key={layerId} onClick={() => {
      setLayerId(layerId);
      sessionStorage.setItem('defaultOccurrenceLayer', layerId);
    }}>
      <FormattedMessage id={labelKey || 'unknown'} defaultMessage={labelKey} />
    </MenuAction>
  });

  const projectionMenuOptions = menuState => projectionOptions.map((proj, i) => <MenuAction key={proj} onClick={() => {
    setProjection(proj);
    sessionStorage.setItem('defaultOccurrenceProjection', proj);
  }}>
    <FormattedMessage id={`map.projections.${proj}`} defaultMessage={proj} />
  </MenuAction>);

  const mapConfiguration = getStyle({
    styles: basemapOptions,
    projection,
    type: layerId,
    lookup: styleLookup,
    layerOptions
  });

  if (!basemapOptions || !mapConfiguration) return null;
  const MapComponent = mapConfiguration.component || MapComponentOL;

  const notPolarProjection = ['PLATE_CAREE', 'MERCATOR'].indexOf(projection) >= 0;

  return <>
    <DetailsDrawer href={`https://www.gbif.org/occurrence/${activeItem?.key}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeItem?.key} defaultTab='details' style={{ maxWidth: '100%', width: 700, height: '100%' }} onCloseRequest={() => dialog.setVisible(false)} />
    </DetailsDrawer>
    <div ref={ref} css={css.mapArea({ theme })} {...{style, className}}>
      <ViewHeader message="counts.nResultsWithCoordinates" loading={loading} total={total} />
      <div style={{ position: 'relative', height: '200px', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
        {listVisible && <ListBox onCloseRequest={e => showList(false)}
          labelMap={labelMap}
          onClick={({ index }) => { dialog.show(); setActive(index) }}
          data={pointData} error={pointError}
          loading={pointLoading}
          css={css.resultList({})}
        />}
        <div css={css.mapControls({ theme })}>
          <Button appearance="text" onClick={() => broadcastEvent({ type: 'ZOOM_IN' })}><MdZoomIn /></Button>
          <Button appearance="text" onClick={() => broadcastEvent({ type: 'ZOOM_OUT' })}><MdZoomOut /></Button>
          {notPolarProjection && <Tooltip title={<FormattedMessage id="map.filterByView" defaultMessage="Use view as filter" />}>
            <Button appearance="text" onClick={() => broadcastEvent({ type: 'EXPLORE_AREA' })}><ExploreAreaIcon /></Button>
          </Tooltip>}
          {projectionOptions.length > 1 && <Menu style={{ display: 'inline-block' }}
            aria-label="Select projection"
            trigger={<Button appearance="text"><MdLanguage /></Button>}
            items={projectionMenuOptions}
          />}
          {layerOptions?.[projection]?.length > 1 && <Menu style={{ display: 'inline-block' }}
            aria-label="Select layers"
            trigger={<Button appearance="text"><MdOutlineLayers /></Button>}
            items={menuLayerOptions}
          />}
          {userLocationEnabled && <Button loading={searchingLocation} appearance="text" onClick={getUserLocation}><MdMyLocation /></Button>}
        </div>
        <MapComponent
          {...mapProps}
          mapConfig={mapConfiguration.mapConfig}
          latestEvent={latestEvent}
          defaultMapSettings={defaultMapSettings}
          predicateHash={predicateHash}
          q={q}
          css={css.mapComponent({ theme })}
          theme={theme}
          query={query}
          onMapClick={e => showList(false)}
          onPointClick={data => { showList(true); loadPointData(data) }}
          listener={eventListener}
          registerPredicate={registerPredicate}
          height={height}
          width={width}
          />
      </div>
    </div>
  </>;
}

export default Map;
