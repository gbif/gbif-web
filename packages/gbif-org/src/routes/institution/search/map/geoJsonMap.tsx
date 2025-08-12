import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorMessage } from '@/components/errorMessage';
import { useConfig } from '@/config/config';
import { isWebglSupported } from '@/utils/isWebglSupported';
import { pixelRatio } from '@/utils/pixelRatio';
import { cn } from '@/utils/shadcn';
import uniqBy from 'lodash/uniqBy';
import maplibre, { Map } from 'maplibre-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

export default function GeoJsonMap({
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
  PopupContent: React.FC<{ feature: GeoJSON.Feature }>;
}) {
  if (isWebglSupported() === false) {
    return (
      <ErrorMessage className="g-m-8">
        <FormattedMessage id="error.webglUnavailable" />
      </ErrorMessage>
    );
  }
  return (
    <ErrorBoundary
      type="BLOCK"
      title={<FormattedMessage id="error.mapFailed" />}
      errorMessage={<FormattedMessage id="error.mapBrowserIssue" />}
      showReportButton={true}
      debugTitle="GeoJsonMap"
      className="g-mt-8 g-me-2"
    >
      <GeoJsonMapContent
        geojson={geojson}
        loading={loading}
        error={error}
        className={className}
        defaultMapSettings={defaultMapSettings}
        PopupContent={PopupContent}
      />
    </ErrorBoundary>
  );
}

