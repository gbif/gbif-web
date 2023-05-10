import { useState, useEffect, useContext } from 'react';
import env from '../../../../../.env.json';
import SiteContext from '../../../../dataManagement/SiteContext';
import { Menu, MenuAction, Button } from '../../../../components';
import { MdOutlineLayers, MdLanguage } from 'react-icons/md'
import { getMapStyles } from './standardMapStyles';
import { FormattedMessage } from 'react-intl';
const pixelRatio = parseInt(window.devicePixelRatio) || 1;

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

function useMapConfig({ mapSettings } = {}) {
  const siteContext = useContext(SiteContext);
  const mapConfig = (mapSettings || siteContext?.maps);
  const styleLookup = mapConfig?.styleLookup || {};
  const mapStyles = mapConfig.mapStyles || defaultLayerOptions;
  const supportedProjections = Object.keys(mapStyles);
  const [projectionOptions, setProjectionOptions] = useState(supportedProjections);
  let defaultProjection = sessionStorage.getItem('defaultOccurrenceProjection') || mapConfig?.defaultProjection || supportedProjections[0];
  if (!supportedProjections.includes(defaultProjection)) {
    defaultProjection = supportedProjections[0];
  }
  const [projection, setProjection] = useState(defaultProjection);

  let defaultStyle = sessionStorage.getItem('defaultOccurrenceLayer') || mapConfig?.defaultMapStyle || 'BRIGHT';
  if (!mapStyles?.[defaultProjection]?.includes(defaultStyle)) {
    defaultStyle = mapStyles?.[defaultProjection]?.[0];
  }

  const [layerOptions, setLayerOptions] = useState(mapStyles);
  const [layerId, setLayerId] = useState(defaultStyle);
  const [basemapOptions, setBasemapOptions] = useState();

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
    [siteContext, mapSettings],
  );

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

  const projectionMenuOptions = () => projectionOptions.map((proj, i) => <MenuAction key={proj} onClick={() => {
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

  const projectionsButton = projectionOptions.length < 2 ? null : <Menu style={{ display: 'inline-block' }}
    aria-label="Select projection"
    trigger={<Button appearance="text"><MdLanguage /></Button>}
    items={projectionMenuOptions}
  />;

  const layerButton = layerOptions?.[projection]?.length < 2 ? null : <Menu style={{ display: 'inline-block' }}
    aria-label="Select layers"
    trigger={<Button appearance="text"><MdOutlineLayers /></Button>}
    items={menuLayerOptions}
  />;

  return { 
    mapConfiguration, 
    basemapOptions, 
    projectionOptions, 
    layerOptions,
    projectionsButton,
    layerButton,
    layerId,
    projection,
    menuLayerOptions,
    projectionMenuOptions
   };
}

export default useMapConfig;