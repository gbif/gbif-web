import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorMessage } from '@/components/errorMessage';
import klokantech from '@/components/maps/openlayers/styles/klokantech.json';
import { isWebglSupported } from '@/utils/isWebglSupported';
import { wktToGeoJSON, geoJSONToWKT } from '@/utils/wktHelpers';
import maplibre, { LayerSpecification, Map as MapLibreMapInstance } from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { getLayerConfig } from './getLayerConfig';
import { useMapPosition } from './useMapPosition';
import { AdHocMapInternalProps, OccurrenceOverlay, PointClickData } from './types';
import type { Feature } from 'geojson';
import { AdHocMapCoreProps } from './OpenlayersMap';
import { Theme } from '@/config/theme/theme';
import hash from 'object-hash';
import { useConfig } from '@/config/config';

const { ScaleControl } = maplibre;

const PUBLIC_API_V2 = import.meta.env.PUBLIC_API_V2;
const OCCURRENCE_LAYER_PREFIX = 'occurrences__';

const mapStyles: Record<string, any> = {
  klokantech,
};

function Map(props: AdHocMapCoreProps) {
  const mapPosition = useMapPosition(props.defaultMapSettings);
  const config = useConfig();

  return (
    <>
      {!isWebglSupported() && (
        <ErrorMessage className="g-mt-12">
          <FormattedMessage id="error.webglUnavailable" />
        </ErrorMessage>
      )}
      <ErrorBoundary
        type="BLOCK"
        title={<FormattedMessage id="error.mapFailed" />}
        errorMessage={<FormattedMessage id="error.mapBrowserIssue" />}
        showReportButton={true}
        debugTitle="GeoJsonMap"
        className="g-mt-8 g-me-2"
      >
        <MapLibreMap {...props} mapPosition={mapPosition} theme={config?.theme} />
      </ErrorBoundary>
    </>
  );
}

// Helper to get unique layer/source names for each overlay
function getLayerName(overlayId: string): string {
  return `${OCCURRENCE_LAYER_PREFIX}${overlayId}`;
}

type DrawEvent = {
  features: Feature[];
};

class MapLibreMap extends Component<AdHocMapInternalProps> {
  myRef: React.RefObject<HTMLDivElement>;
  map?: MapLibreMapInstance;
  mapLoaded = false;
  draw: MapboxDraw | null = null;
  isInternalChange = false;

  constructor(props: AdHocMapInternalProps) {
    super(props);

    this.addLayers = this.addLayers.bind(this);
    this.updateLayers = this.updateLayers.bind(this);
    this.onPointClick = this.onPointClick.bind(this);
    this.initializeDrawControl = this.initializeDrawControl.bind(this);
    this.updateFeatures = this.updateFeatures.bind(this);
    this.handleDrawCreate = this.handleDrawCreate.bind(this);
    this.handleDrawUpdate = this.handleDrawUpdate.bind(this);
    this.handleDrawDelete = this.handleDrawDelete.bind(this);
    this.handleDrawSelectionChange = this.handleDrawSelectionChange.bind(this);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const { getStoredPosition } = this.props.mapPosition;
    const position = getStoredPosition({
      maxLat: 85,
      minLat: -85,
    });

    // MapLibre uses zoom-1 internally
    const zoom = position.zoom - 1;

    this.map = new maplibre.Map({
      container: this.myRef.current!,
      style: this.getStyle(),
      zoom,
      center: [position.lng, position.lat],
    });

    this.map.on('load', () => {
      this.addLayers();
      this.initializeDrawControl();
      this.updateFeatures();
    });

    // Add scale control to bottom-left corner
    const scale = new ScaleControl({
      maxWidth: 100,
      unit: 'metric',
    });
    this.map.addControl(scale, 'bottom-left');
  }

