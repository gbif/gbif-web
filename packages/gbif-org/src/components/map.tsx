import { useOnMountUnsafe } from '@/hooks/useOnMountUnsafe';
import { projections } from '@/routes/occurrence/search/views/map/Map/openlayers/projections';
import { getMapStyles } from '@/routes/occurrence/search/views/map/Map/standardMapStyles';
import { cn } from '@/utils/shadcn';
import { Map as OpenLayersMap } from 'ol';
import { applyBackground, stylefunction } from 'ol-mapbox-style';
import { defaults as olControlDefaults } from 'ol/control';
import * as olInteraction from 'ol/interaction';
import React from 'react';

const mapStyles = getMapStyles({ language: 'en' });
const basemapStyle = mapStyles.NATURAL_PLATE_CAREE.mapConfig.basemapStyle;

const currentProjection = projections.EPSG_4326;
const interactions = olInteraction.defaults({
  altShiftDragRotate: false,
  pinchRotate: false,
  mouseWheelZoom: true,
});

type Props = {
  coordinates: {
    lat: number;
    lon: number;
  };
  className?: string;
};

export default function Map({ coordinates, className }: Props) {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useOnMountUnsafe(() => {
    const place = [coordinates.lon, coordinates.lat];
    const lat = 0;
    const lon = 0;
    const zoom = 0;

    const baseLayer = currentProjection.getBaseLayer();
    // const resolutions = baseLayer?.getSource()?.getTileGrid()?.getResolutions();
    // applyBackground(baseLayer, layerStyle, 'openmaptiles');
    // applyStyle(baseLayer, layerStyle, 'openmaptiles', undefined, resolutions);

    const mapConfig = {
      layers: [baseLayer],
      target: mapRef.current ?? undefined,
      view: currentProjection.getView(lat, lon, zoom),
      controls: olControlDefaults({ zoom: false, attribution: true }),
      interactions,
    };

    const map = new OpenLayersMap(mapConfig);
    // apply(map, mapStyles.NATURAL_PLATE_CAREE.mapConfig.basemapStyle);
    const stylePromise = fetch(basemapStyle).then((response) => response.json());
    stylePromise.then((styleResponse) => {
      const baseLayer = currentProjection.getBaseLayer();
      const resolutions = baseLayer?.getSource()?.getTileGrid()?.getResolutions();
      applyBackground(
        baseLayer,
        styleResponse,
        // @ts-ignore TODO: What is the meaning of this 'openmaptiles' string? (Typescript complains about it, and i can't find any documentation on it. This started when i upgraded openlayers)
        'openmaptiles'
      );
      stylefunction(baseLayer, styleResponse, 'openmaptiles', resolutions);
      map.addLayer(baseLayer);
    });

    // map.addLayer(baseLayer);

    // new OpenLayersMap({
    //   layers: [
    //     baseLayer,
    //     // new VectorLayer({
    //     //   source: new VectorSource({
    //     //     features: [new Feature(new Point(place))],
    //     //   }),
    //     //   style: {
    //     //     'circle-radius': 9,
    //     //     'circle-fill-color': 'green',
    //     //   },
    //     // }),
    //   ],
    //   target: mapRef.current ?? undefined,
    //   view: new View({
    //     // center: place,
    //     zoom: 4,
    //   }),
    // });
  });

  return <div className={cn('g-w-full g-h-96', className)} ref={mapRef}></div>;
}
