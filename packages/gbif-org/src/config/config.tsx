import React from 'react';
import { Endpoints, GbifEnv } from './endpoints';
import themeBuilder from './theme/index';
import { Theme } from './theme/theme';
import { SearchMetadata } from '../contexts/search';

type PageConfig = {
  id: string;
};

export type LanguageOption = {
  code: string; // this codes are passed to react-intl, so they must be valid locale codes. Altenatively we need an extra field for the locale code used by react-intl
  label: string;
  default: boolean;
  textDirection: 'ltr' | 'rtl';
  cmsLocale?: string; // this is the locale code used by the CMS
  reactIntlLocale?: string; // this is the locale code used by react-intl
};

export type Config = Endpoints & {
  defaultTitle?: string;
  gbifEnv: GbifEnv;
  languages: LanguageOption[];
  occurrencePredicate: any;
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
  collectionSearch?: SearchMetadata;
  institutionSearch?: SearchMetadata;
  occurrenceSearch?: SearchMetadata;
  publisherSearch?: SearchMetadata;
  literatureSearch?: SearchMetadata;
  extraOccurrenceSearchPages?: Array<{
    path: string;
    overwriteConfig: Partial<Config>;
  }>;
};

const ConfigContext = React.createContext<Config | null>(null);

type Props = {
  children?: React.ReactNode;
  config: Config;
};

type CssVariable = { name: string; value: unknown };

export function ConfigProvider({ config, children }: Props): React.ReactElement {
  // Create css for theming based on the baseTheme and the theme extension
  const css: string = React.useMemo(() => {
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
    return `:root { ${cssVariables.map((v) => `${v.name}: ${v.value};`).join('\n')} }`;
  }, [config]);

  return (
    <ConfigContext.Provider value={config}>
      <style>{css}</style>
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