  componentWillUnmount() {
    // if (this.draw && this.map) {
    //   this.map.off('draw.create', this.handleDrawCreate);
    //   this.map.off('draw.update', this.handleDrawUpdate);
    //   this.map.off('draw.delete', this.handleDrawDelete);
    //   this.map.off('draw.selectionchange', this.handleDrawSelectionChange);
    //   this.map.removeControl(this.draw);
    // }
    if (this.map) {
      this.map.remove();
    }
  }

  componentDidUpdate(prevProps: AdHocMapInternalProps) {
    // Check if overlays have changed (added, removed, or modified)
    if (this.mapLoaded) {
      const overlaysChanged =
        prevProps.overlays !== this.props.overlays && // quick check
        hash(prevProps.overlays) !== hash(this.props.overlays); // more expensive check

      if (overlaysChanged) {
        this.updateLayers();
      }
    }
    if (prevProps.latestEvent !== this.props.latestEvent && this.mapLoaded) {
      if (this.props.latestEvent?.type === 'ZOOM_IN') {
        this.map?.zoomIn();
      } else if (this.props.latestEvent?.type === 'ZOOM_OUT') {
        this.map?.zoomOut();
      } else if (this.props.latestEvent?.type === 'ZOOM_TO') {
        this.map?.flyTo({
          center: [this.props.latestEvent.lng, this.props.latestEvent.lat],
          zoom: this.props.latestEvent.zoom,
          essential: true,
        });
      } else if (this.props.latestEvent?.type === 'EXPLORE_AREA') {
        this.exploreArea();
      }
    }
    if (
      (prevProps.containerHeight !== this.props.containerHeight ||
        prevProps.containerWidth !== this.props.containerWidth) &&
      this.mapLoaded
    ) {
      this.map?.resize();
    }
    if (prevProps.mapConfig !== this.props.mapConfig && this.mapLoaded) {
      this.map?.setStyle(this.getStyle());
      setTimeout(() => this.updateLayers(), 500);
    }

    // Update features when they change (but only if not caused by our own draw events)
    if (prevProps.features !== this.props.features && this.mapLoaded && this.draw) {
      if (!this.isInternalChange) {
        this.updateFeatures();
      } else {
        // Reset the flag after handling the internal change
        this.isInternalChange = false;
      }
    }

    // Handle drawing tool changes
    if (prevProps.drawingTool !== this.props.drawingTool && this.mapLoaded && this.draw) {
      this.updateDrawingMode();
    }
  }

