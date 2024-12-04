import { useRef, useEffect, useState } from 'react';
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
import { MdZoomIn, MdZoomOut, MdDelete, MdEdit } from 'react-icons/md';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Feature } from 'ol';

proj4.defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees');

const extent = 180.0;
const tile_size = 512;
const max_zoom = 16;
const resolutions = Array(max_zoom + 1)
  .fill(null)
  .map((_, i) => extent / tile_size / Math.pow(2, i));
let pixel_ratio = 1;
if (typeof window !== 'undefined') {
  pixel_ratio = window?.devicePixelRatio || 1;
}
const tile_grid = new TileGrid({
  extent: olProj.get('EPSG:4326').getExtent(),
  minZoom: 0,
  maxZoom: max_zoom,
  resolutions: resolutions,
  tileSize: tile_size,
});

const raster_style = 'gbif-natural';
const epsg_4326_raster = new TileLayer({
  source: new TileImageSource({
    projection: 'EPSG:4326',
    url: `${
      import.meta.env.PUBLIC_TILE_API
    }/4326/omt/{z}/{x}/{y}@${pixel_ratio}x.png?style=${raster_style}`,
    tilePixelRatio: pixel_ratio,
    tileGrid: tile_grid,
    wrapX: true,
  }),
});

const wktFormatter = new WKT();
const geoJsonFormatter = new GeoJSON();

const OpenLayersMap = ({
  geometryList,
  onChange,
}: {
  geometryList: string[];
  onChange: ({ wkt }: { wkt: string[] }) => void;
}) => {
  const interactionOptions = olInteraction.defaults({
    altShiftDragRotate: false,
    pinchRotate: false,
    mouseWheelZoom: true,
  });
  const mapRef = useRef();
  const [map, setMap] = useState<Map | null>(null);
  const [vectorSource, setVectorSource] = useState<VectorSource | null>(null);
  const [interactions, setInteractions] = useState<{draw: Draw, modify: Modify, snap: Snap, select: Select} | null>(null);
  const [tool, setTool] = useState<string | null>(null); // DRAW, DELETE or null
  const cancelInteraction = () => {
    if (!map) return;
    map.getInteractions().forEach((interaction) => {
      if (interaction instanceof Draw) {
        map.removeInteraction(interaction);
        map.addInteraction(interaction);
      }
    });
  };
  // useKeyPressEvent('Escape', cancelInteraction);

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
    interactions?.select?.setActive(true);
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
    interactions?.draw?.setActive(true);
    interactions?.modify?.setActive(true);
    interactions?.snap?.setActive(true);
  }

  function disableAll() {
    interactions?.draw?.setActive(false);
    interactions?.modify?.setActive(false);
    interactions?.snap?.setActive(false);
    interactions?.select?.setActive(false);
  }

  useEffect(() => {
    if (!mapRef.current) return;
    const source = new VectorSource({ wrapX: true });
    const vector = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: '#f1fbff6b',
        }),
        stroke: new Stroke({
          color: '#0099ff',
          width: 4,
        }),
      }),
    });

    setVectorSource(source);
    const geometries = getFeaturesFromWktList({ geometry: geometryList });
    source.addFeatures(geometries);
    const map = new Map({
      layers: [epsg_4326_raster, vector],
      target: mapRef.current,
      view: new View({
        center: [0, 0],
        projection: 'EPSG:4326',
        zoom: 1,
      }),
      // logo: false,
      controls: olControlDefaults({ zoom: false, attribution: true }),
      interactions: interactionOptions,
    });
    setMap(map);

    const draw = new Draw({
      source: source,
      type: 'Polygon',
      active: false,
    });
    const modify = new Modify({ source: source });
    const snap = new Snap({ source: source });
    const select = new Select({ source: source });
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
      const geometries = [];
      source.forEachFeature(function (f) {
        geometries.push(getFeatureAsWKT(f));
      });
      const latestWkt = getFeatureAsWKT(event.feature);
      geometries.push(latestWkt);

      onChange({ wkt: geometries });
    });
    modify.on('modifyend', () => {
      setTimeout(() => {
        const geometries: string[] = [];
        source.forEachFeature(function (f) {
          geometries.push(getFeatureAsWKT(f));
        });
        onChange({ wkt: geometries });
      });
    });

    select.on('select', function () {
      select.getFeatures().forEach(function (selectedFeature) {
        select.getLayer(selectedFeature).getSource().removeFeature(selectedFeature);
      });
      setTimeout(() => {
        const geometries: string[] = [];
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
      map.setTarget(undefined);
    };
  }, [mapRef]);

  useEffect(() => {
    if (map && vectorSource) {
      vectorSource.clear();
      const geometries = getFeaturesFromWktList({ geometry: geometryList });
      vectorSource.addFeatures(geometries);
    }
  }, [map, vectorSource, geometryList]);

  return (
    <div className="g-relative">
      <div className="g-absolute g-top-0 g-end-0 g-m-2 g-z-10 g-text-lg">
        <ToggleGroup type="single" className="g-me-2 g-bg-white">
          <ToggleGroupItem
            value="ZOOM_IN"
            variant="default"
            onClick={() => {
              if (!map) return;
              const view = map.getView();
              view.setZoom(view.getZoom() + 1);
            }}
          >
            <MdZoomIn />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ZOOM_OUT"
            variant="default"
            onClick={() => {
              if (!map) return;
              const view = map.getView();
              view.setZoom(view.getZoom() - 1);
            }}
          >
            <MdZoomOut />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" className="g-me-2 g-bg-white">
          <ToggleGroupItem
            value="DRAW"
            variant={tool === 'DRAW' ? 'primary' : 'default'}
            onClick={() => {
              toggleDrawing();
            }}
          >
            <MdEdit />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="DELETE"
            variant={tool === 'DELETE' ? 'primary' : 'default'}
            onClick={() => {
              toggleDelete();
            }}
          >
            <MdDelete />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div ref={mapRef} className="g-w-full g-h-[250px]" style={{ zIndex: 1 }} />
    </div>
  );
};

function getFeatureAsWKT(feature: Feature) {
  const asGeoJson = geoJsonFormatter.writeFeature(feature, { rightHanded: true });
  const rightHandCorrectedFeature = geoJsonFormatter.readFeature(asGeoJson);
  const wkt = wktFormatter.writeFeature(rightHandCorrectedFeature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:4326',
    rightHanded: true,
    decimals: 5,
  });
  return wkt;
}

function getFeaturesFromWktList({ geometry }: { geometry: string[] }) {
  const geometries = [];
  if (Array.isArray(geometry)) {
    for (let i = 0; i < geometry.length; i++) {
      geometries.push(
        wktFormatter.readFeature(geometry[i], {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326',
        })
      );
    }
  } else if (typeof geometry === 'string') {
    geometries.push(
      wktFormatter.readFeature(geometry, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326',
      })
    );
  }
  return geometries;
}

export default OpenLayersMap;
