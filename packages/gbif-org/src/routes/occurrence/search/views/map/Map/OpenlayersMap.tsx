import { projections } from '@/components/maps/openlayers/projections';
import React, { Component } from 'react';
import { getBoundingBox } from '@/components/maps/openlayers/helpers/getBoundingBox';
import { useMapPosition } from './useMapPosition';
import klokantech from '@/components/maps/openlayers/styles/klokantech.json';
import { Projection } from '@/config/config';
import { OccurrenceSearchMetadata } from '@/contexts/search';
import { BoundingBox } from '@/types';
import { pixelRatio } from '@/utils/pixelRatio';
import { getFeatureAsWKT, getFeaturesFromWktList } from '@/utils/wktHelpers';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Fill, Stroke, Style } from 'ol/style';
import { apply, applyBackground, applyStyle, stylefunction } from 'ol-mapbox-style';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Select from 'ol/interaction/Select';
import Snap from 'ol/interaction/Snap';
import { defaults as olControlDefaults, ScaleLine } from 'ol/control';
import { MVT as MVTFormat } from 'ol/format';
import * as olInteraction from 'ol/interaction';
import BaseTileLayer from 'ol/layer/BaseTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import OlMap from 'ol/Map';
import { transform } from 'ol/proj';
import ImageTile from 'ol/source/ImageTile';
import VectorTileSource from 'ol/source/VectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';

const interactions = olInteraction.defaults({
  altShiftDragRotate: false,
  pinchRotate: false,
  mouseWheelZoom: true,
});

const mapStyles: Record<string, any> = {
  klokantech,
};

type MapEvent =
  | { type: 'ZOOM_TO'; lat: number; lng: number; zoom: number }
  | { type: 'EXPLORE_AREA'; bbox?: BoundingBox }
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' };

type PointData = {
  geohash: string;
  count: number;
};

type Props = {
  mapConfig?: {
    basemapStyle: string;
    projection: Projection;
  };
  onLoading?(loading: boolean): void;
  query: string;
  height: number;
  width: number;
  latestEvent?: MapEvent;
  defaultMapSettings?: OccurrenceSearchMetadata['mapSettings'];
  listener?(event: MapEvent): void;
  predicateHash: string;
  q?: string;
  theme: string;
  registerPredicate?(): void;
  onTileError?(): void;
  onMapClick?(): void;
  className?: string;
  onPointClick(point: PointData): void;
  mapPosition: ReturnType<typeof useMapPosition>;
  features?: string[];
  drawingTool?: string | null;
  onDrawingToolChange?(tool: string | null): void;
  onFeaturesChange?(params: { features: string[] }): void;
};

type State = {
  loadDiff: number;
  epsg?: Projection;
};

type DrawingInteractions = {
  draw: Draw;
  modify: Modify;
  snap: Snap;
  select: Select;
} | null;

class Map extends Component<Props, State> {
  myRef: React.RefObject<HTMLDivElement>;
  map?: OlMap;
  mapLoaded = false;
  filterVectorLayer?: VectorLayer<VectorSource>;
  drawingInteractions: DrawingInteractions = null;

  constructor(props: Props) {
    super(props);

    this.addLayer = this.addLayer.bind(this);
    this.updateLayer = this.updateLayer.bind(this);
    this.onPointClick = this.onPointClick.bind(this);
    this.myRef = React.createRef();
    this.state = {
      loadDiff: 0,
      // Is this the same as this.props.mapConfig?.projection || 'EPSG_3031'?
      epsg: undefined,
    };
  }

