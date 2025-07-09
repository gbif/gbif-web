import { useConfig } from '@/config/config';
import { Attribution, defaults as olControlDefaults } from 'ol/control';
import { GeoJSON } from 'ol/format';
import * as olInteraction from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer.js';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import * as olProj from 'ol/proj';
import { Vector as VectorSource } from 'ol/source.js';
import ImageTile from 'ol/source/ImageTile';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import TileGrid from 'ol/tilegrid/TileGrid';
import View from 'ol/View.js';
import proj4 from 'proj4';
import { useEffect, useRef, useState } from 'react';

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
  extent: olProj.get('EPSG:4326')?.getExtent() || [-90, -90, 90, 90],
  minZoom: 0,
  resolutions: resolutions,
  tileSize: tile_size,
});

const geoJsonFormatter = new GeoJSON();

/**
 * Generate a GeoJSON Point feature from latitude and longitude coordinates
 * @param lat - Latitude in decimal degrees
 * @param lon - Longitude in decimal degrees
 * @param properties - Optional properties to include in the feature
 * @returns GeoJSON Point feature
 */
export function generatePointGeoJson({
  lat,
  lon,
  properties = {},
}: {
  lat: number;
  lon: number;
  properties?: Record<string, any>;
}): GeoJSON.Feature {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lon, lat], // GeoJSON uses [longitude, latitude]
    },
    properties: properties,
  };
}

interface GeoJsonMapProps {
  geoJson?: GeoJSON.Feature; // | GeoJSON.FeatureCollection;
  className?: string;
  height?: string;
  initialCenter?: [number, number]; // [longitude, latitude] in EPSG:4326
  initialZoom?: number;
  rasterStyle?:
    | 'gbif-classic'
    | 'gbif-light'
    | 'gbif-middle'
    | 'gbif-dark'
    | 'gbif-geyser'
    | 'gbif-tuatara'
    | 'gbif-violet'
    | 'osm-bright'
    | 'gbif-natural';
  fillColor?: string;
  strokeColor?: string;
}

export function GeoJsonMap({
  geoJson,
  className = '',
  height = '400px',
  initialCenter,
  initialZoom = 1,
  rasterStyle = 'gbif-natural',
  fillColor = '#f1fbff6b',
  strokeColor = '#0099ff',
}: GeoJsonMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [vectorSource, setVectorSource] = useState<VectorSource | null>(null);
  const { theme } = useConfig();

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const epsg_4326_raster = new TileLayer({
      source: new ImageTile({
        projection: 'EPSG:4326',
        url: `${
          import.meta.env.PUBLIC_TILE_API
        }/4326/omt/{z}/{x}/{y}@${pixel_ratio}x.png?style=${rasterStyle}`,
        tileSize: tile_size * pixel_ratio,
        tileGrid: tile_grid,
        wrapX: true,
        attributions: [
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://openmaptiles.org/">OpenMapTiles</a>, <a href="/citation-guidelines">GBIF</a>.',
        ],
      }),
    });

    const source = new VectorSource({ wrapX: true });
    const vector = new VectorLayer({
      source: source,
      style: (feature) => {
        const geometry = feature.getGeometry();
        const geometryType = geometry?.getType();

        if (geometryType === 'Point') {
          // Style for point features - show as a circle marker
          return new Style({
            image: new Circle({
              radius: 10,
              fill: new Fill({
                color: theme?.primary500, // Use theme color
              }),
              stroke: new Stroke({
                color: theme?.primary100,
                width: 3,
              }),
            }),
          });
        } else {
          // Style for polygon/line features
          return new Style({
            fill: new Fill({
              color: fillColor,
            }),
            stroke: new Stroke({
              color: strokeColor,
              width: 2,
            }),
          });
        }
      },
    });

    setVectorSource(source);

    const interactionOptions = olInteraction.defaults({
      altShiftDragRotate: false,
      pinchRotate: false,
      mouseWheelZoom: true,
      doubleClickZoom: true,
      dragPan: true,
    });

    const newMap = new Map({
      layers: [epsg_4326_raster, vector],
      target: mapRef.current,
      view: new View({
        center: initialCenter ?? [0, 0],
        projection: 'EPSG:4326',
        zoom: initialZoom,
      }),
      controls: olControlDefaults({
        zoom: true,
        attribution: true,
      }).extend([
        new Attribution({
          collapsible: true,
          collapsed: true,
        }),
      ]),
      interactions: interactionOptions,
    });

    setMap(newMap);

    return () => {
      newMap.setTarget(undefined);
    };
  }, [initialCenter, initialZoom, rasterStyle, fillColor, strokeColor, theme]);

  useEffect(() => {
    if (!map || !vectorSource || !geoJson) {
      return;
    }

    try {
      vectorSource.clear();

      // Parse GeoJSON and add features
      const features = geoJsonFormatter.readFeatures(geoJson, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326',
      });

      if (features.length === 0) {
        return;
      }

      vectorSource.addFeatures(features);

      // Fit the view to the features if they exist
      const extent = vectorSource.getExtent();

      if (extent && extent.every((coord) => isFinite(coord))) {
        map.getView().fit(extent, {
          padding: [20, 20, 20, 20],
          maxZoom: 10,
        });
      }
    } catch (error) {
      console.error('Error parsing GeoJSON:', error);
    }
  }, [map, vectorSource, geoJson]);

  return (
    <div className={`g-w-full ${className}`} style={{ height }}>
      <div ref={mapRef} className="g-w-full g-h-full" />
    </div>
  );
}
