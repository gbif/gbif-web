import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorMessage } from '@/components/errorMessage';
import klokantech from '@/components/maps/openlayers/styles/klokantech.json';
import { isWebglSupported } from '@/utils/isWebglSupported';
import maplibre from 'maplibre-gl';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { getLayerConfig } from './getLayerConfig';

const PUBLIC_API_V2 = import.meta.env.PUBLIC_API_V2;

const mapStyles = {
  klokantech,
};

function Map(props) {
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
        <MapLibreMap {...props} />
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
    let zoom = sessionStorage.getItem('mapZoom') || this.props.defaultMapSettings?.zoom || 0;
    zoom = Math.min(Math.max(0, zoom), 20);
    zoom -= 1;

    let lng = sessionStorage.getItem('mapLng') || this.props.defaultMapSettings?.lng || 0;
    lng = Math.min(Math.max(-180, lng), 180);

    let lat = sessionStorage.getItem('mapLat') || this.props.defaultMapSettings?.lat || 0;
    lat = Math.min(Math.max(-85, lat), 85);

    this.map = new maplibre.Map({
      container: this.myRef.current,
      style: this.getStyle(),
      zoom,
      center: [lng, lat],
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
        // remember map position
        map.on('zoomend', function () {
          const center = map.getCenter();
          sessionStorage.setItem('mapZoom', map.getZoom() + 1);
          sessionStorage.setItem('mapLng', center.lng);
          sessionStorage.setItem('mapLat', center.lat);
        });
        map.on('moveend', function () {
          const center = map.getCenter();
          sessionStorage.setItem('mapZoom', map.getZoom() + 1);
          sessionStorage.setItem('mapLng', center.lng);
          sessionStorage.setItem('mapLat', center.lat);
        });

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
