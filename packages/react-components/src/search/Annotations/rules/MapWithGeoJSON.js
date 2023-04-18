import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { Style, Fill, Stroke } from 'ol/style';
import XYZ from 'ol/source/XYZ';
import { get as getProjection } from 'ol/proj';

import { colorMap } from './colorMap';


const MapWithGeoJSON = ({ geojson, type, ...props }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!geojson || !mapRef.current) return;

    const osmLayer = new TileLayer({
      source: new OSM()
    });

    // const gbifLayer = new TileLayer({
    //   source: new XYZ({
    //     url: 'https://tile.gbif.org/3857/omt/{z}/{x}/{y}@2x.png?style=gbif-geyser-en',
    //     projection: getProjection('EPSG:3857'),
    //   }),
    // });

    const format = new GeoJSON();
    // const features = format.readFeatures(geojson, { featureProjection: 'EPSG:3857' });
    const features = format.readFeatures(geojson, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });

    const source = new VectorSource({ features, strategy: bboxStrategy });
    const color = colorMap[type] || colorMap['OTHER'];
    const vectorLayer = new VectorLayer({
      source,
      style: new Style({
        fill: new Fill({ color: color + '80' }),
        stroke: new Stroke({ color: color, width: 2 }),
      }),
    });
    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer, vectorLayer],
      view: new View({
        projection: 'EPSG:3857'
      }),
      controls: [],
    });
    map.getView().fit(source.getExtent(), { padding: [20, 20, 20, 20] });

    return () => map.dispose();
  }, [geojson]);

  // add tabindex to make the map focusable and hence disable automatic scrolling zoom navigation
  return <div ref={mapRef} {...props} tabIndex="1" />;
};

export default MapWithGeoJSON;