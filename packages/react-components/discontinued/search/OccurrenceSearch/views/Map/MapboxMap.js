import React, { Component } from "react";
import mapboxgl from 'mapbox-gl';
import { getLayerConfig } from './getLayerConfig';
import env from '../../../../../.env.json';
import klokantech from './openlayers/styles/klokantech.json';

const mapStyles = {
  klokantech
};

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
    let zoom = sessionStorage.getItem('mapZoom') || this.props.defaultMapSettings?.zoom || 0;
    zoom = Math.min(Math.max(0, zoom), 20);
    zoom -= 1;

    let lng = sessionStorage.getItem('mapLng') || this.props.defaultMapSettings?.lng || 0;
    lng = Math.min(Math.max(-180, lng), 180);

    let lat = sessionStorage.getItem('mapLat') || this.props.defaultMapSettings?.lat || 0;
    lat = Math.min(Math.max(-85, lat), 85);

    mapboxgl.accessToken = env.MAPBOX_KEY;
    this.map = new mapboxgl.Map({
      container: this.myRef.current,
      // style: `mapbox://styles/mapbox/${mapStyle}`,
      // style: 'https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=pk.eyJ1IjoiZ2JpZiIsImEiOiJja3VmZm50Z3kxcm1vMnBtdnBmeGd5cm9hIn0.M2z2n9QP9fRHZUCw9vbgOA',
      style: this.getStyle(),
      zoom,
      center: [lng, lat]
    });
    // this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');
    this.map.on("load", this.addLayer);
  }

  componentWillUnmount() {
    if (this.map) this.map.remove();
  }

  componentDidUpdate(prevProps) {
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
    if (prevProps.latestEvent !== this.props.latestEvent && this.mapLoaded) {
      if (this.props.latestEvent?.type === 'ZOOM_IN') {
        this.map.zoomIn();
      } else if (this.props.latestEvent?.type === 'ZOOM_OUT') {
        this.map.zoomOut();
      } else if (this.props.latestEvent?.type === 'ZOOM_TO') {
        this.map.flyTo({
          center: [this.props.latestEvent.lng, this.props.latestEvent.lat],
          zoom: this.props.latestEvent.zoom,
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
      } else if (this.props.latestEvent?.type === 'EXPLORE_AREA') {
        this.exploreArea();
      }
    }
    // check if the size of the map container has changed and if so resize the map
    if ((prevProps.height !== this.props.height || prevProps.width !== this.props.width) && this.mapLoaded) {
      this.map.resize();
    }
    if (prevProps.mapConfig !== this.props.mapConfig && this.mapLoaded) {
      // seems we do not need to remove the sources when we load the style this way
      this.map.setStyle(this.getStyle());
      setTimeout(x => this.updateLayer(), 500);// apparently we risk adding the occurrence layer below the layers if we do not wait
    }
  }

  exploreArea() {
    // get the current view of the map as a bounding box and send it to the parent component
    const { listener } = this.props;
    if (!listener || typeof listener !== 'function') return;
    // get extent of the map view
    const bounds = this.map.getBounds();
    listener({ type: 'EXPLORE_AREA', bbox: {top: bounds.getNorth(), left: bounds.getWest(), bottom: bounds.getSouth(), right: bounds.getEast()} });
  }

  getStyle() {
    const basemapStyle = this.props.mapConfig?.basemapStyle || 'klokantech';
    const layerStyle = mapStyles[basemapStyle];
    return layerStyle || this.props.mapConfig?.basemapStyle;
  }

  updateLayer() {
    const layer = this.map.getLayer('occurrences');
    if (layer) {
      this.map.removeLayer("occurrences");
      this.map.removeSource("occurrences");
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

    // const source = this.map.getSource('occurrences');
    // source.setTiles([`${env.API_V2}/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&srs=EPSG%3A3857&squareSize=256&predicateHash=${this.props.predicateHash}&${this.props.q ? `&q=${this.props.q} ` : ''}`])
    

    var tileString = `${env.API_V2}/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&srs=EPSG%3A3857&squareSize=256&predicateHash=${this.props.predicateHash}&${this.props.q ? `&q=${this.props.q} ` : ''}`;
    
    this.map.addLayer(
      getLayerConfig({ tileString, theme: this.props.theme }),
      // "poi-scalerank2"
    );

    const map = this.map
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

      map.on('click', 'occurrences', e => {
        this.onPointClick({ geohash: e.features[0].properties.geohash, count: e.features[0].properties.count });
        e.preventDefault();
      });

      map.on('mouseleave', 'occurrences', function () {
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
    return <div ref={this.myRef} {...{ style, className }} />
  }
}

export default Map;
