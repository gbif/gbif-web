import React, { useContext, useRef, Component } from "react";
import ReactDOM from "react-dom"
import mapboxgl from 'mapbox-gl';
import env from '../../../../../.env.json';
import ThemeContext from '../../../../style/themes/ThemeContext';
import uniqBy from 'lodash/uniqBy';
import { Button } from "../../../../components";

const mapStyles = {};

class Map extends Component {
  constructor(props) {
    super(props);

    this.addLayer = this.addLayer.bind(this);
    this.updateLayer = this.updateLayer.bind(this);
    this.myRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    const mapStyle = this.props.theme.darkTheme ? 'dark-v9' : 'light-v9';
    let zoom = sessionStorage.getItem('institutionMapZoom') || this.props.defaultMapSettings?.zoom || 0;
    zoom = Math.min(Math.max(0, zoom), 20);
    zoom -= 1;

    let lng = sessionStorage.getItem('institutionMapLng') || this.props.defaultMapSettings?.lng || 0;
    lng = Math.min(Math.max(-180, lng), 180);

    let lat = sessionStorage.getItem('institutionMapLat') || this.props.defaultMapSettings?.lat || 0;
    lat = Math.min(Math.max(-85, lat), 85);

    mapboxgl.accessToken = env.MAPBOX_KEY;
    this.map = new mapboxgl.Map({
      container: this.myRef.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
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
      }
    }
    if (prevProps.mapConfig !== this.props.mapConfig && this.mapLoaded) {
      // seems we do not need to remove the sources when we load the style this way
      // this.map.setStyle(this.getStyle());
      setTimeout(x => this.updateLayer(), 500);// apparently we risk adding the occurrence layer below the layers if we do not wait
    }

    // check filter changes using hash, and if any then refresh the geojson layer
    if (prevProps.filterHash !== this.props.filterHash && this.mapLoaded) {
      // this.updateLayer();
    }

    if (prevProps.geojsonData !== this.props.geojsonData && this.mapLoaded) {
      this.updateGeoJsonData();
    }
  }

  getStyle() {
    const basemapStyle = this.props.mapConfig?.basemapStyle || 'klokantech';
    const layerStyle = mapStyles[basemapStyle];
    return layerStyle || this.props.mapConfig?.basemapStyle;
  }

  updateLayer() {
    const layer = this.map.getLayer('clusters');
    if (layer) {
      this.map.removeLayer("clusters");
      this.addLayer();
    } else {
      this.addLayer();
    }
    // this.addLayer();
  }

  updateGeoJsonData() {
    const map = this.map;
    const geojsonData = this.props.geojsonData;
    const source = map.getSource('markers');
    if (source) {
      source.setData(geojsonData);
    }
  }

  addLayer() {
    const map = this.map;
    const geojsonData = this.props.geojsonData;

    const layer = map.getLayer('clusters');
    if (layer) {
      map.removeLayer("clusters");
    }

    const source = map.getSource('markers');
    if (!source) {
      map.addSource('markers', {
        type: 'geojson',
        data: geojsonData,
        cluster: true,
        clusterMaxZoom: 12, // Max zoom to cluster points on
        clusterRadius: 15 // Radius of each cluster when clustering points (defaults to 50)
      });
    }

    // get primary color from theme
    const primaryColor = this.props.theme.primary;
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'markers',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': primaryColor,
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          12, 5, // radius when point count is less than 100 
          14, 10,
          16
        ]
      }
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'markers',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
      paint: {
        "text-color": "#fff"
      }
    });

    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'markers',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': primaryColor,
        'circle-radius': 7,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });

    if (!this.mapLoaded) {
      // remember map position
      map.on('zoomend', function () {
        const center = map.getCenter();
        sessionStorage.setItem('institutionMapZoom', map.getZoom() + 1);
        sessionStorage.setItem('institutionMapLng', center.lng);
        sessionStorage.setItem('institutionMapLat', center.lat);
      });
      map.on('moveend', function () {
        const center = map.getCenter();
        sessionStorage.setItem('institutionMapZoom', map.getZoom() + 1);
        sessionStorage.setItem('institutionMapLng', center.lng);
        sessionStorage.setItem('institutionMapLat', center.lat);
      });

      // inspect a cluster on click
      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;

        map.getSource('markers').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      const popUpRef = this.props.popUpRef;
      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // https://github.com/mapbox/mapbox-gl-js/issues/10297
        // it isn't clear why, but features can be duplicated so we have to find the unique using the key. For tiled data it is because they can appear on multiple tiles, but even for geojson sources it appears to be the case
        const features = uniqBy(e.features, x => x.properties.key);

        // approach of using mapbox with react popups is taken from here https://www.lostcreekdesigns.co/writing/how-to-create-a-map-popup-component-using-mapbox-and-react/
        const popupNode = document.createElement("div")
        ReactDOM.render(
          <Popup
            features={features.map(x => x.properties)}
            onClick={this.props.onPointClick}
            FeatureComponent={this.props.FeatureComponent}
          />,
          popupNode
        )

        popUpRef.current
          .setLngLat(e.lngLat)
          .setDOMContent(popupNode)
          .addTo(map)
      });

      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'default';
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
    }
    this.mapLoaded = true;
  }

  render() {
    const { query, onMapClick, onPointClick, predicateHash, style, className, loading, ...props } = this.props;
    return <div {...{ className }} style={{ ...style, position: 'relative' }}>
      <div style={{ width: '100%', height: '100%' }} ref={this.myRef} />
      {loading && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'white', opacity: 0.6 }}></div>}
    </div>
  }
}

export default (props) => {
  const theme = useContext(ThemeContext);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))

  return <Map popUpRef={popUpRef} {...props} theme={theme} style={{ width: '100%', height: '100%' }} />
}


function Popup({ features, FeatureComponent = Feature, onClick, ...props }) {
  return <div style={{lineHeight: '1.2em'}}>
    {features.map(x => <div style={{margin: '8px 0'}}>
      <FeatureComponent key={x.key} data={x} onClick={onClick} />
    </div>)}
  </div>
}

function Feature({ data, onClick }) {
  return <Button look="link" onClick={() => onClick([data])}>
    {data.name}
  </Button>
}