  initializeDrawControl() {
    if (!this.map || this.draw) return;

    // Register custom modes
    const modes = MapboxDraw.modes as any; // Else we get warnings since we are adding to it
    modes.static = StaticMode;

    // Initialize MapboxDraw
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {},
      modes: modes,
      styles: [
        // Polygon fill - inactive
        {
          id: 'gl-draw-polygon-fill-inactive',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'false']],
          paint: {
            'fill-color': '#f1fbff6b',
            'fill-opacity': 1,
          },
        },
        // Polygon fill - active (editing)
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
          paint: {
            'fill-color': '#fbb03b33',
            'fill-opacity': 1,
          },
        },
        // Polygon outline
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon']],
          paint: {
            'line-color': '#0099ff',
            'line-width': 4,
          },
        },
        // Vertex points
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 5,
            'circle-color': '#0099ff',
          },
        },
        // Midpoint vertices (between vertices in edit mode)
        {
          id: 'gl-draw-polygon-midpoint',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
          paint: {
            'circle-radius': 4,
            'circle-color': '#ffffff',
            'circle-stroke-color': '#0099ff',
            'circle-stroke-width': 2,
          },
        },
        // Line being drawn (shows after first point)
        {
          id: 'gl-draw-line-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
          paint: {
            'line-color': '#0099ff',
            'line-dasharray': [2, 2],
            'line-width': 2,
          },
        },

        // First vertex point (shows immediately when drawing starts)
        {
          id: 'gl-draw-point-active',
          type: 'circle',
          filter: [
            'all',
            ['==', '$type', 'Point'],
            ['==', 'active', 'true'],
            ['!=', 'meta', 'midpoint'],
          ],
          paint: {
            'circle-radius': 5,
            'circle-color': '#0099ff',
          },
        },
      ],
    });

    this.map.addControl(this.draw, 'top-left');

    // Start in static mode (no interaction, display only)
    this.draw.changeMode('static');

    // Add event listeners
    this.map.on('draw.create', this.handleDrawCreate);
    this.map.on('draw.update', this.handleDrawUpdate);
    this.map.on('draw.delete', this.handleDrawDelete);
    this.map.on('draw.selectionchange', this.handleDrawSelectionChange);
  }

  updateFeatures() {
    if (!this.draw || !this.props.features) return;

    // Clear existing features
    this.draw.deleteAll();

    // Add features from props
    const features = this.props.features || [];
    features.forEach((wktString) => {
      const feature = wktToGeoJSON(wktString);
      if (feature) {
        this.draw!.add(feature);
      }
    });

    // After adding features, ensure we're in the correct mode based on current tool
    // If no tool is active, use static mode (completely non-interactive)
    this.draw.changeMode('static');
    if (this.props.onDrawingToolChange) {
      this.props.onDrawingToolChange(null);
    }
  }

  updateDrawingMode() {
    if (!this.draw) return;

    const { drawingTool, onDrawingToolChange } = this.props;

    // Change the draw mode based on the active tool
    if (drawingTool === 'DRAW') {
      this.draw.changeMode('draw_polygon');
    } else if (drawingTool === 'SELECT') {
      // Only allow direct_select (vertex editing) when SELECT tool is active
      const features = this.draw.getAll().features;
      if (features.length > 0 && !!features[0]?.id) {
        // this gives a typescript error, but seems to be inline with the API docs: https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#changemodemode-string-options-object-draw
        this.draw.changeMode('direct_select', {
          featureId: features[0]?.id,
        });
      } else {
        // No features to select, stay in static mode
        this.draw.changeMode('static');
        if (onDrawingToolChange) {
          onDrawingToolChange(null);
        }
      }
    } else if (drawingTool === 'DELETE') {
      // For DELETE tool, use simple_select so user can click to select what to delete
      const features = this.draw.getAll().features;
      if (features.length > 0) {
        this.draw.changeMode('simple_select');
      } else {
        // No features to select, stay in static mode
        this.draw.changeMode('static');
        if (onDrawingToolChange) {
          onDrawingToolChange(null);
        }
      }
    } else {
      // No tool active - use static mode (completely non-interactive, display only)
      // This prevents any selection or editing when tools are not active
      this.draw.changeMode('static');
    }
  }

  handleDrawCreate() {
    this.isInternalChange = true;
    this.notifyFeaturesChanged();

    // After creating a feature, MapboxDraw switches to simple_select mode automatically
    // for some reason this fails if not wrapped in a timeout
    setTimeout(() => {
      if (!this.draw) return;
      this.draw.changeMode('static');
      if (this.props.onDrawingToolChange) {
        this.props.onDrawingToolChange(null);
      }
    }, 0);
  }

  handleDrawUpdate() {
    this.isInternalChange = true;
    this.notifyFeaturesChanged();
  }

  handleDrawDelete() {
    // This may be triggered by MapboxDraw's built-in delete operations
    // (e.g., pressing Delete/Backspace key while a feature is selected)
    this.isInternalChange = true;
    this.notifyFeaturesChanged();
    if (!this.draw) return;
    const features = this.draw.getAll().features;
    if (features.length === 0) {
      this.draw.changeMode('static');
      if (this.props.onDrawingToolChange) {
        this.props.onDrawingToolChange(null);
      }
    }
  }

  handleDrawSelectionChange(e: DrawEvent) {
    // If we're in DELETE mode and a feature was selected, delete it immediately
    if (this.props.drawingTool === 'DELETE' && e.features.length > 0 && this.draw) {
      const featureIds = e.features.map((f) => f.id);
      featureIds.forEach((id) => {
        if (id !== undefined) {
          this.draw!.delete(id as string);
        }
      });

      // Mark as internal change and notify
      this.isInternalChange = true;
      this.notifyFeaturesChanged();

      // for some reason this fails if not wrapped in a timeout
      setTimeout(() => {
        if (!this.draw) return;
        const features = this.draw.getAll().features;
        if (features.length === 0) {
          this.draw.changeMode('static');
          if (this.props.onDrawingToolChange) {
            this.props.onDrawingToolChange(null);
          }
        }
      }, 0);
    }
  }

  notifyFeaturesChanged() {
    if (!this.draw || !this.props.onFeaturesChange) return;

    const allFeatures = this.draw.getAll();
    const wktStrings = allFeatures.features
      .map((feature) => geoJSONToWKT(feature))
      .filter((wkt): wkt is string => wkt !== null);

    this.props.onFeaturesChange({ features: wktStrings });
  }

  exploreArea() {
    // get the current view of the map as a bounding box and send it to the parent component
    const { listener } = this.props;
    if (!listener || typeof listener !== 'function' || !this.map) return;
    // get extent of the map view
    const bounds = this.map.getBounds();
    listener({
      type: 'EXPLORE_AREA',
      bbox: {
        top: bounds.getNorth(),
        left: bounds.getWest(),
        bottom: bounds.getSouth(),
        right: bounds.getEast(),
      },
    });
  }

  getStyle(): string | any {
    const basemapStyle = this.props.mapConfig?.basemapStyle || 'klokantech';
    const layerStyle = mapStyles[basemapStyle];
    return layerStyle || this.props.mapConfig?.basemapStyle;
  }

  getOccurrenceLayers(): LayerSpecification[] {
    const map = this.map;
    if (!map) return [];

    const style = map.getStyle();
    return style.layers.filter((layer) => layer.id.startsWith(OCCURRENCE_LAYER_PREFIX));
  }

  updateLayers() {
    const map = this.map;
    if (!map) return;

    // const newOverlays = this.props.overlays || [];
    // const occurrenceLayers = this.getOccurrenceLayers();
    // // Remove layers that are no longer in overlays
    // occurrenceLayers.forEach((layer) => {
    //   const layerName = layer.id;
    //   const overlayId = layerName.replace(OCCURRENCE_LAYER_PREFIX, '');
    //   const stillExists = newOverlays.find((o) => o.id === overlayId);
    //   if (!stillExists) {
    //     // we should delete the layer since it no longer exists
    //     const mapLayer = map.getLayer(layerName);
    //     if (mapLayer) {
    //       const sourceName = mapLayer.source;
    //       this.map!.removeLayer(layerName);
    //       if (this.map!.getSource(sourceName)) {
    //         this.map!.removeSource(sourceName);
    //       }
    //     }
    //   }
    // });
    // // Add or update layers
    // newOverlays.forEach((overlay, index) => {
    //   const layerName = getLayerName(overlay.id);
    //   const existingLayer = map.getLayer(layerName);
    //   if (existingLayer) {
    //     // Layer exists - check if it needs to be updated
    //     // ...
    //   } else {
    //     this.addSingleLayer(overlay);
    //   }
    // });

    // Simplest approach seem to perform fine here: remove all existing occurrence layers and re-add
    // more optimized might be to diff and only add/remove changed layers
    const occurrenceLayers = this.getOccurrenceLayers();
    occurrenceLayers.forEach((layer) => {
      const layerName = layer.id;
      const mapLayer = map.getLayer(layerName);
      if (mapLayer) {
        const sourceName = mapLayer.source;
        this.map!.removeLayer(layerName);
        if (this.map!.getSource(sourceName)) {
          this.map!.removeSource(sourceName);
        }
      }
    });
    this.addLayers();
  }

  onPointClick(pointData: PointClickData) {
    if (this.props.onPointClick) {
      this.props.onPointClick(pointData);
    }
  }

  getMergedTheme(overlay: OccurrenceOverlay): Partial<Theme> {
    return {
      ...this.props.theme,
      ...(overlay.style || {}),
    };
  }

  addSingleLayer(overlay: OccurrenceOverlay) {
    if (!this.map) return;

    const layerName = getLayerName(overlay.id);

    const tileString = `${PUBLIC_API_V2}/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&srs=EPSG%3A3857&squareSize=256&predicateHash=${
      overlay.predicateHash ?? ''
    }${overlay.q ? `&q=${overlay.q}` : ''}`;

    // Get merged theme for this overlay
    const layerTheme = this.getMergedTheme(overlay);

    this.map.addLayer(
      getLayerConfig({
        tileString,
        theme: layerTheme,
        layerName,
      })
    );

    // Set visibility based on hidden property
    if (overlay.hidden) {
      this.map.setLayoutProperty(layerName, 'visibility', 'none');
    }
  }

  addLayers() {
    if (!this.map) return;

    try {
      const overlays = this.props.overlays || [];

      // Add each overlay as a separate layer with proper z-index
      overlays.forEach((overlay) => {
        this.addSingleLayer(overlay);
      });

      const map = this.map;
      if (!this.mapLoaded) {
        const { savePosition } = this.props.mapPosition;

        const saveCurrentPosition = () => {
          const center = map.getCenter();
          savePosition({
            zoom: map.getZoom() + 1,
            lng: center.lng,
            lat: center.lat,
          });
        };

        map.on('zoomend', saveCurrentPosition);
        map.on('moveend', saveCurrentPosition);

        // Add event handlers for all overlay layers
        const setupLayerEvents = (layerName: string) => {
          map.on('mouseenter', layerName, () => {
            // Don't handle point clicks when drawing tools are active
            if (this.props.drawingTool) {
              return;
            }
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('click', layerName, (e) => {
            // Don't handle point clicks when drawing tools are active
            if (this.props.drawingTool) {
              return;
            }
            const overlays = this.props.overlays || [];
            const layerId = layerName.replace(OCCURRENCE_LAYER_PREFIX, '');

            if (e.features && e.features[0]) {
              this.onPointClick({
                geohash: e.features[0].properties?.geohash,
                count: e.features[0].properties?.count,
                layerId,
                predicate: overlays?.find((o) => o.id === layerId)?.predicate,
              });
            }
            e.preventDefault();
          });

          map.on('mouseleave', layerName, function () {
            map.getCanvas().style.cursor = '';
          });
        };

        // Set up events for initial layers
        const overlays = this.props.overlays || [];
        overlays.forEach((overlay) => {
          setupLayerEvents(getLayerName(overlay.id));
        });

        // Store the setup function for use when layers are added later
        // (this.map as any)._setupLayerEvents = setupLayerEvents;

        map.on('click', (clickEvent) => {
          if (!clickEvent._defaultPrevented && this.props.onMapClick) {
            this.props.onMapClick();
          }
        });

        map.on('error', (errorEvent) => {
          if (errorEvent?.error?.status === 400 && this.props.registerPredicate) {
            this.props.registerPredicate();
          } else if (errorEvent.type === 'error' && this.props.onTileError) {
            this.props.onTileError();
          }
        });

        map.on('dataloading', () => {
          if (this.props.onLoading) {
            this.props.onLoading(true);
          }
        });

        map.on('idle', () => {
          if (this.props.onLoading) {
            this.props.onLoading(false);
          }
        });
      }
      this.mapLoaded = true;
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { style = {}, className } = this.props;

    return <div ref={this.myRef} className={className} style={style} />;
  }
}

export default Map;
