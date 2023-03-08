import React, { Component } from "react";
import mapboxgl from 'mapbox-gl';
import { getLayerConfig } from './getLayerConfig';
import env from '../../../../../.env.json';

class Map extends Component {

  constructor(props) {
    super(props);

    this.addLayer = this.addLayer.bind(this);
    this.updateLayer = this.updateLayer.bind(this);
    this.onPointClick = this.onPointClick.bind(this);
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
    // console.log('componentDidUpdate');
    if (prevProps.query !== this.props.query && this.mapLoaded) {
      this.updateLayer();
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
    // console.log('updateLayer');
    var layer = this.map.getSource("events");
    if (layer) {
      this.map.removeLayer("events");
      this.map.removeSource("events");
      this.addLayer();
    } else {
      this.addLayer();
    }
  }

  onPointClick(pointData) {
    // console.log(pointData);
    this.props.onPointClick(pointData);
  }

  addLayer() {
    let tileString = `${env.EVENT_TILE_API}/event/mvt/{z}/{x}/{y}?queryId=${this.props.predicateHash}`;
    this.map.addLayer(
        getLayerConfig({ tileString, theme: this.props.theme })
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

      map.on('mouseenter', 'events', function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('click', 'events', e => {
        this.onPointClick({ geohash:  e.features[0].properties._key, count: e.features[0].properties._count });
        e.preventDefault();
      });

      map.on('mouseleave', 'events', function () {
        map.getCanvas().style.cursor = '';
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
    const { query, onMapClick, onPointClick, predicateHash, style, className, ...props } = this.props;
    return <div ref={this.myRef} {...{style, className}} />
  }
}

export default Map;