  componentDidMount() {
    const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];
    const mapPos = this.props.mapPosition.getStoredPosition();
    const mapConfig = {
      target: this.myRef.current ?? undefined,
      view: currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom),
      controls: olControlDefaults({ zoom: false, attribution: true }).extend([
        new ScaleLine({
          units: 'metric',
        }),
      ]),
      interactions,
    };
    this.map = new OlMap(mapConfig);
    this.updateMapLayers();
    this.mapLoaded = true;
    this.addLayer();
    this.updateFilterGeometries();
    this.initializeDrawingInteractions();
  }

  initializeDrawingInteractions() {
    if (!this.map || !this.filterVectorLayer) return;

    const source = this.filterVectorLayer.getSource();
    if (!source) return;

    const draw = new Draw({
      source: source,
      type: 'Polygon',
    });

    const modify = new Modify({ source: source });
    const snap = new Snap({ source: source });
    const select = new Select({ layers: [this.filterVectorLayer] });

    this.map.addInteraction(draw);
    this.map.addInteraction(modify);
    this.map.addInteraction(snap);
    this.map.addInteraction(select);

    // Initially disable all interactions
    draw.setActive(false);
    modify.setActive(false);
    snap.setActive(false);
    select.setActive(false);

    this.drawingInteractions = { draw, modify, snap, select };

    // Handle draw events - arrow function ensures 'this' is bound correctly
    const handleDrawEnd = (event: any) => {
      const geometries: string[] = [];
      source.forEachFeature((f) => {
        geometries.push(getFeatureAsWKT(f));
      });
      const latestWkt = getFeatureAsWKT(event.feature);
      geometries.push(latestWkt);

      if (this.props.onFeaturesChange) {
        this.props.onFeaturesChange({ features: geometries });
      }
    };
    draw.on('drawend', handleDrawEnd);

    // Handle modify events - arrow function ensures 'this' is bound correctly
    const handleModifyEnd = () => {
      setTimeout(() => {
        const geometries: string[] = [];
        source.forEachFeature((f) => {
          geometries.push(getFeatureAsWKT(f));
        });
        if (this.props.onFeaturesChange) {
          this.props.onFeaturesChange({ features: geometries });
        }
      }, 0);
    };
    modify.on('modifyend', handleModifyEnd);

    // Handle select events (for deletion) - arrow function ensures 'this' is bound correctly
    const handleSelect = () => {
      select.getFeatures().forEach((selectedFeature) => {
        const layer = select.getLayer(selectedFeature);
        if (layer) {
          layer.getSource()?.removeFeature(selectedFeature);
        }
      });
      setTimeout(() => {
        const geometries: string[] = [];
        source.forEachFeature((f) => {
          geometries.push(getFeatureAsWKT(f));
        });
        if (this.props.onFeaturesChange) {
          this.props.onFeaturesChange({ features: geometries });
        }
      }, 0);
    };
    select.on('select', handleSelect);
  }

  updateFilterGeometries() {
    if (!this.map) return;

    const features = this.props.features || [];

    // Remove existing filter layer if it exists
    if (this.filterVectorLayer) {
      this.map.removeLayer(this.filterVectorLayer);
    }

    // Only show filter geometries for MERCATOR and PLATE_CAREE projections
    // Polar projections (EPSG_3031 Antarctic, EPSG_3995 Arctic) require geodesic edge densification:
    // - WKT geometries are defined in EPSG:4326 with straight edges between vertices
    // - In polar projections, these edges should follow geodesic curves (great circles)
    // - Simple reprojection only transforms vertices, not the edges between them
    // - This results in incorrect polygon shapes where edges appear as straight lines in the
    //   projected space rather than following the actual geodesic path
    // - Proper support would require densifying edges before transformation, which is more complex.
    // For now we will just not show polygons on polar projections
    const projection = this.props.mapConfig?.projection || 'EPSG_3031';
    const supportedProjections = ['EPSG_3857', 'EPSG_4326'];

    if (!supportedProjections.includes(projection)) {
      // Don't display filter geometries for polar projections
      return;
    }

    // Always create the filter layer (even with no features) to ensure drawing interactions work
    const vectorSource = new VectorSource({ wrapX: true });
    
    // Add existing features if any
    if (features.length > 0) {
      const geometryFeatures = getFeaturesFromWktList({ geometry: features });
      vectorSource.addFeatures(geometryFeatures);
    }

    this.filterVectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: '#f1fbff6b',
        }),
        stroke: new Stroke({
          color: '#0099ff',
          width: 4,
        }),
      }),
      zIndex: 100, // Ensure filter geometries are above the occurrence layer
    });

    this.map.addLayer(this.filterVectorLayer);

    // Reinitialize drawing interactions with the new layer
    if (this.drawingInteractions) {
      this.map.removeInteraction(this.drawingInteractions.draw);
      this.map.removeInteraction(this.drawingInteractions.modify);
      this.map.removeInteraction(this.drawingInteractions.snap);
      this.map.removeInteraction(this.drawingInteractions.select);
    }
    this.initializeDrawingInteractions();

    // Restore the active tool state
    if (this.props.drawingTool === 'DRAW') {
      this.enableDrawingTool();
    } else if (this.props.drawingTool === 'DELETE') {
      this.enableDeleteTool();
    }
  }

  componentWillUnmount() {
    // https://github.com/openlayers/openlayers/issues/9556#issuecomment-493190400
    if (this.map) {
      if (this.drawingInteractions) {
        this.map.removeInteraction(this.drawingInteractions.draw);
        this.map.removeInteraction(this.drawingInteractions.modify);
        this.map.removeInteraction(this.drawingInteractions.snap);
        this.map.removeInteraction(this.drawingInteractions.select);
      }
      if (this.filterVectorLayer) {
        this.map.removeLayer(this.filterVectorLayer);
      }
      this.map.setTarget(undefined);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.query !== this.props.query && this.mapLoaded) {
      this.updateLayer();
    }

    if (this.props.onLoading) {
      if (this.state.loadDiff > 0) {
        this.props.onLoading(true);
      } else {
        this.props.onLoading(false);
      }
    }

    if (prevProps.mapConfig !== this.props.mapConfig && this.mapLoaded) {
      this.updateMapLayers();
    }

    if (prevProps.latestEvent !== this.props.latestEvent && this.mapLoaded) {
      if (this.props.latestEvent?.type === 'ZOOM_IN') {
        this.zoomIn();
      } else if (this.props.latestEvent?.type === 'ZOOM_OUT') {
        this.zoomOut();
      } else if (this.props.latestEvent?.type === 'ZOOM_TO') {
        const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];
        const newView = currentProjection.getView(
          this.props.latestEvent.lat,
          this.props.latestEvent.lng,
          this.props.latestEvent.zoom
        );
        this.map?.setView(newView);
      } else if (this.props.latestEvent?.type === 'EXPLORE_AREA') {
        this.exploreArea();
      }
    }
    // check if the size of the map container has changed and if so resize the map
    if (
      (prevProps.height !== this.props.height || prevProps.width !== this.props.width) &&
      this.mapLoaded
    ) {
      this.map?.updateSize();
    }

    // Update filter geometries when features prop changes
    if (prevProps.features !== this.props.features && this.mapLoaded) {
      this.updateFilterGeometries();
    }

    // Handle drawing tool changes
    if (prevProps.drawingTool !== this.props.drawingTool && this.mapLoaded) {
      this.disableAllDrawingInteractions();

      if (this.props.drawingTool === 'DRAW') {
        this.enableDrawingTool();
      } else if (this.props.drawingTool === 'DELETE') {
        this.enableDeleteTool();
      }
    }
  }

  zoomIn() {
    if (!this.map) return;
    const view = this.map.getView();
    const currentZoom = view.getZoom();
    if (typeof currentZoom === 'number') {
      view.setZoom(currentZoom + 1);
    }
  }

  zoomOut() {
    if (!this.map) return;
    const view = this.map.getView();
    const currentZoom = view.getZoom();
    if (typeof currentZoom === 'number') {
      view.setZoom(currentZoom - 1);
    }
  }

  exploreArea() {
    if (!this.map) return;

    // get the current view of the map as a bounding box and send it to the parent component
    const { listener } = this.props;
    if (!listener || typeof listener !== 'function') return;

    listener({
      type: 'EXPLORE_AREA',
      bbox: getBoundingBox({ map: this.map }),
    });
  }

  disableAllDrawingInteractions() {
    if (!this.drawingInteractions) return;
    this.drawingInteractions.draw.setActive(false);
    this.drawingInteractions.modify.setActive(false);
    this.drawingInteractions.snap.setActive(false);
    this.drawingInteractions.select.setActive(false);
  }

  enableDrawingTool() {
    if (!this.drawingInteractions) return;
    this.drawingInteractions.draw.setActive(true);
    this.drawingInteractions.modify.setActive(true);
    this.drawingInteractions.snap.setActive(true);
  }

  enableDeleteTool() {
    if (!this.drawingInteractions) return;
    this.drawingInteractions.select.setActive(true);
  }

  removeLayer(name: string) {
    if (!this.map) return;
    this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get('name') === name)
      .forEach((layer) => this.map!.removeLayer(layer));
  }

  async updateMapLayers() {
    if (!this.map) return;

    const epsg = this.props.mapConfig?.projection || 'EPSG_3031';
    const currentProjection = projections[epsg];
    this.setState({ epsg });

    this.map.getLayers().clear();
    // this.updateProjection();

    // update projection
    // const mapPos = this.props.mapPosition.getStoredPosition({
    //   maxLat: currentProjection.maxLat || 90,
    //   minLat: currentProjection.minLat || -90,
    // });
    // const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
    // this.map.setView(newView);

    const basemapStyle = this.props.mapConfig?.basemapStyle || 'klokantech';
    const layerStyle = mapStyles[basemapStyle];
    if (layerStyle) {
      const baseLayer = currentProjection.getVectorBaseLayer();
      const resolutions = baseLayer.getSource()?.getTileGrid()?.getResolutions();
      applyBackground(baseLayer, layerStyle);
      applyStyle(baseLayer, layerStyle, 'openmaptiles', undefined, resolutions);
      this.map.addLayer(baseLayer);
    } else if (epsg !== 'EPSG_3857') {
      const styleResponse =
        this.props.mapConfig?.basemapStyle != null
          ? await fetch(this.props.mapConfig.basemapStyle).then((response) => response.json())
          : undefined;

      if (!styleResponse?.metadata?.['gb:reproject']) {
        const baseLayer = currentProjection.getVectorBaseLayer();
        const resolutions = baseLayer.getSource()?.getTileGrid()?.getResolutions();
        applyBackground(baseLayer, styleResponse);
        stylefunction(baseLayer, styleResponse, 'openmaptiles', resolutions);
        this.map.addLayer(baseLayer);
      } else {
        // if this map style is intended to be reprojected then continue
        await apply(this.map, styleResponse);

        const mapPos = this.props.mapPosition.getStoredPosition();
        const map = this.map;

        const mapboxStyle = this.map.get('mapbox-style');
        this.map.getLayers().forEach(function (layer) {
          const mapboxSource = layer.get('mapbox-source');
          if (mapboxSource) {
            const sourceConfig = mapboxStyle.sources[mapboxSource];
            if (sourceConfig.type === 'vector' && layer instanceof VectorTileLayer) {
              const source = layer.getSource();
              const sourceConfig = mapboxStyle.sources[mapboxSource];
              layer.setSource(
                new VectorTileSource({
                  format: new MVTFormat(),
                  projection: sourceConfig.projection,
                  tileSize: sourceConfig.tileSize * pixelRatio, // Source tile size
                  urls: source.getUrls(),
                  tileGrid: new TileGrid(sourceConfig.tilegridOptions),
                  wrapX: sourceConfig.wrapX,
                  attributions: [sourceConfig.attribution],
                })
              );

              stylefunction(
                layer,
                styleResponse,
                mapboxSource,
                sourceConfig.tilegridOptions.resolutions
              );

              // update the view projection to match the data projection
              const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
              map.setView(newView);
            }

            if (sourceConfig.type === 'raster' && layer instanceof BaseTileLayer) {
              layer.setSource(
                new ImageTile({
                  projection: sourceConfig.projection,
                  url: sourceConfig.tiles,
                  tileGrid: new TileGrid(sourceConfig.tilegridOptions),
                  tileSize: sourceConfig.tileSize * pixelRatio, // Source tile size
                  wrapX: sourceConfig.wrapX,
                  maxZoom: sourceConfig.maxZoom,
                  attributions: [sourceConfig.attribution],
                })
              );
              if (sourceConfig.extent) {
                layer.setExtent(sourceConfig.extent);
              }

              // update the view projection to match the data projection
              const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
              map.setView(newView);
            }
          }
        });
      }
    } else {
      await apply(
        this.map,
        this.props.mapConfig?.basemapStyle ||
          `${
            import.meta.env.PUBLIC_WEB_UTILS
          }/map-styles/3857/gbif-raster?styleName=osm&background=%23f3f3f1&language=en&pixelRatio=` +
            pixelRatio
      );
    }

    // update projection
    const mapPos = this.props.mapPosition.getStoredPosition();
    const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
    this.map.setView(newView);

    this.addLayer();
    this.updateFilterGeometries();
  }

  // async updateProjection() {
  //   const epsg = this.props.mapConfig?.projection || 'EPSG_3031';
  //   const currentProjection = projections[epsg];

  //   const mapPos = this.getStoredMapPosition();
  //   const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
  //   this.map.setView(newView);
  // }

  updateLayer() {
    if (!this.map) return;

    this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get('name') === 'occurrences')
      .forEach((layer) => this.map!.removeLayer(layer));
    this.addLayer();
  }

  onPointClick(pointData: PointData) {
    this.props.onPointClick(pointData);
  }

  addLayer() {
    if (!this.map) return;

    const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];
    const filter: { predicateHash: string; q?: string } = {
      predicateHash: this.props.predicateHash,
    };
    if (this.props.q) {
      filter.q = this.props.q;
    }
    this.setState(function () {
      return { loadDiff: 0 };
    });
    const occurrenceLayer = currentProjection.getAdhocVectorLayer({
      siteTheme: this.props.theme,
      style: 'scaled.circles',
      mode: 'GEO_CENTROID',
      squareSize: 512,
      progress: {
        addLoading: () => {
          this.setState(function (prevState) {
            return { loadDiff: prevState.loadDiff + 1 };
          });
        },
        addLoaded: () => {
          this.setState(function (prevState) {
            return { loadDiff: prevState.loadDiff - 1 };
          });
        },
      },
      ...filter,
      onError: () => {
        // there seem to be no simple way to get the statuscode, so we will just reregister on any type of error
        if (this.props.registerPredicate) {
          this.props.registerPredicate();
        }
        if (this.props.onTileError) {
          this.props.onTileError();
        }
      },
    });

    // how to add a layer below e.g. labels on the basemap? // you can insert at specific indices, but the problem is that the basemap are collapsed into one layer
    // occurrenceLayer.setZIndex(0);
    this.map.addLayer(occurrenceLayer);

    const map = this.map;
    const { savePosition } = this.props.mapPosition;

    map.on('moveend', function () {
      const { center, zoom } = map.getView().getState();
      const reprojectedCenter = transform(center, currentProjection.srs, 'EPSG:4326');
      savePosition({
        zoom,
        lng: reprojectedCenter[0],
        lat: reprojectedCenter[1],
      });
    });

    const pointClickHandler = this.onPointClick;
    const clickHandler = this.props.onMapClick;
    map.on('singleclick', (event) => {
      // Don't handle point clicks when drawing tools are active
      if (this.props.drawingTool) {
        return;
      }

      // todo : hover and click do not agree on wether there is a point or not
      occurrenceLayer.getFeatures(event.pixel).then(function (features) {
        const feature = features.length ? features[0] : undefined;
        if (feature) {
          const properties = feature.getProperties();
          pointClickHandler({ geohash: properties.geohash, count: properties.total });
        } else if (clickHandler) {
          clickHandler();
        }
      });
    });

    // the performance of this is really bad. It is a shame, but I think it is better to have it disabled until we can find a better solution. Probably updating to a newer version of openlayers will do it.
    // reviewed nov 2025 OL10 - performance is slightly better but still not good enough to enable
    // map.on('pointermove', function (e) {
    //   if (e.dragging) {
    //     return;
    //   } else {
    //     var pixel = map.getEventPixel(e.originalEvent);
    //     var hit = map.hasFeatureAtPixel(pixel, { layerFilter: l => l.values_.name === 'occurrences' });
    //     map.getViewport().style.cursor = hit ? 'pointer' : '';
    //   }
    // });
  }

  render() {
    return <div ref={this.myRef} className={this.props.className} />;
  }
}

function MapWithHook(props: Omit<Props, 'mapPosition'>) {
  const mapPosition = useMapPosition(props.defaultMapSettings);
  return <Map {...props} mapPosition={mapPosition} />;
}

export default MapWithHook;
