import mergeWith from 'lodash/mergeWith';
import React from 'react';
import {
  OccurrenceSearchMetadata,
  PublisherSearchMetadata,
  SearchMetadata,
} from '../contexts/search';
import { configDefault } from './configDefaults';
import { Endpoints } from './endpoints';
import themeBuilder from './theme/index';
import { Theme } from './theme/theme';

export type PageConfig = {
  id: string;
  isCustom?: boolean;
  path?: string;
  redirect?: boolean;
  gbifRedirect?: (
    params: Record<string, string | undefined>,
    locale: LanguageOption
  ) => string | null;
};

export type LanguageOption = {
  /** code is really just a prefix */
  code: string; // this is really just a prefix and identifier for the language
  localeCode: string; // this codes are passed to react-intl, so they must be valid locale codes.
  label: string;
  default: boolean;
  textDirection: 'ltr' | 'rtl';
  cmsLocale?: string; // this is the locale code used by the CMS
  reactIntlLocale?: string; // this is the locale code used by react-intl
  vocabularyLocale?: string; // this is the locale code used by the vocabulary server
  mapTileLocale?: string; // this is the locale code used by the map tile server
  iso3LetterCode?: string;
  gbifOrgLocalePrefix?: string;
  grSciCollLocalePrefix?: string;
};

type PartialSearchMetadata = Pick<
  SearchMetadata,
  | 'availableTableColumns'
  | 'defaultEnabledTableColumns'
  | 'tabs'
  | 'defaultTab'
  | 'excludedFilters'
  | 'highlightedFilters'
>;

type ApiKeysType = {
  maptiler?: string;
};
// TODO: The config object should probably be refactored in the future with logical nesting
export type Config = Endpoints & {
  version: number;
  testSite: boolean; // clearly indicate that it is a test site
  experimentalFeatures: {
    localContextEnabled: boolean;
  };
  feedback?: {
    enabled?: boolean;
    gbifFeedback?: boolean;
    showFeedbackInDataHeader?: boolean;
    // only relevant for hosted portals
    githubRepo?: string;
    githubMessage?: string;
    githubUsernames?: string[];
    contactEmail?: string;
  };
  notFoundPageImageUrl?: string;
  defaultChecklistKey?: string;
  availableChecklistKeys?: string[];
  suggest?: {
    gadm?: { type: 'PARAMS'; value: { gadmGid: string } };
  };
  defaultTitle?: string;
  languages: LanguageOption[];
  pages?: PageConfig[];
  theme?: Partial<Theme>;
  baseUrl: string; // e.g. 'https://www.gbif.org'
  // OpenGraph only works on server side rendered pages. So gbif.org.
  // OpenGraph tags will not be added if this is not set
  openGraph?: {
    site_name: string; // e.g. 'GBIF'
  };
  // The data header info and api popups are not translated yet, so we want the options to disable them for now
  dataHeader: {
    enableApiPopup: boolean;
    enableInfoPopup: boolean;
  };
  hardcodedKeys: {
    OBISKey: string;
    taiwanNodeidentifier: string;
  };
  linkToGbifOrg?: boolean;
  datasetSearch?: SearchMetadata;
  /** Never add options to table cells to modify filters */
  disableInlineTableFilterButtons?: boolean;
  /** Key string value pairs for translations. E.g. {en: Record<string, string>, es: Record<string, string>} */
  messages?: Record<string, Record<string, string>>;
  /** Whether or not clicking on table rows on the search pages will open the item in a drawer or navigate to the item page (true by default for backwards compatibility) */
  openDrawerOnTableRowClick?: boolean;
  vernacularNames?: {
    /** the title of the source as it appears in the API for vernacular names https://api.gbif.org/v1/species/5353770/vernacularNames. This will be used to filter common names on individual occurrences. If nothing selected, then the most frequent appearing will be used */
    sourceTitle?: string;
    /** The datasetKey that will be used as the source for common names in suggest. If none then the gbif backbone will be used, which is an automatic mixture of multiple sources */
    datasetKey?: string;
  };
  datasetKey?: {
    literatureSearch?: PartialSearchMetadata;
    occurrenceSearch?: PartialSearchMetadata;
    disableInPageOccurrenceSearch?: boolean;
    showEvents?: boolean;
  };
  collectionSearch?: SearchMetadata;
  collectionKey?: {
    occurrenceSearch: PartialSearchMetadata;
  };
  institutionSearch?: SearchMetadata;
  institutionKey?: {
    occurrenceSearch: PartialSearchMetadata;
  };
  occurrenceSearch?: OccurrenceSearchMetadata;
  publisherSearch?: PublisherSearchMetadata;
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
  availableCatalogues?: (
    | 'INSTITUTION'
    | 'COLLECTION'
    | 'OCCURRENCE'
    | 'DATASET'
    | 'PUBLISHER'
    | 'TAXON'
    | 'LITERATURE'
    | 'RESOURCE'
  )[];
  apiKeys?: ApiKeysType;
  maps: {
    locale?: string;
    mapStyles: {
      defaultProjection: 'MERCATOR' | 'PLATE_CAREE' | 'ARCTIC' | 'ANTARCTIC';
      defaultMapStyle: MapStyleType;
      options: {
        ARCTIC?: MapStyleType[];
        PLATE_CAREE?: MapStyleType[];
        MERCATOR?: MapStyleType[];
        ANTARCTIC?: MapStyleType[];
      };
    };
    addMapStyles?: (args: {
      mapStyleServer: string;
      language: string;
      pixelRatio: number;
      apiKeys?: ApiKeysType;
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

export type Projection = 'EPSG_4326' | 'EPSG_3857' | 'EPSG_3031' | 'EPSG_3575';
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
    if (config?.maps?.mapStyles?.options) {
      mergedConfig.maps.mapStyles.options = config?.maps?.mapStyles?.options;
    }
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
