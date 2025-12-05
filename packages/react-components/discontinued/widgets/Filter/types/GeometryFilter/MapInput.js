import { jsx, css } from '@emotion/react';
import React, { useRef, useEffect, useState } from 'react';
import Draw from 'ol/interaction/Draw.js';
import Select from 'ol/interaction/Select.js';
import Modify from 'ol/interaction/Modify.js';
import Snap from 'ol/interaction/Snap.js';
import Map from 'ol/Map';
import { defaults as olControlDefaults } from 'ol/control';
import * as olInteraction from 'ol/interaction';
import { TileImage as TileImageSource } from 'ol/source';
import View from 'ol/View.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import TileGrid from 'ol/tilegrid/TileGrid';
import proj4 from 'proj4';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { WKT, GeoJSON } from 'ol/format';
import { Fill, Stroke, Style } from 'ol/style';
import { useKeyPressEvent } from 'react-use';
import { Button, ButtonGroup } from '../../../../components';
import { MdZoomIn, MdZoomOut, MdDelete, MdEdit } from 'react-icons/md';
import env from '../../../../../.env.json';

var interactionOptions = olInteraction.defaults({ altShiftDragRotate: false, pinchRotate: false, mouseWheelZoom: true });

proj4.defs('EPSG:4326', "+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");

var extent = 180.0;
var tile_size = 512;
var max_zoom = 16;
var resolutions = Array(max_zoom + 1).fill().map((_, i) => (extent / tile_size / Math.pow(2, i)));

var pixel_ratio = parseInt(window.devicePixelRatio) || 1;

var tile_grid = new TileGrid({
  extent: olProj.get('EPSG:4326').getExtent(),
  minZoom: 0,
  maxZoom: max_zoom,
  resolutions: resolutions,
  tileSize: tile_size,
});

var raster_style = 'gbif-natural';
var epsg_4326_raster = new TileLayer({
  source: new TileImageSource({
    projection: 'EPSG:4326',
    url: `${env.BASEMAPS}/4326/omt/{z}/{x}/{y}@${pixel_ratio}x.png?style=${raster_style}`,
    tilePixelRatio: pixel_ratio,
    tileGrid: tile_grid,
    wrapX: true
  }),
});

var wktFormatter = new WKT();
var geoJsonFormatter = new GeoJSON();

