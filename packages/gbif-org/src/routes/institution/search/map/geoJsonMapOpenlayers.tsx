import { ErrorMessage } from '@/components/errorMessage';
import { useConfig } from '@/config/config';
import { pixelRatio } from '@/utils/pixelRatio';
import { cn } from '@/utils/shadcn';
import uniqBy from 'lodash/uniqBy';
import { apply } from 'ol-mapbox-style';
import { Attribution } from 'ol/control';
import { GeoJSON } from 'ol/format';
import { defaults as defaultInteractions, MouseWheelZoom } from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import OlMap from 'ol/Map';
import Overlay from 'ol/Overlay';
import { transform, transformExtent } from 'ol/proj';
import { Cluster, Vector as VectorSource } from 'ol/source';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';
import View from 'ol/View';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { MapPopup, type PopupAnchor } from './mapPopup';

export default function GeoJsonMapOpenlayers({
  geojson,
  loading,
  error,
  className,
  defaultMapSettings,
  PopupContent,
}: {
  geojson: GeoJSON.FeatureCollection;
  loading: boolean;
  error: boolean;
  className?: string;
  defaultMapSettings?: { zoom: number; lat: number; lng: number };
  PopupContent: React.FC<{ features: Record<string, any>[] }>;
}) {
  const config = useConfig();
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const mapInstanceRef = useRef<OlMap | null>(null);
  const [popupContent, setPopupContent] = useState<ReactNode>(null);
  const [popupAnchor, setPopupAnchor] = useState<PopupAnchor>('bottom');
  const interactionsEnabledRef = useRef(false);
  const mouseWheelRef = useRef<MouseWheelZoom | null>(null);
  const popupAnchorRef = useRef<PopupAnchor>('bottom');

  const primaryColor = config.theme?.primary ?? '#71b171';

  const enableInteractions = useCallback(() => {
    if (!interactionsEnabledRef.current && mapInstanceRef.current) {
      if (mouseWheelRef.current) {
        mapInstanceRef.current.addInteraction(mouseWheelRef.current);
      }
      interactionsEnabledRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;
    interactionsEnabledRef.current = false;

    // Session storage for restoring position
    let zoom = sessionStorage.getItem('institutionMapZoom') || defaultMapSettings?.zoom || 0;
    zoom = Math.min(Math.max(0, +zoom), 20);
    zoom -= 1;

    let lng = sessionStorage.getItem('institutionMapLng') || defaultMapSettings?.lng || 0;
    lng = Math.min(Math.max(-180, +lng), 180);

    let lat = sessionStorage.getItem('institutionMapLat') || defaultMapSettings?.lat || 0;
    lat = Math.min(Math.max(-85, +lat), 85);

    // Parse GeoJSON features
    const geoJsonFormat = new GeoJSON({
      featureProjection: 'EPSG:3857',
      dataProjection: 'EPSG:4326',
    });
    const features = geoJsonFormat.readFeatures(geojson);

    // Vector source with raw features
    const vectorSource = new VectorSource({
      features,
      wrapX: true,
    });

    // Cluster source
    const clusterSource = new Cluster({
      distance: 30,
      source: vectorSource,
    });

    // Cluster layer with styling
    const clusterLayer = new VectorLayer({
      source: clusterSource,
      style: (feature) => {
        const clusterFeatures = feature.get('features');
        const size = clusterFeatures?.length ?? 0;

        if (size > 1) {
          // Cluster style - radius stepped by count (matching MapLibre config)
          let radius = 12;
          if (size >= 10) radius = 16;
          else if (size >= 5) radius = 14;

          return new Style({
            image: new Circle({
              radius,
              fill: new Fill({ color: primaryColor }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({ color: '#fff' }),
              font: '12px sans-serif',
            }),
          });
        }

        // Single point style
        return new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({ color: primaryColor }),
            stroke: new Stroke({ color: '#fff', width: 1 }),
          }),
        });
      },
    });

    // Popup overlay
    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: false,
      stopEvent: true,
      positioning: 'bottom-center',
      offset: [0, 0],
    });
    overlayRef.current = overlay;

    // Create interactions (added on first user click)
    const mouseWheel = new MouseWheelZoom();
    mouseWheelRef.current = mouseWheel;

    // Center in 3857 projection
    const center3857 = transform([+lng, +lat], 'EPSG:4326', 'EPSG:3857');

    const map = new OlMap({
      target: mapRef.current,
      overlays: [overlay],
      view: new View({
        center: center3857,
        zoom: Math.max(0, +zoom),
        projection: 'EPSG:3857',
      }),
      controls: [new Attribution({ collapsible: true, collapsed: true })],
      interactions: defaultInteractions({
        mouseWheelZoom: false,
        altShiftDragRotate: false,
        pinchRotate: false,
      }),
    });
    mapInstanceRef.current = map;

    // Apply MapBox style for basemap tiles, then add cluster layer on top
    const styleUrl = `${
      import.meta.env.PUBLIC_WEB_UTILS
    }/map-styles/3857/gbif-raster?styleName=osm&background=%23f3f3f1&language=en&pixelRatio=${pixelRatio}`;
    apply(map, styleUrl).then(() => {
      map.addLayer(clusterLayer);
    });

    // Fit bounds to features — match MapLibre behavior:
    // compute bounds in EPSG:4326 from raw GeoJSON, add 5° padding, then transform
    if (geojson.features.length > 0) {
      let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
      for (const feature of geojson.features) {
        const coords = (feature.geometry as GeoJSON.Point).coordinates;
        if (coords[0] < minLng) minLng = coords[0];
        if (coords[1] < minLat) minLat = coords[1];
        if (coords[0] > maxLng) maxLng = coords[0];
        if (coords[1] > maxLat) maxLat = coords[1];
      }
      // Add 5° padding on each side, clamped to valid ranges (matching MapLibre version)
      const paddedExtent = [
        Math.max(-180, minLng - 5),
        Math.max(-90, minLat - 5),
        Math.min(180, maxLng + 5),
        Math.min(90, maxLat + 5),
      ];
      const extent3857 = transformExtent(paddedExtent, 'EPSG:4326', 'EPSG:3857');
      map.getView().fit(extent3857);
    }

    // Recalculate popup anchor direction on every render frame so it flips
    // when the point moves near the edges of the viewport, matching MapLibre's
    // auto-anchor behaviour (top, bottom, left, right, and four corners).
    const EDGE_THRESHOLD = 0.25; // fraction of map dimension
    const updatePopupAnchor = (forceUpdate = false) => {
      const coord = overlay.getPosition();
      if (!coord) return;
      const pixel = map.getPixelFromCoordinate(coord);
      const mapSize = map.getSize();
      if (!pixel || !mapSize) return;

      const nearTop = pixel[1] < mapSize[1] * EDGE_THRESHOLD;
      const nearBottom = pixel[1] > mapSize[1] * (1 - EDGE_THRESHOLD);
      const nearLeft = pixel[0] < mapSize[0] * EDGE_THRESHOLD;
      const nearRight = pixel[0] > mapSize[0] * (1 - EDGE_THRESHOLD);

      // Determine anchor: the anchor tells the popup which side the arrow
      // is on (i.e. the side closest to the point on the map).
      let newAnchor: PopupAnchor;
      let positioning: string;

      if (nearTop && nearLeft) {
        newAnchor = 'top-left';
        positioning = 'top-left';
      } else if (nearTop && nearRight) {
        newAnchor = 'top-right';
        positioning = 'top-right';
      } else if (nearBottom && nearLeft) {
        newAnchor = 'bottom-left';
        positioning = 'bottom-left';
      } else if (nearBottom && nearRight) {
        newAnchor = 'bottom-right';
        positioning = 'bottom-right';
      } else if (nearTop) {
        newAnchor = 'top';
        positioning = 'top-center';
      } else if (nearBottom) {
        newAnchor = 'bottom';
        positioning = 'bottom-center';
      } else if (nearLeft) {
        newAnchor = 'left';
        positioning = 'center-left';
      } else if (nearRight) {
        newAnchor = 'right';
        positioning = 'center-right';
      } else {
        newAnchor = 'bottom';
        positioning = 'bottom-center';
      }

      if (newAnchor !== popupAnchorRef.current || forceUpdate) {
        popupAnchorRef.current = newAnchor;
        overlay.setPositioning(positioning as any);
        setPopupAnchor(newAnchor);
      }
    };
    map.on('postrender', updatePopupAnchor);

    // Save position to session storage on moveend
    map.on('moveend', () => {
      const view = map.getView();
      const center = view.getCenter();
      if (!center) return;
      const [saveLng, saveLat] = transform(center, 'EPSG:3857', 'EPSG:4326');
      const saveZoom = view.getZoom() ?? 0;
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('institutionMapZoom', (saveZoom + 1).toString());
        sessionStorage.setItem('institutionMapLng', saveLng.toString());
        sessionStorage.setItem('institutionMapLat', saveLat.toString());
      }
    });

    // Click handler
    map.on('click', (evt) => {
      let hitFeature = false;
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        hitFeature = true;
        const clusterFeatures = feature.get('features');
        if (!clusterFeatures) return;

        if (clusterFeatures.length > 1) {
          // Cluster click - zoom to fit all features in the cluster
          const view = map.getView();
          const extent = new VectorSource({ features: clusterFeatures }).getExtent();
          view.fit(extent, {
            duration: 300,
            padding: [50, 50, 50, 50],
            maxZoom: 18,
          });
        } else {
          // Single feature click - show popup
          const rawFeatures = clusterFeatures.map((f: any) => f.getProperties());
          const uniqueFeatures = uniqBy(rawFeatures, (x: any) => x.key);

          const geometry = feature.getGeometry();
          if (geometry) {
            const coordinate = geometry.getExtent().slice(0, 2);
            overlay.setPosition(coordinate);
            updatePopupAnchor(true);
            setPopupContent(<PopupContent features={uniqueFeatures} />);
          }
        }
      });

      if (!hitFeature) {
        // Click on empty area - close popup
        overlay.setPosition(undefined);
        setPopupContent(null);
      }

      enableInteractions();
    });

    map.on('dblclick', enableInteractions);

    // Cursor: grab by default, pointer on features, grabbing while dragging
    map.on('pointermove', (evt) => {
      const target = map.getTargetElement();
      if (!target) return;
      if (evt.dragging) {
        target.style.cursor = 'grabbing';
        return;
      }
      let hit = false;
      map.forEachFeatureAtPixel(evt.pixel, () => {
        hit = true;
      });
      target.style.cursor = hit ? 'pointer' : 'grab';
    });

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, [geojson, defaultMapSettings, primaryColor, enableInteractions]);

  if (loading) {
    return null;
  }
  if (error) {
    return <ErrorMessage className="g-mb-4">Unable to load map</ErrorMessage>;
  }

  return (
    <>
      <div
        ref={mapRef}
        style={{ height: '400px' }}
        onClick={enableInteractions}
        className={cn('[&_button]:g-p-1', className)}
      />
      <div
        ref={popupRef}
        style={{ display: popupContent ? undefined : 'none', cursor: 'auto' }}
      >
        <MapPopup
          anchor={popupAnchor}
          onClose={() => {
            overlayRef.current?.setPosition(undefined);
            setPopupContent(null);
          }}
        >
          {popupContent}
        </MapPopup>
      </div>
    </>
  );
}
