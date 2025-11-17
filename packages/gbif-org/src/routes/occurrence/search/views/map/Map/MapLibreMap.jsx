import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorMessage } from '@/components/errorMessage';
import klokantech from '@/components/maps/openlayers/styles/klokantech.json';
import { isWebglSupported } from '@/utils/isWebglSupported';
import maplibre from 'maplibre-gl';
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
    this.myRef = React.createRef();
    this.state = { loadDiff: 0 };
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
    // this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');
    this.map.on('load', this.addLayer);
  }

  componentWillUnmount() {
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
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
        });
      } else if (this.props.latestEvent?.type === 'EXPLORE_AREA') {
        this.exploreArea();
      }
    }
    // check if the size of the map container has changed and if so resize the map
    if (
      (prevProps.height !== this.props.height || prevProps.width !== this.props.width) &&
      this.mapLoaded
    ) {
      this.map.resize();
    }
    if (prevProps.mapConfig !== this.props.mapConfig && this.mapLoaded) {
      // seems we do not need to remove the sources when we load the style this way
      this.map.setStyle(this.getStyle());
      setTimeout((x) => this.updateLayer(), 500); // apparently we risk adding the occurrence layer below the layers if we do not wait
    }
  }

  exploreArea() {
    // get the current view of the map as a bounding box and send it to the parent component
    const { listener } = this.props;
    if (!listener || typeof listener !== 'function') return;
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
    // this.addLayer();
  }

  onPointClick(pointData) {
    this.props.onPointClick(pointData);
  }

  addLayer() {
    try {
      // const source = this.map.getSource('occurrences');
      // source.setTiles([`${env.API_V2}/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&srs=EPSG%3A3857&squareSize=256&predicateHash=${this.props.predicateHash}&${this.props.q ? `&q=${this.props.q} ` : ''}`])

      this.state.loadDiff = 0;
      var tileString = `${PUBLIC_API_V2}/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&srs=EPSG%3A3857&squareSize=256&predicateHash=${
        this.props.predicateHash ?? ''
      }&${this.props.q ? `&q=${this.props.q} ` : ''}`;

      this.map.addLayer(
        getLayerConfig({ tileString, theme: this.props.theme })
        // "poi-scalerank2"
      );

      const map = this.map;
      if (!this.mapLoaded) {
        const { savePosition } = this.props.mapPosition;

        // remember map position
        const saveCurrentPosition = () => {
          const center = map.getCenter();
          savePosition({
            zoom: map.getZoom() + 1, // MapLibre stores zoom-1
            lng: center.lng,
            lat: center.lat,
          });
        };

        map.on('zoomend', saveCurrentPosition);
        map.on('moveend', saveCurrentPosition);

        map.on('mouseenter', 'occurrences', function (e) {
          // Change the cursor style as a UI indicator.
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('click', 'occurrences', (e) => {
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
            // notify the user that we had dificulties loading the tiles
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
