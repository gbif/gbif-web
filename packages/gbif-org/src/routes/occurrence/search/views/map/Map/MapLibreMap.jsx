import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorMessage } from '@/components/errorMessage';
import klokantech from '@/components/maps/openlayers/styles/klokantech.json';
import { isWebglSupported } from '@/utils/isWebglSupported';
import { wktToGeoJSON, geoJSONToWKT } from '@/utils/wktHelpers';
import maplibre from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { getLayerConfig } from './getLayerConfig';
import { useMapPosition } from './useMapPosition';

const PUBLIC_API_V2 = import.meta.env.PUBLIC_API_V2;

const mapStyles = {
  klokantech,
};

function Map(props) {
  const mapPosition = useMapPosition(props.defaultMapSettings);

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
        <MapLibreMap {...props} mapPosition={mapPosition} />
      </ErrorBoundary>
    </>
  );
}

class MapLibreMap extends Component {
  constructor(props) {
    super(props);

    this.addLayer = this.addLayer.bind(this);
    this.updateLayer = this.updateLayer.bind(this);
    this.onPointClick = this.onPointClick.bind(this);
    this.initializeDrawControl = this.initializeDrawControl.bind(this);
    this.updateFeatures = this.updateFeatures.bind(this);
    this.handleDrawCreate = this.handleDrawCreate.bind(this);
    this.handleDrawUpdate = this.handleDrawUpdate.bind(this);
    this.handleDrawDelete = this.handleDrawDelete.bind(this);
    this.myRef = React.createRef();
    this.state = { loadDiff: 0 };
    this.draw = null;
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
      container: this.myRef.current,
      style: this.getStyle(),
      zoom,
      center: [position.lng, position.lat],
    });

    this.map.on('load', () => {
      this.addLayer();
      this.initializeDrawControl();
      this.updateFeatures();
    });
  }

  componentWillUnmount() {
    if (this.draw && this.map) {
      this.map.off('draw.create', this.handleDrawCreate);
      this.map.off('draw.update', this.handleDrawUpdate);
      this.map.off('draw.delete', this.handleDrawDelete);
      this.map.removeControl(this.draw);
    }
    if (this.map) this.map.remove();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query && this.mapLoaded) {
      this.updateLayer();
    }
    if (prevProps.latestEvent !== this.props.latestEvent && this.mapLoaded) {
      if (this.props.latestEvent?.type === 'ZOOM_IN') {
        this.map.zoomIn();
      } else if (this.props.latestEvent?.type === 'ZOOM_OUT') {
        this.map.zoomOut();
      } else if (this.props.latestEvent?.type === 'ZOOM_TO') {
        this.map.flyTo({
          center: [this.props.latestEvent.lng, this.props.latestEvent.lat],
          zoom: this.props.latestEvent.zoom,
          essential: true,
        });
      } else if (this.props.latestEvent?.type === 'EXPLORE_AREA') {
        this.exploreArea();
      }
    }
    if (
      (prevProps.height !== this.props.height || prevProps.width !== this.props.width) &&
      this.mapLoaded
    ) {
      this.map.resize();
    }
    if (prevProps.mapConfig !== this.props.mapConfig && this.mapLoaded) {
      this.map.setStyle(this.getStyle());
      setTimeout(() => this.updateLayer(), 500);
    }

    // Update features when they change
    if (prevProps.features !== this.props.features && this.mapLoaded && this.draw) {
      this.updateFeatures();
    }

    // Handle drawing tool changes
    if (prevProps.drawingTool !== this.props.drawingTool && this.mapLoaded && this.draw) {
      this.updateDrawingMode();
    }
  }

  initializeDrawControl() {
    if (!this.map || this.draw) return;

    // Register custom modes
    const modes = MapboxDraw.modes;
    modes.static = StaticMode;

    // Initialize MapboxDraw
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {},
      modes: modes,
      styles: [
        // Polygon fill
        {
          id: 'gl-draw-polygon-fill',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': '#f1fbff6b',
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
        // Polygon and line vertices
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
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
        this.draw.add(feature);
      }
    });

    // After adding features, ensure we're in the correct mode based on current tool
    // If no tool is active, use static mode (completely non-interactive)
    if (!this.props.drawingTool) {
      this.draw.changeMode('static');
    } else {
      // Tool is active, update to the appropriate mode
      this.updateDrawingMode();
    }
  }

  updateDrawingMode() {
    if (!this.draw) return;

    const { drawingTool } = this.props;

    // Change the draw mode based on the active tool
    if (drawingTool === 'DRAW') {
      this.draw.changeMode('draw_polygon');
    } else if (drawingTool === 'SELECT') {
      // Only allow direct_select (vertex editing) when SELECT tool is active
      const features = this.draw.getAll().features;
      if (features.length > 0) {
        this.draw.changeMode('direct_select', {
          featureId: features[0].id,
        });
      } else {
        // No features to select, stay in static mode
        this.draw.changeMode('static');
      }
    } else if (drawingTool === 'DELETE') {
      // For DELETE tool, use simple_select so user can click to select what to delete
      this.draw.changeMode('simple_select');
    } else {
      // No tool active - use static mode (completely non-interactive, display only)
      // This prevents any selection or editing when tools are not active
      this.draw.changeMode('static');
    }
  }

  handleDrawCreate(e) {
    this.notifyFeaturesChanged();
  }

  handleDrawUpdate(e) {
    this.notifyFeaturesChanged();
  }

  handleDrawDelete(e) {
    this.notifyFeaturesChanged();

    // If we're in delete mode and deleted a feature, clear the selection
    if (this.props.drawingTool === 'DELETE') {
      // Reset to simple_select after deletion
      setTimeout(() => {
        if (this.draw && this.props.onDrawingToolChange) {
          this.props.onDrawingToolChange(null);
        }
      }, 0);
    }
  }

  notifyFeaturesChanged() {
    if (!this.draw || !this.props.onFeaturesChange) return;

    const allFeatures = this.draw.getAll();
    const wktStrings = allFeatures.features
      .map((feature) => geoJSONToWKT(feature))
      .filter((wkt) => wkt !== null);

    this.props.onFeaturesChange({ features: wktStrings });
  }

  exploreArea() {
    const { listener } = this.props;
    if (!listener || typeof listener !== 'function') return;

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

  getStyle() {
    const basemapStyle = this.props.mapConfig?.basemapStyle || 'klokantech';
    const layerStyle = mapStyles[basemapStyle];
    return layerStyle || this.props.mapConfig?.basemapStyle;
  }

  updateLayer() {
    const layer = this.map.getLayer('occurrences');
    if (layer) {
      this.map.removeLayer('occurrences');
      this.map.removeSource('occurrences');
      this.addLayer();
    } else {
      this.addLayer();
    }
  }

  onPointClick(pointData) {
    this.props.onPointClick(pointData);
  }

  addLayer() {
    try {
      this.state.loadDiff = 0;
      var tileString = `${PUBLIC_API_V2}/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&srs=EPSG%3A3857&squareSize=256&predicateHash=${
        this.props.predicateHash ?? ''
      }&${this.props.q ? `&q=${this.props.q} ` : ''}`;

      this.map.addLayer(getLayerConfig({ tileString, theme: this.props.theme }));

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

        map.on('mouseenter', 'occurrences', (e) => {
          // Don't handle point clicks when drawing tools are active
          if (this.props.drawingTool) {
            return;
          }
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('click', 'occurrences', (e) => {
          // Don't handle point clicks when drawing tools are active
          if (this.props.drawingTool) {
            return;
          }

          this.onPointClick({
            geohash: e.features[0].properties.geohash,
            count: e.features[0].properties.count,
          });
          e.preventDefault();
        });

        map.on('mouseleave', 'occurrences', function () {
          map.getCanvas().style.cursor = '';
        });

        map.on('click', (e) => {
          if (!e._defaultPrevented && this.props.onMapClick) this.props.onMapClick();
        });

        map.on('error', (e) => {
          if (e?.error?.status === 400 && this.props.registerPredicate) {
            this.props.registerPredicate();
          } else if (e.type === 'error' && this.props.onTileError) {
            this.props.onTileError();
          }
        });

        map.on('dataloading', (e) => {
          this.props.onLoading(true);
        });

        map.on('idle', (e) => {
          this.props.onLoading(false);
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