function GeoJsonMapContent({
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
  PopupContent: React.FC<{ feature: GeoJSON.Feature }>;
}) {
  const config = useConfig();
  const mapRef = useRef(null);
  const [map, setMap] = useState<Map>();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [content, setContent] = useState([]);
  const [popupLngLat, setPopupLngLat] = useState(null);
  const [zoomEnabled, setZoomEnabled] = useState(false);

  const addLayer = useCallback(
    (map: Map, geojson: GeoJSON.FeatureCollection) => {
      if (!map || !map?.getLayer) return;
      const layer = map.getLayer('clusters');
      if (layer) {
        map.removeLayer('clusters');
        map.removeLayer('cluster-count');
        map.removeLayer('unclustered-point');
      }

      const source = map.getSource('markers');
      if (!source) {
        map.addSource('markers', {
          type: 'geojson',
          data: geojson,
          cluster: true,
          clusterMaxZoom: 12, // Max zoom to cluster points on
          clusterRadius: 30, // Radius of each cluster when clustering points (defaults to 50)
        });
      }

      // get primary color from theme
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'markers',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': config.theme?.primary,
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            12,
            5, // radius when point count is less than 100
            14,
            10,
            16,
          ],
        },
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'markers',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          // 'text-font': ['Noto Sans', 'Roboto'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#fff',
        },
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'markers',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': config.theme?.primary,
          'circle-radius': 7,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });

      map.on('zoomend', function () {
        const center = map.getCenter();
        sessionStorage.setItem('institutionMapZoom', (map.getZoom() + 1).toString());
        sessionStorage.setItem('institutionMapLng', center.lng.toString());
        sessionStorage.setItem('institutionMapLat', center.lat.toString());
      });
      map.on('moveend', function () {
        const center = map.getCenter();
        sessionStorage.setItem('institutionMapZoom', (map.getZoom() + 1).toString());
        sessionStorage.setItem('institutionMapLng', center.lng.toString());
        sessionStorage.setItem('institutionMapLat', center.lat.toString());
      });

      // inspect a cluster on click https://maplibre.org/maplibre-gl-js/docs/examples/cluster/
      map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        const clusterId = features[0].properties.cluster_id;
        const zoom = await map.getSource('markers').getClusterExpansionZoom(clusterId);
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom,
        });
      });

      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
      });

      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the feature, with description HTML from its properties.
      map.on('click', 'unclustered-point', (e) => {
        const features = uniqBy(e.features, (x) => x.properties.key);
        const coordinates = features[0].geometry?.coordinates.slice();

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const popupContent = <PopupContent features={features?.map((x) => x.properties)} />;
        setContent(popupContent);
        setPopupLngLat(coordinates);
      });

      map.on('click', () => setZoomEnabled(true));
      map.on('dblclick', () => setZoomEnabled(true));
      map.on('drag', () => setZoomEnabled(true));
    },
    [config?.theme?.primary]
  );

  // useEffect(() => {
  //   console.log('watch geojson');
  //   if (!map || !map?.getSource || !mapLoaded) return;
  //   const source = map.getSource('markers');
  //   if (source) {
  //     // source.setData(geojson);
  //   }
  // }, [geojson, map, mapLoaded]);

  useEffect(() => {
    if (mapRef.current && !mapLoaded) {
      let zoom = sessionStorage.getItem('institutionMapZoom') || defaultMapSettings?.zoom || 0;
      zoom = Math.min(Math.max(0, +zoom), 20);
      zoom -= 1;

      let lng = sessionStorage.getItem('institutionMapLng') || defaultMapSettings?.lng || 0;
      lng = Math.min(Math.max(-180, +lng), 180);

      let lat = sessionStorage.getItem('institutionMapLat') || defaultMapSettings?.lat || 0;
      lat = Math.min(Math.max(-85, +lat), 85);

      let bounds;
      if (geojson.features.length > 0) {
        // get bounding box of geojson layer
        bounds = geojson.features.reduce((bounds, feature) => {
          return bounds.extend(feature.geometry.coordinates);
        }, new maplibre.LngLatBounds());

        // get center and zoom from bounding box
        const center = bounds.getCenter();
        lng = center.lng;
        lat = center.lat;
      }

      const newMap = new maplibre.Map({
        container: mapRef.current,
        style: `${
          import.meta.env.PUBLIC_WEB_UTILS
        }/map-styles/3857/gbif-raster?styleName=osm&background=%23f3f3f1&language=en&pixelRatio=${pixelRatio}`,
        center: [lng, lat],
        zoom,
      });
      if (bounds) {
        newMap.fitBounds([
          [
            Math.max(-180, bounds.getSouthWest().lng - 5),
            Math.max(-90, bounds.getSouthWest().lat - 5),
          ],
          [
            Math.min(180, bounds.getNorthEast().lng + 5),
            Math.min(90, bounds.getNorthEast().lat + 5),
          ],
        ]);
      }

      newMap.on('load', () => {
        setMap(newMap);
        addLayer(newMap, geojson);
      });

      // disable map zoom when using scroll
      if (!zoomEnabled) {
        newMap.scrollZoom.disable();
      }

      return () => {
        if (newMap?.remove) newMap.remove();
      };
    }
  }, [defaultMapSettings, mapRef, geojson, addLayer, mapLoaded]);

  useEffect(() => {
    if (!map) return;
    if (zoomEnabled) {
      map.scrollZoom.enable();
    } else {
      map.scrollZoom.disable();
    }
  }, [map, zoomEnabled]);

  if (loading) {
    return null;
  }
  if (error) {
    return <ErrorMessage className="g-mb-4">Unable to load map</ErrorMessage>;
  }

  return (
    <>
      {popupLngLat && map && (
        <Popup lngLat={popupLngLat} map={map}>
          {content}
        </Popup>
      )}
      <div
        ref={mapRef}
        style={{ height: '400px' }}
        onClick={() => {
          setZoomEnabled(true);
        }}
        className={cn('[&_button]:g-p-1', className)}
      ></div>
    </>
  );
}

export const Popup = ({
  lngLat,
  map,
  children,
}: {
  lngLat: maplibre.LngLatLike;
  map: maplibre.Map;
  children: React.ReactNode;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (popupRef.current && lngLat && map) {
      const popup = new maplibre.Popup()
        .setLngLat(lngLat)
        .setDOMContent(popupRef.current)
        .addTo(map);

      return () => {
        popup.remove();
      };
    }
  }, [children, lngLat, map]);

  return (
    <div style={{ display: 'none' }}>
      <div ref={popupRef}>{children}</div>
    </div>
  );
};
