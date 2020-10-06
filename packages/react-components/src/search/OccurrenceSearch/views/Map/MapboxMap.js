import React, { Component } from "react";
import mapboxgl from 'mapbox-gl';
import { getLayerConfig } from './getLayerConfig';

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
    mapboxgl.accessToken = 'pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA';
    this.map = new mapboxgl.Map({
      container: this.myRef.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      zoom: sessionStorage.getItem('mapZoom') || 0,
      center: [sessionStorage.getItem('mapLng') || 0, sessionStorage.getItem('mapLat') || 0]
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

  onPointClick(pointData) {
    this.props.onPointClick(pointData);
  }

  addLayer() {
    var tileString =
      //"https://esmap.gbif-dev.org/api/tile/{x}/{y}/{z}.mvt?field=coordinates&url=" +
      "https://hp-maps.gbif-staging.org/api/tile/point/{x}/{y}/{z}.mvt?resolution=medium&field=coordinates" +
      // "http://labs.gbif.org:7012/api/tile/point/{x}/{y}/{z}.mvt?resolution=medium&field=coordinates&url=" +
      // "http://localhost:4000/tile/point/{x}/{y}/{z}.mvt?resolution=medium&field=coordinates&url=" +
      // "http://localhost:7012/api/tile/point/{x}/{y}/{z}.mvt?resolution=medium&field=coordinates" +
      // "http://localhost:3000/api/tile/significant/{x}/{y}/{z}.mvt?field=coordinate_point&significantField=backbone.speciesKey&url=" +
      //"http://localhost:3001/api/tile/point/{x}/{y}/{z}.mvt?resolution=high&field=coordinates&url=" +
      "&filter=" + encodeURIComponent(JSON.stringify(this.props.query));
    // tileString = `https://api.gbif.org/v2/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&locale=en&advanced=false&srs=EPSG%3A4326&squareSize=256`;
    this.map.addLayer(
      getLayerConfig({tileString, theme: this.props.theme}),
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

      map.on('mouseenter', 'occurrences', function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
      });
      
      map.on('click', 'occurrences', e => {
        // console.log(e.features[0].properties);
        this.onPointClick({ geohash: e.features[0].properties.geohash, count: e.features[0].properties.count });
        e.preventDefault();
      });

      map.on('mouseleave', 'occurrences', function () {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', e => {
        if (!e._defaultPrevented && this.props.onMapClick) this.props.onMapClick();
      });
    }
    this.mapLoaded = true;
  }

  render() {
    const { query, onMapClick, onPointClick, ...props } = this.props;
    return <div ref={this.myRef} {...props} />
  }
}

export default Map;
