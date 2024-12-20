import mergeWith from 'lodash/mergeWith';
import React from 'react';
import { SearchMetadata } from '../contexts/search';
import { configDefault } from './configDefaults';
import { Endpoints, GbifEnv } from './endpoints';
import themeBuilder from './theme/index';
import { Theme } from './theme/theme';

export type PageConfig = {
  id: string;
  isCustom?: boolean;
  path?: string;
};

export type LanguageOption = {
  code: string; // this codes are passed to react-intl, so they must be valid locale codes. Altenatively we need an extra field for the locale code used by react-intl
  label: string;
  default: boolean;
  textDirection: 'ltr' | 'rtl';
  cmsLocale?: string; // this is the locale code used by the CMS
  reactIntlLocale?: string; // this is the locale code used by react-intl
  vocabularyLocale?: string; // this is the locale code used by the vocabulary server
};

type PartialSearchMetadata = Pick<
  SearchMetadata,
  'availableTableColumns' | 'defaultEnabledTableColumns' | 'tabs' | 'defaultTab'
>;

// TODO: The config object should probably be refactored in the future with logical nesting
export type Config = Endpoints & {
  version: number;
  suggest: {
    gadm: { type: 'PARAMS'; value: { gadmGid: string } };
  };
  defaultTitle?: string;
  gbifEnv: GbifEnv;
  languages: LanguageOption[];
  pages?: PageConfig[];
  theme?: Partial<Theme>;
  baseUrl: string; // e.g. 'https://www.gbif.org'
  // OpenGraph only works on server side rendered pages. So gbif.org.
  // OpenGraph tags will not be added if this is not set
  openGraph?: {
    site_name: string; // e.g. 'GBIF'
  };
  OBISKey: string;
  taiwanNodeidentifier: string;
  linkToGbifOrg?: boolean;
  datasetSearch?: SearchMetadata;
  /** Never add options to table cells to modify filters */
  disableInlineTableFilterButtons?: boolean;
  /** Key string value pairs for translations. E.g. {en: Record<string, string>, es: Record<string, string>} */
  messages?: Record<string, Record<string, string>>;
  datasetKey?: {
    literatureSearch: PartialSearchMetadata;
    occurrenceSearch: PartialSearchMetadata;
  };
  collectionSearch?: SearchMetadata;
  collectionKey?: {
    occurrenceSearch: PartialSearchMetadata;
  };
  institutionSearch?: SearchMetadata;
  institutionKey?: {
    occurrenceSearch: PartialSearchMetadata;
  };
  occurrenceSearch?: SearchMetadata;
  publisherSearch?: SearchMetadata;
  publisherKey?: {
    literatureSearch: PartialSearchMetadata;
  };
  taxonSearch?: SearchMetadata;
  taxonKey?: {
    literatureSearch: PartialSearchMetadata;
  };
  literatureSearch?: SearchMetadata;
  extraOccurrenceSearchPages?: Array<{
    path: string;
    overwriteConfig: Partial<Config>;
  }>;
  maps: {
    locale?: string;
    mapStyles: {
      defaultProjection: 'MERCATOR' | 'PLATE_CAREE' | 'ARCTIC' | 'ANTARCTIC';
      defaultMapStyle: MapStyleType;
      options: {
        ARCTIC: MapStyleType[];
        PLATE_CAREE: MapStyleType[];
        MERCATOR: MapStyleType[];
        ANTARCTIC: MapStyleType[];
      };
    };
    addMapStyles?: (args: {
      mapStyleServer: string;
      language: string;
      pixelRatio: number;
      apiKeys: string[];
      mapComponents: {
        OpenlayersMap: React.ComponentType;
        MapboxMap: React.ComponentType;
      };
    }) => Record<
      string,
      {
        component: React.ComponentType;
        labelKey: string;
        mapConfig: {
          basemapStyle: string;
          projection: Projection;
        };
      }
    >;
    styleLookup?: Partial<Record<ProjectionName, Record<string, string>>>;
  };
};

type Projection = 'EPSG_4326' | 'EPSG_3857' | 'EPSG_3031' | 'EPSG_3575';
type ProjectionName = 'PLATE_CAREE' | 'MERCATOR' | 'ARCTIC' | 'ANTARCTIC';
type MapStyleType = 'NATURAL' | 'BRIGHT' | 'DARK' | 'SATELLITE' | string;

const ConfigContext = React.createContext<Config | null>(null);

type Props = {
  children?: React.ReactNode;
  config: Config;
};

type CssVariable = { name: string; value: unknown };

export function ConfigProvider({ config, children }: Props): React.ReactElement {
  // Create css for theming based on the baseTheme and the theme extension
  const css: { style: string; config: Config } = React.useMemo(() => {
    const theme = themeBuilder({
      baseTheme: 'light',
      extendWith: config.theme,
    });

    const cssVariables: CssVariable[] = Object.entries(theme)
      // Remove all key value pairs where the value is null
      .filter(([, value]) => value != null)
      // Convert to css variables
      .map(([key, value]) => {
        // Convert hex colors to rgb
        const valueIsHexColor = typeof value === 'string' && value.startsWith('#');
        if (valueIsHexColor) {
          // convert to rgb components
          const rgb = value.match(/[A-Za-z0-9]{2}/g)?.map((v) => parseInt(v, 16));

          if (rgb?.length === 3) {
            return { name: `--${key}`, value: rgb.join(' ') };
          }
        }

        return { name: `--${key}`, value };
      });
    // Convert css variables to actual css that will be injected in the document
    function customizer(_current: unknown, next: unknown) {
      if (Array.isArray(next)) {
        return next;
      }
    }

    const mergedConfig = mergeWith(
      {},
      configDefault,
      { theme, variables: cssVariables },
      config,
      customizer
    );
    return {
      style: `:root { ${cssVariables.map((v) => `${v.name}: ${v.value};`).join('\n')} }`,
      config: mergedConfig,
    };
  }, [config]);

  return (
    <ConfigContext.Provider value={css.config}>
      <style>{css.style}</style>
      {children}
    </ConfigContext.Provider>
  );
}

export function OverwriteConfigProvider({ config, children }: Props): React.ReactElement {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig(): Config {
  const ctx = React.useContext(ConfigContext);
  if (ctx == null) throw new Error('useConfig must be used within a ConfigProvider');
  return ctx;
}
