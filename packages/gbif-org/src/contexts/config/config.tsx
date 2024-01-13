import React from 'react';
import { Endpoints, GbifEnv, getEndpointsBasedOnGbifEnv } from './endpoints';
import themeBuilder from './theme/index';

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
  theme?: {
    colors?: {
      primary?: string;
      primaryForeground?: string;
    };
    borderRadius?: number;
  };
};

export type Config = InputConfig & Endpoints;

const ConfigContext = React.createContext<Config | null>(null);

type Props = {
  children?: React.ReactNode;
  config: InputConfig;
};

type CssVariable = { name: string; value: unknown };

export function ConfigProvider({ config, children }: Props): React.ReactElement {
  const variables = React.useMemo(() => {
    const theme = themeBuilder({
      baseTheme: 'light',
      extendWith: {
        primary: config.theme?.colors?.primary,
        borderRadius: config.theme?.borderRadius,
      },
    });
    const cssVariables: CssVariable[] = [];
    for (const [key, value] of Object.entries(theme)) {
      if (!(value instanceof Object)) {
        if (typeof value === 'string' && value.startsWith('#')) {
          // convert to rgb components
          const rgb = value.match(/[A-Za-z0-9]{2}/g)?.map((v) => parseInt(v, 16));
          if (rgb?.length === 3) {
            cssVariables.push({ name: `--${key}`, value: rgb.join(' ') });
          }
        } else {
          cssVariables.push({ name: `--${key}`, value });
        }
      }
    }

    return cssVariables.filter((v) => v.value != null);
  }, [config]);

  const contextValue: Config = React.useMemo(() => processConfig(config), [config]);

  return (
    <ConfigContext.Provider value={contextValue}>
      <style>{`:root { ${variables.map((v) => `${v.name}: ${v.value};`).join('\n')} }`}</style>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): Config {
  const ctx = React.useContext(ConfigContext);

  if (ctx == null) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }

  return ctx;
}

export function processConfig(config: InputConfig): Config {
  return {
    ...getEndpointsBasedOnGbifEnv(config.gbifEnv),
    ...config,
  };
}
