import React, { useState, useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector } from 'ol/source';
import { Draw, Modify } from 'ol/interaction';
import { fromExtent } from 'ol/geom';
import { createRegularPolygon } from 'ol/interaction/Draw';
import Feature from 'ol/Feature';

const MapWithPolygons = ({ polygons, onPolygonCreated, onPolygonEdited }) => {
  const mapRef = useRef(null);
  const [vectorSource, setVectorSource] = useState(new Vector());
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [modifyInteraction, setModifyInteraction] = useState(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSource,
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    const draw = new Draw({
      source: vectorSource,
      type: 'Polygon',
      geometryFunction: createRegularPolygon(4),
    });
    draw.on('drawend', (event) => {
      const polygonGeometry = event.feature.getGeometry();
      const extent = polygonGeometry.getExtent();
      const polygon = fromExtent(extent);
      onPolygonCreated(polygon);
    });

    const modify = new Modify({ source: vectorSource });
    modify.on('modifyend', (event) => {
      const polygonGeometry = event.features.getArray()[0].getGeometry();
      const extent = polygonGeometry.getExtent();
      const polygon = fromExtent(extent);
      onPolygonEdited(polygon);
    });

    map.addInteraction(draw);
    map.addInteraction(modify);

    setDrawInteraction(draw);
    setModifyInteraction(modify);

    return () => {
      map.removeInteraction(draw);
      map.removeInteraction(modify);
      setDrawInteraction(null);
      setModifyInteraction(null);
      map.setTarget(null);
    };
  }, []);

  useEffect(() => {
    const features = polygons.map((polygon) => {
      return new Feature({
        geometry: polygon,
      });
    });
    vectorSource.clear();
    vectorSource.addFeatures(features);
  }, [polygons, vectorSource]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default MapWithPolygons;
