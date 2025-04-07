import { Projection } from '@/config/config';
import { MaybeArray } from '@/types';
import { toRecord } from '@/utils/toRecord';

export type Params = Record<string, any>;

export type RasterStyles = {
  name: string;
  baseMapStyle: string;
  params: Params[];
};

export type BaseMapOption = {
  name: string;
  style: string;
};

export type BinningOption = {
  name: string;
  params: Params;
  type: BinningType;
};

export type BinningType = 'POLY' | 'POINT';

export type ColorOption = {
  name: string;
  params: MaybeArray<Params>;
  type: BinningType;
};

export type MapWidgetOptions = {
  defaults: {
    basemap: string;
    bin: string;
    color: number; // The name property is not unique, so we use the index
    predefined: string;
  };
  supportedMapLocales: Record<string, string>;
  localizedStyles: Record<string, string>;
  basemaps: BaseMapOption[];
  binning: BinningOption[];
  colors: ColorOption[];
  predefined: RasterStyles[];
  projections: { i18nKey: string; value: Projection }[];
};

export const mapWidgetOptions: MapWidgetOptions = {
  defaults: {
    basemap: 'LIGHT',
    bin: 'SMALL_HEX',
    color: 8, // The name property is not unique, so we use the index
    predefined: 'GREEN',
  },
  supportedMapLocales: toRecord(
    ['ar', 'da', 'de', 'en', 'es', 'fr', 'ja', 'pt', 'ru', 'zh'],
    (x) => x // will create an object with the same key and value
  ),
  localizedStyles: toRecord(
    ['gbif-geyser', 'gbif-tuatara', 'osm-bright'],
    (x) => x // will create an object with the same key and value
  ),
  basemaps: [
    {
      name: 'CLASSIC',
      style: 'gbif-classic',
    },
    {
      name: 'LIGHT',
      style: 'gbif-light',
    },
    {
      name: 'LIGHT_DETAILS',
      style: 'gbif-geyser',
    },
    {
      name: 'DARK',
      style: 'gbif-dark',
    },
    {
      name: 'DARK_DETAILS',
      style: 'gbif-tuatara',
    },
    {
      name: 'OSM',
      style: 'osm-bright',
    },
  ],
  binning: [
    {
      name: 'PIXEL',
      params: {},
      type: 'POINT',
    },
    {
      name: 'SMALL_HEX',
      params: { bin: 'hex', hexPerTile: 79 },
      type: 'POLY',
    },
    {
      name: 'LARGE_HEX',
      params: { bin: 'hex', hexPerTile: 17 },
      type: 'POLY',
    },
    {
      name: 'SMALL_SQUARE',
      params: { bin: 'square', squareSize: 64 },
      type: 'POLY',
    },
    {
      name: 'LARGE_SQUARE',
      params: { bin: 'square', squareSize: 256 },
      type: 'POLY',
    },
  ],
  colors: [
    {
      name: 'CLASSIC',
      params: { style: 'classic.point' },
      type: 'POINT',
    },
    {
      name: 'PURPLE_YELLOW',
      params: { style: 'purpleYellow.point' },
      type: 'POINT',
    },
    {
      name: 'PURPLE_HEAT',
      params: { style: 'purpleHeat.point' },
      type: 'POINT',
    },
    {
      name: 'BLUE_HEAT',
      params: { style: 'blueHeat.point' },
      type: 'POINT',
    },
    {
      name: 'GREEN_POINT',
      params: { style: 'green.point' },
      type: 'POINT',
    },
    {
      name: 'ORANGE_HEAT',
      params: { style: 'orangeHeat.point' },
      type: 'POINT',
    },
    {
      name: 'FIRE',
      params: { style: 'fire.point' },
      type: 'POINT',
    },
    {
      name: 'GLACIER',
      params: { style: 'glacier.point' },
      type: 'POINT',
    },
    {
      name: 'CLASSIC',
      params: { style: 'classic.poly' },
      type: 'POLY',
    },
    {
      name: 'PURPLE_YELLOW',
      params: { style: 'purpleYellow.poly' },
      type: 'POLY',
    },
    {
      name: 'GREEN',
      params: { style: 'green2.poly' },
      type: 'POLY',
    },
    {
      name: 'BLUE_CLUSTER',
      params: [{ style: 'outline.poly' }, { style: 'blue.marker' }],
      type: 'POLY',
    },
    {
      name: 'ORANGE_CLUSTER',
      params: [{ style: 'outline.poly' }, { style: 'orange.marker' }],
      type: 'POLY',
    },
  ],
  predefined: [
    {
      name: 'CLASSIC',
      baseMapStyle: 'gbif-classic',
      params: [],
    },
    {
      name: 'CLASSIC_HEX',
      baseMapStyle: 'gbif-classic',
      params: [{ style: 'classic.poly', bin: 'hex', hexPerTile: 70 }],
    },
    {
      name: 'STREETS',
      baseMapStyle: 'osm-bright',
      params: [
        { style: 'outline.poly', bin: 'hex', hexPerTile: 15 },
        {
          style: 'orange.marker',
          bin: 'hex',
          hexPerTile: 15,
        },
      ],
    },

    {
      name: 'GLACIER',
      baseMapStyle: 'gbif-tuatara',
      params: [{ style: 'glacier.point' }],
    },
    {
      name: 'GREEN',
      baseMapStyle: 'gbif-dark',
      params: [{ style: 'green.point' }],
    },
  ],
  projections: [
    { i18nKey: 'map.projections.ARCTIC', value: 'EPSG_3575' },
    { i18nKey: 'map.projections.PLATE_CAREE', value: 'EPSG_4326' },
    { i18nKey: 'map.projections.MERCATOR', value: 'EPSG_3857' },
    { i18nKey: 'map.projections.ANTARCTIC', value: 'EPSG_3031' },
  ],
};