const OpenLayersMap = ({ geometryList, onChange }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [vectorSource, setVectorSource] = useState(null);
  const [interactions, setInteractions] = useState({});
  const [tool, setTool] = useState(null); // DRAW, DELETE or null
  const cancelInteraction = () => {
    map.getInteractions().forEach((interaction) => {
      if (interaction instanceof Draw) {
        map.removeInteraction(interaction);
        map.addInteraction(interaction);
      }
    });
  };
  useKeyPressEvent('Escape', cancelInteraction);

  function toggleDelete() {
    disableAll();
    if (tool !== 'DELETE') {
      enableDelete();
      setTool('DELETE');
    } else {
      setTool(null);
    }
  }

  function enableDelete() {
    interactions.select.setActive(true);
    setTool('DELETE');
  }

  function toggleDrawing() {
    disableAll();
    if (tool !== 'DRAW') {
      enableDrawing();
      setTool('DRAW');
    } else {
      setTool(null);
    }
  }

  function enableDrawing() {
    interactions.draw.setActive(true);
    interactions.modify.setActive(true);
    interactions.snap.setActive(true);
  }

  function disableAll() {
    interactions.draw.setActive(false);
    interactions.modify.setActive(false);
    interactions.snap.setActive(false);
    interactions.select.setActive(false);
  }

  useEffect(() => {
    const source = new VectorSource({ wrapX: true });
    const vector = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: '#f1fbff6b'
        }),
        stroke: new Stroke({
          color: '#0099ff',
          width: 4
        }),
      }),
    });


    setVectorSource(source);
    const geometries = getFeaturesFromWktList({ geometry: geometryList });
    source.addFeatures(geometries);
    var map = new Map({
      layers: [epsg_4326_raster, vector],
      target: mapRef.current,
      view: new View({
        center: [0, 0],
        projection: 'EPSG:4326',
        zoom: 2
      }),
      logo: false,
      controls: olControlDefaults({ zoom: false, attribution: true }),
      interactions: interactionOptions,
    });
    setMap(map);

    const draw = new Draw({
      source: source,
      type: 'Polygon',
      active: false
    });
    var modify = new Modify({ source: source });
    var snap = new Snap({ source: source });
    var select = new Select({ source: source });
    map.addInteraction(draw);
    map.addInteraction(snap);
    map.addInteraction(modify);
    map.addInteraction(select);
    setInteractions({ draw, modify, snap, select });
    draw.setActive(false);
    modify.setActive(false);
    snap.setActive(false);
    select.setActive(false);

    draw.on('drawend', (event) => {
      var geometries = [];
      source.forEachFeature(function (f) {
        geometries.push(getFeatureAsWKT(f));
      });
      var latestWkt = getFeatureAsWKT(event.feature);
      geometries.push(latestWkt);

      onChange({ wkt: geometries });
    });
    modify.on('modifyend', _ => {
      setTimeout(() => {
        var geometries = [];
        source.forEachFeature(function (f) {
          geometries.push(getFeatureAsWKT(f));
        });
        onChange({ wkt: geometries });
      });
    });

    select.on('select', function (e) {
      select.getFeatures().forEach(function (selectedFeature) {
        select.getLayer(selectedFeature).getSource().removeFeature(selectedFeature);
      });
      setTimeout(() => {
        var geometries = [];
        source.forEachFeature(function (f) {
          geometries.push(getFeatureAsWKT(f));
        });
        onChange({ wkt: geometries });
      });
    });

    return () => {
      map.removeInteraction(draw);
      map.removeInteraction(modify);
      map.removeInteraction(snap);
      map.removeInteraction(select);
      map.setTarget(null);
    };

  }, [mapRef.current]);

  useEffect(() => {
    if (map) {
      vectorSource.clear();
      const geometries = getFeaturesFromWktList({ geometry: geometryList });
      vectorSource.addFeatures(geometries);
    }
  }, [geometryList]);



  return <div css={css`position: relative;`}>
    <div css={css`position: absolute; top: 0; right: 0; margin: 6px; z-index: 2; font-size: 18px;`}>
      <ButtonGroup css={css`margin-inline-end: 6px; background: white;`}>
        <Button look="primaryOutline" onClick={_ => {
          var view = map.getView();
          view.setZoom(view.getZoom() + 1);
        }}><MdZoomIn /></Button>
        <Button look="primaryOutline" onClick={_ => {
          var view = map.getView();
          view.setZoom(view.getZoom() - 1);
        }}><MdZoomOut /></Button>
      </ButtonGroup>
      <ButtonGroup css={css`background: white;`}>
        <Button look={tool === 'DRAW' ? 'primary' : 'primaryOutline'} onClick={_ => {
          toggleDrawing();
        }}><MdEdit /></Button>
        <Button look={tool === 'DELETE' ? 'primary' : 'primaryOutline'} onClick={_ => {
          toggleDelete();
        }}><MdDelete /></Button>
      </ButtonGroup>
    </div>
    <div ref={mapRef} css={css`height: 250px; width: 100%; z-index: 1;`} />
  </div>
};

function getFeatureAsWKT(feature) {
  const asGeoJson = geoJsonFormatter.writeFeature(feature, { rightHanded: true });
  const rightHandCorrectedFeature = geoJsonFormatter.readFeature(asGeoJson);
  const wkt = wktFormatter.writeFeature(rightHandCorrectedFeature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:4326',
    rightHanded: true,
    decimals: 5
  });
  return wkt;
}

function getFeaturesFromWktList({ geometry }) {
  const geometries = [];
  if (_.isArray(geometry)) {
    for (var i = 0; i < geometry.length; i++) {
      geometries.push(wktFormatter.readFeature(geometry[i], {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326'
      }));
    }
  } else if (typeof geometry === 'string') {
    geometries.push(wktFormatter.readFeature(geometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    }));
  }
  return geometries;
}

export default OpenLayersMap;
