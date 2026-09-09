import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import { pixelRatio } from '@/utils/pixelRatio';
import { defaults as olControlDefaults } from 'ol/control';
import * as olInteraction from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer.js';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import * as olProj from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source.js';
import ImageTile from 'ol/source/ImageTile';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import TileGrid from 'ol/tilegrid/TileGrid';
import View from 'ol/View.js';
import { useEffect, useRef } from 'react';

// Map tiling setup mirrors components/maps/geojsonMap/GeoJsonMap.tsx.
const extent = 180.0;
const tile_size = 512;
const max_zoom = 16;
const resolutions = Array(max_zoom + 1)
  .fill(null)
  .map((_, i) => extent / tile_size / Math.pow(2, i));
const tile_grid = new TileGrid({
  extent: olProj.get('EPSG:4326')?.getExtent() || [-90, -90, 90, 90],
  minZoom: 0,
  resolutions,
  tileSize: tile_size,
});

export type MapPoint = { id: string; lat: number; lon: number };

type Props = {
  points: MapPoint[];
  /** tip id -> colour. Read live from a ref so recolouring doesn't require re-adding features. */
  colourById?: Record<string, string>;
  hoveredId?: string | null;
  selectedIds?: Set<string>;
  onHoverTip?: (id: string | null) => void;
  onSelectTip?: (id: string) => void;
  height?: number;
};

/**
 * A point map linked to the phylogeny: one dot per occurrence, coloured by its tree tip
 * (nucleotideSequenceID). Hovering/clicking a dot reports its id upward; `hoveredId`/`selectedIds`
 * drive highlight styling. Kept separate from the shared GeoJsonMap so per-feature colour +
 * interactions don't complicate that component.
 */
export function ColoredPointMap({
  points,
  colourById,
  hoveredId,
  selectedIds,
  onHoverTip,
  onSelectTip,
  height = 500,
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<Map | null>(null);
  const layerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const { theme } = useConfig();
  const { locale } = useI18n();

  // Latest interaction state in refs so the style function (which OL calls on redraw) can read it
  // without rebuilding the map.
  const stateRef = useRef({ colourById, hoveredId, selectedIds, onHoverTip, onSelectTip });
  stateRef.current = { colourById, hoveredId, selectedIds, onHoverTip, onSelectTip };

  // Build the map once.
  useEffect(() => {
    if (!mapRef.current) return;

    const raster = new TileLayer({
      source: new ImageTile({
        projection: 'EPSG:4326',
        url: `${import.meta.env.PUBLIC_TILE_API}/4326/omt/{z}/{x}/{y}@${pixelRatio}x.png?style=gbif-natural-${
          locale.mapTileLocale ?? 'en'
        }`,
        tileSize: tile_size * pixelRatio,
        tileGrid: tile_grid,
        wrapX: true,
        attributions: [
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://openmaptiles.org/">OpenMapTiles</a>, <a href="/citation-guidelines">GBIF</a>.',
        ],
      }),
    });

    const source = new VectorSource({ wrapX: true });
    const layer = new VectorLayer({
      source,
      style: (feature) => {
        const id = feature.get('id') as string;
        const { colourById, hoveredId, selectedIds } = stateRef.current;
        const colour = colourById?.[id] || theme?.primary500 || '#1a73e8';
        const isHovered = !!hoveredId && id === hoveredId;
        const isSelected = !!selectedIds?.has(id);
        const active = isHovered || isSelected;
        return new Style({
          image: new Circle({
            radius: active ? 8 : 5,
            fill: new Fill({ color: colour }),
            stroke: new Stroke({
              color: active ? '#111' : '#ffffffcc',
              width: active ? 2 : 1,
            }),
          }),
          zIndex: active ? 2 : 1,
        });
      },
    });
    layerRef.current = layer;

    const map = new Map({
      layers: [raster, layer],
      target: mapRef.current,
      view: new View({ center: [0, 0], projection: 'EPSG:4326', zoom: 1 }),
      controls: olControlDefaults({ zoom: true, attribution: true }),
      interactions: olInteraction.defaults({ altShiftDragRotate: false, pinchRotate: false }),
    });
    mapObj.current = map;

    const pick = (pixel: number[]) =>
      map.forEachFeatureAtPixel(pixel, (f) => f as Feature) as Feature | undefined;

    map.on('pointermove', (e) => {
      const f = pick(e.pixel);
      map.getTargetElement().style.cursor = f ? 'pointer' : '';
      stateRef.current.onHoverTip?.(f ? (f.get('id') as string) : null);
    });
    map.on('click', (e) => {
      const f = pick(e.pixel);
      if (f) stateRef.current.onSelectTip?.(f.get('id') as string);
    });

    return () => {
      map.setTarget(undefined);
      mapObj.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Load / update points and fit the view when the point set changes.
  useEffect(() => {
    const layer = layerRef.current;
    const map = mapObj.current;
    if (!layer || !map) return;
    const source = layer.getSource()!;
    source.clear();
    const features = points
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon))
      .map((p) => {
        const f = new Feature({ geometry: new Point([p.lon, p.lat]) });
        f.set('id', p.id);
        return f;
      });
    source.addFeatures(features);
    const ext = source.getExtent();
    if (features.length > 0 && ext.every((c) => Number.isFinite(c))) {
      map.getView().fit(ext, { padding: [20, 20, 20, 20], maxZoom: 10 });
    }
  }, [points]);

  // Re-style on colour / hover / selection change (all read from the ref inside the style fn).
  useEffect(() => {
    layerRef.current?.changed();
  }, [colourById, hoveredId, selectedIds]);

  return <div ref={mapRef} className="g-w-full g-bg-white" style={{ height }} />;
}
