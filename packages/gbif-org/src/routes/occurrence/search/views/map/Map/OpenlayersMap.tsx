import { Projection, projections } from '@/components/maps/openlayers/projections';
import React, { Component } from 'react';
import { getBoundingBox } from '@/components/maps/openlayers/helpers/getBoundingBox';
import { useMapPosition } from './useMapPosition';
import klokantech from '@/components/maps/openlayers/styles/klokantech.json';
import { useConfig } from '@/config/config';
import { PointClickData, OccurrenceOverlay, AdHocMapInternalProps } from './types';
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
import { Theme } from '@/config/theme/theme';
import densityPoints from '@/components/maps/openlayers/styles/densityPoints';
import hash from 'object-hash';
import { unByKey } from 'ol/Observable';
import { EventsKey } from 'ol/events';

const OCCURRENCE_LAYER_PREFIX = 'occurrences__';
const OCCURRENCE_LAYERS_START_Z_INDEX = 100;

const mapStyles: Record<string, any> = {
  klokantech,
};

const DEFAULT_SOURCE_PARAMS = {
  style: 'scaled.circles',
  mode: 'GEO_CENTROID',
  squareSize: 512,
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

class Map extends Component<AdHocMapInternalProps, State> {
  myRef: React.RefObject<HTMLDivElement>;
  map?: OlMap;
  mapLoaded = false;
  filterVectorLayer?: VectorLayer<VectorSource>;
  drawingInteractions: DrawingInteractions = null;
  moveendKey: EventsKey | null = null;
  clickKey: EventsKey | null = null;

  constructor(props: AdHocMapInternalProps) {
    super(props);

    this.addLayers = this.addLayers.bind(this);
    this.updateLayers = this.updateLayers.bind(this);
    this.onPointClick = this.onPointClick.bind(this);
    this.myRef = React.createRef();
    this.state = {
      loadDiff: 0,
      epsg: undefined as Projection | undefined,
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
      // Create new interactions for each map instance
      interactions: olInteraction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false,
        mouseWheelZoom: true,
      }),
    };

    this.map = new OlMap(mapConfig);
    this.updateEntireMap();
    this.mapLoaded = true;
    this.addLayers();
    this.updateFilterGeometries();
    this.initializeDrawingInteractions();
    this.addMapEvents();
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
    this.filterVectorLayer.set('name', 'drawing-vector-layer');

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
    // https://github.com/openlayers/openlayers/issues/9556#issuecomment-
    if (this.map) {
      // if (this.drawingInteractions) {
      //   this.map.removeInteraction(this.drawingInteractions.draw);
      //   this.map.removeInteraction(this.drawingInteractions.modify);
      //   this.map.removeInteraction(this.drawingInteractions.snap);
      //   this.map.removeInteraction(this.drawingInteractions.select);
      // }
      // if (this.filterVectorLayer) {
      //   this.map.removeLayer(this.filterVectorLayer);
      // }
      this.map.getLayers().clear();
      this.map.setTarget(undefined);
    }
  }

  componentDidUpdate(prevProps: AdHocMapInternalProps) {
    if (this.props.onLoading) {
      if (this.state.loadDiff > 0) {
        this.props.onLoading(true);
      } else {
        this.props.onLoading(false);
      }
    }

    const updateEntireMap = prevProps.mapConfig !== this.props.mapConfig && this.mapLoaded;
    if (updateEntireMap) {
      this.updateEntireMap();
    } else if (
      // no point in updating the individual layers if we are updating the entire map
      prevProps.overlays !== this.props.overlays && // quick check
      this.mapLoaded && // the map need to be ready
      hash(prevProps.overlays) !== hash(this.props.overlays) // more expensive check
    ) {
      this.updateLayers({ prevOverlays: prevProps.overlays });
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
      (prevProps.containerHeight !== this.props.containerHeight ||
        prevProps.containerWidth !== this.props.containerWidth) &&
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

  async updateEntireMap() {
    if (!this.map) return;

    const epsg = this.props.mapConfig?.projection || 'EPSG_3031';
    const currentProjection = projections[epsg];
    this.setState({ epsg });

    this.map.getLayers().clear();

    const basemapStyle = this.props.mapConfig?.basemapStyle || 'klokantech';
    const layerStyle = mapStyles[basemapStyle];
    if (layerStyle) {
      const baseLayer = currentProjection.getVectorBaseLayer();
      baseLayer.set('name', 'base-layer');
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
        baseLayer.set('name', 'base-layer');
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
          // if the layer do not have a name, then provide a name
          if (!layer.get('name')) {
            layer.set('name', 'unnamed-base-layer');
          }
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

    this.addLayers();
    this.updateFilterGeometries();
    this.addMapEvents();
  }

  // async updateProjection() {
  //   const epsg = this.props.mapConfig?.projection || 'EPSG_3031';
  //   const currentProjection = projections[epsg];

  //   const mapPos = this.getStoredMapPosition();
  //   const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
  //   this.map.setView(newView);
  // }

  updateLayers({ prevOverlays = [] }: { prevOverlays?: OccurrenceOverlay[] } = {}) {
    if (!this.map) return;
    const newOverlays = this.props.overlays || [];

    // iterate over existing layers. If there is any existing layers with IDs that aren't in the new list, then remove.
    const occurrenceLayers = this.getOccurrenceLayers();
    occurrenceLayers.forEach((layer) => {
      const layerName = layer.get('name') as string | undefined;
      if (!layerName) return;
      const overlayId = layerName.replace(OCCURRENCE_LAYER_PREFIX, '');
      const stillExists = newOverlays.find((o) => o.id === overlayId);
      if (!stillExists) {
        this.map!.removeLayer(layer);
      }
    });

    // Iterate over the new layers. for each layer, get the existing if there is one.
    this.setState({ loadDiff: 0 }); // first reset loadDiff
    newOverlays.forEach((overlay, index) => {
      const layerName = getLayerName(overlay);
      const existingLayer = this.map!.getAllLayers().find(
        (layer) => layer.get('name') === layerName
      ) as VectorTileLayer | undefined;

      if (existingLayer) {
        // If it already exists, then move it to the correct zindex.
        existingLayer.setZIndex(OCCURRENCE_LAYERS_START_Z_INDEX + index);
        // If q or hash has changed, then update source.
        const prevOverlay = prevOverlays.find((o) => o.id === overlay.id);
        const oldFilter = getFilterFromOverlay(prevOverlay!);
        const newFilter = getFilterFromOverlay(overlay);
        if (prevOverlay?.hidden !== overlay.hidden) {
          existingLayer.setVisible(!overlay.hidden);
        }
        if (hash(oldFilter) !== hash(newFilter)) {
          const newSource = this.getOverlaySource(overlay);
          existingLayer.setSource(newSource);
        }
        // If the style has changed, then update it.
        const prevStyleHash = prevOverlay?.style ? hash(prevOverlay.style) : hash({}); // handle undefined style
        const newStyleHash = overlay.style ? hash(overlay.style) : hash({});
        if (prevStyleHash !== newStyleHash) {
          const newTheme = this.getMergedTheme(overlay);
          const style = densityPoints(newTheme);
          existingLayer.setStyle(style);
        }
      } else {
        // If there isn't one then create it at the right z-position
        const occurrenceLayer = this.getLayer(overlay);
        occurrenceLayer.setZIndex(OCCURRENCE_LAYERS_START_Z_INDEX + index);
        occurrenceLayer.setVisible(!overlay.hidden);
        this.map!.addLayer(occurrenceLayer);
      }
    });
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

  getOverlaySource(overlay: OccurrenceOverlay): VectorTileSource {
    const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];
    const filter = getFilterFromOverlay(overlay);
    const source = currentProjection.getAdhocVectorSource({ ...filter, ...DEFAULT_SOURCE_PARAMS });
    return source;
  }

  getLayer(overlay: OccurrenceOverlay): VectorTileLayer {
    const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];
    const layerName = getLayerName(overlay);

    const filter = getFilterFromOverlay(overlay);

    // Merge theme with overlay-specific styling
    const layerTheme = this.getMergedTheme(overlay);

    const occurrenceLayer = currentProjection.getAdhocVectorLayer({
      siteTheme: layerTheme,
      ...DEFAULT_SOURCE_PARAMS,
      name: layerName,
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
        if (this.props.registerPredicate) {
          this.props.registerPredicate();
        }
        if (this.props.onTileError) {
          this.props.onTileError();
        }
      },
    });

    occurrenceLayer.set('name', layerName);
    return occurrenceLayer;
  }

  addLayers() {
    if (!this.map) return;
    const overlays = this.props.overlays || [];
    // first remove existing occurrence layers
    const occurrenceLayers = this.getOccurrenceLayers();
    occurrenceLayers.forEach((layer) => {
      this.map!.removeLayer(layer);
    });
    this.setState({ loadDiff: 0 });

    // Add each overlay as a separate layer
    overlays.forEach((overlay, index) => {
      const occurrenceLayer = this.getLayer(overlay);
      // set zIndex to ensure proper stacking order
      occurrenceLayer.setZIndex(OCCURRENCE_LAYERS_START_Z_INDEX + index);
      occurrenceLayer.setVisible(!overlay.hidden);
      this.map!.addLayer(occurrenceLayer);
    });

    this.addMapEvents();

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

  getOccurrenceLayers(): VectorTileLayer[] {
    const map = this.map;
    if (!map) return [];
    const occurrenceLayers = map
      .getLayers()
      .getArray()
      .filter((l) => {
        const name = l.get('name');
        return name && name.startsWith(OCCURRENCE_LAYER_PREFIX);
      });
    return occurrenceLayers as VectorTileLayer[];
  }

  addMapEvents() {
    const map = this.map;
    if (!map) return;

    // remove existing handlers
    if (this.moveendKey) {
      unByKey(this.moveendKey);
      this.moveendKey = null;
    }
    if (this.clickKey) {
      unByKey(this.clickKey);
      this.clickKey = null;
    }

    // attach handlers
    const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];
    const { savePosition } = this.props.mapPosition;
    const moveendKey = map.on('moveend', function () {
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

    const clickKey = map.on('singleclick', (event) => {
      // Don't handle point clicks when drawing tools are active
      if (this.props.drawingTool) {
        return;
      }
      // Check all occurrence layers for features at click point
      let foundFeature = false;

      const occurrenceLayers = this.getOccurrenceLayers();
      const overlays = this.props.overlays || [];

      for (const layer of occurrenceLayers) {
        if (layer instanceof VectorTileLayer) {
          layer.getFeatures(event.pixel).then(function (features) {
            if (!foundFeature && features.length) {
              foundFeature = true;
              const feature = features[0];
              const layerName = layer.get('name');
              const layerId = layerName.replace(OCCURRENCE_LAYER_PREFIX, '');
              const properties = feature.getProperties();
              pointClickHandler({
                geohash: properties.geohash,
                count: properties.total,
                layerId,
                predicate: overlays?.find((o) => o.id === layerId)?.predicate,
              });
            }
          });
        }
      }

      // Small timeout to allow feature detection to complete
      setTimeout(() => {
        if (!foundFeature && clickHandler) {
          clickHandler();
        }
      }, 50);
    });

    // save handlers for later reference/removal
    this.moveendKey = moveendKey;
    this.clickKey = clickKey;
  }

  render() {
    return <div ref={this.myRef} className={this.props.className} />;
  }
}

function getLayerName(overlay: OccurrenceOverlay): string {
  return `${OCCURRENCE_LAYER_PREFIX}${overlay.id}`;
}

function getFilterFromOverlay(overlay: OccurrenceOverlay) {
  const filter: { predicateHash?: string; q?: string } = {};
  if (overlay.q) {
    filter.q = overlay.q;
  }
  if (overlay.predicateHash) {
    filter.predicateHash = overlay.predicateHash;
  }
  return filter;
}

export type AdHocMapCoreProps = Omit<AdHocMapInternalProps, 'mapPosition' | 'theme'>;

function MapWithHook(props: AdHocMapCoreProps) {
  const mapPosition = useMapPosition(props.defaultMapSettings);
  const config = useConfig();
  return <Map {...props} mapPosition={mapPosition} theme={config?.theme} />;
}
export default MapWithHook;
