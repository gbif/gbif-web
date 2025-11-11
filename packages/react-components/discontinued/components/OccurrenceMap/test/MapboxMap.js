import React, { Component } from "react";
import mapboxgl from 'mapbox-gl';
import { getLayerConfig } from './getLayerConfig';
import env from '../../../../.env.json';

class Map extends Component {
  constructor(props) {
    super(props);

    this.addLayer = this.addLayer.bind(this);
    this.updateLayer = this.updateLayer.bind(this);
    this.fitBbox = this.fitBbox.bind(this);
    this.myRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    const mapStyle = this.props.theme.darkTheme ? 'dark-v9' : 'light-v9';
    mapboxgl.accessToken = env.MAPBOX_KEY;
    this.map = new mapboxgl.Map({
      container: this.myRef.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      zoom: sessionStorage.getItem('mapZoom') || this.props.defaultMapSettings?.zoom || 0,
      center: [sessionStorage.getItem('mapLng') || this.props.defaultMapSettings?.lng || 0, sessionStorage.getItem('mapLat') || this.props.defaultMapSettings?.lat || 0]
    });
    this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');
    this.map.on("load", this.addLayer);
  }

  componentWillUnmount() {
    this.map.remove();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query && this.mapLoaded) {
      this.updateLayer();
    }
    if (prevProps.bbox !== this.props.bbox && typeof this.props.bbox !== 'undefined') {
      this.fitBbox(this.props.bbox);
    }
    if (prevProps.theme !== this.props.theme && this.mapLoaded) {
      const mapStyle = this.props.theme.darkTheme ? 'dark-v9' : 'light-v9';
      this.map.setStyle(`mapbox://styles/mapbox/${mapStyle}`);
      this.map.on('style.load', () => {
        this.updateLayer();
      });
    }
  }

  updateLayer() {
    var layer = this.map.getSource("occurrences");
    if (layer) {
      this.map.removeLayer("occurrences");
      this.map.removeSource("occurrences");
      this.addLayer();
    } else {
      this.addLayer();
    }
  }

  fitBbox({south, west, north, east}) {
    if (typeof south !== 'number') return null;
    // https://docs.mapbox.com/mapbox-gl-js/example/fitbounds/
    this.map.fitBounds([
      [west, south],
      [east, north]
    ], {duration: 0, padding: 100, maxZoom: 8});
  }

  addLayer() {
    var tileString = `${env.API_V2}/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&srs=EPSG%3A3857&squareSize=256&predicateHash=${this.props.predicateHash}`;
    this.map.addLayer(
      getLayerConfig({ tileString, theme: this.props.theme }),
      "poi-scalerank2"
    );

    const map = this.map
    if (!this.mapLoaded) {
      // remember map position
      map.on('zoomend', function () {
        const center = map.getCenter();
        sessionStorage.setItem('mapZoom', map.getZoom());
        sessionStorage.setItem('mapLng', center.lng);
        sessionStorage.setItem('mapLat', center.lat);
      });
      map.on('moveend', function () {
        const center = map.getCenter();
        sessionStorage.setItem('mapZoom', map.getZoom());
        sessionStorage.setItem('mapLng', center.lng);
        sessionStorage.setItem('mapLat', center.lat);
      });

      map.on('click', e => {
        if (!e._defaultPrevented && this.props.onMapClick) this.props.onMapClick();
      });

      map.on('error', e => {
        if (e?.error?.status === 400 && this.props.registerPredicate) {
          this.props.registerPredicate();
        }
      });
    }
    this.mapLoaded = true;
  }

  render() {
    const { query, onMapClick, predicateHash, ...props } = this.props;
    return <div ref={this.myRef} {...props} />
  }
}

export default Map;
