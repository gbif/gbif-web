import React from 'react';
import { Endpoints, GbifEnv, getEndpointsBasedOnGbifEnv } from './endpoints';
import themeBuilder from './theme/index';
import { Theme } from './theme/theme';

type PageConfig = {
  key: string;
};

export type InputConfig = {
  defaultTitle?: string;
  gbifEnv: GbifEnv;
  languages: {
    code: string; // this codes are passed to react-intl, so they must be valid locale codes. Altenatively we need an extra field for the locale code used by react-intl
    label: string;
    default: boolean;
    textDirection: 'ltr' | 'rtl';
    cmsLocale?: string; // this is the locale code used by the CMS
  }[];
  occurrencePredicate: any;
  pages?: PageConfig[];
  theme?: Partial<Theme>;
};

export type Config = InputConfig & Endpoints;

const ConfigContext = React.createContext<Config | null>(null);

type Props = {
  children?: React.ReactNode;
  config: InputConfig;
};

type CssVariable = { name: string; value: unknown };

export function ConfigProvider({ config, children }: Props): React.ReactElement {
  // Build the config context value that will made available to all components
  const contextValue: Config = React.useMemo(() => configBuilder(config), [config]);

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
    <ConfigContext.Provider value={contextValue}>
      <style>{css}</style>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): Config {
  const ctx = React.useContext(ConfigContext);
  if (ctx == null) throw new Error('useConfig must be used within a ConfigProvider');
  return ctx;
}

export function configBuilder(config: InputConfig): Config {
  return {
    ...getEndpointsBasedOnGbifEnv(config.gbifEnv),
    ...config,
  };
}
