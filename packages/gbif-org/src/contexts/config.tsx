import { foregroundColorContrast } from '@/utils/foregroundColorContrast';
import { toRecord } from '@/utils/toRecord';
import React from 'react';

type PageConfig = {
  key: string;
};

export enum GbifEnv {
  Prod = 'prod',
  Dev = 'dev',
  Uta = 'uta',
  Staging = 'staging',
}

export function isGbifEnv(value: string): value is GbifEnv {
  return Object.values(GbifEnv).includes(value as GbifEnv);
}

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

// This will be added to the config based on the gbifEnv
type Endpoints = {
  graphqlEndpoint: string;
  translationsEntryEndpoint: string;
};

export type Config = InputConfig & Endpoints;

const ConfigContext = React.createContext<Config | null>(null);

type Props = {
  children?: React.ReactNode;
  config: InputConfig;
};

type CssVariable = { name: string; value: unknown; postFix?: string };

export function ConfigProvider({ config, children }: Props): React.ReactElement {
  const variables = React.useMemo(() => {
    const cssVariables: CssVariable[] = [
      { name: '--primary', value: config.theme?.colors?.primary },
      { name: '--primary-foreground', value: config.theme?.colors?.primaryForeground },
      { name: '--radius', value: config.theme?.borderRadius, postFix: 'rem' },
    ];

    return addSensibleForegroundColors(cssVariables).filter((v) => v.value != null);
  }, [config]);

  const contextValue: Config = React.useMemo(() => processConfig(config), [config]);

  return (
    <ConfigContext.Provider value={contextValue}>
      <style>{`:root { ${variables
        .map((v) => `${v.name}: ${v.value}${v.postFix ?? ''};`)
        .join('\n')} }`}</style>
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

function addSensibleForegroundColors(cssVariables: CssVariable[]): CssVariable[] {
  const variablesByNameRecord = toRecord(cssVariables, (v) => v.name);

  return cssVariables.map((variable) => {
    // Skip if the variable is not a foreground color
    if (!variable.name.endsWith('-foreground')) return variable;

    // Skip if the variable already has a value
    if (variable.value != null) return variable;

    // Get the background color variable
    const bgName = variable.name.replace('-foreground', '');
    const bgVariable = variablesByNameRecord[bgName];

    // Skip if the background color variable does not exist or is not of type string
    if (bgVariable == null || typeof bgVariable.value !== 'string') return variable;

    // Calculate the foreground color
    const newForegroundColor = foregroundColorContrast(bgVariable.value);
    return { ...variable, value: newForegroundColor };
  });
}

export function processConfig(config: InputConfig): Config {
  return {
    ...getEndpointsBasedOnGbifEnv(config.gbifEnv),
    ...config,
  };
}

export function getEndpointsBasedOnGbifEnv(gbifEnv: GbifEnv): Endpoints {
  // This can happen as the gbifEnv is passed as a string when configuring the HostedPortal
  if (!isGbifEnv(gbifEnv)) {
    throw new InvalidGbifEnvError(gbifEnv);
  }

  switch (gbifEnv) {
    case GbifEnv.Prod:
      return {
        translationsEntryEndpoint:
          'https://react-components.gbif.org/lib/translations/translations.json',
        graphqlEndpoint: 'https://graphql.gbif-staging.org/graphql',
      };
    case GbifEnv.Dev:
      return {
        translationsEntryEndpoint:
          'https://react-components.gbif.org/lib/translations/translations.json',
        graphqlEndpoint: 'https://graphql.gbif-staging.org/graphql',
      };
    case GbifEnv.Uta:
      return {
        translationsEntryEndpoint:
          'https://react-components.gbif.org/lib/translations/translations.json',
        graphqlEndpoint: 'https://graphql.gbif-staging.org/graphql',
      };
    case GbifEnv.Staging:
      return {
        translationsEntryEndpoint:
          'https://react-components.gbif.org/lib/translations/translations.json',
        graphqlEndpoint: 'https://graphql.gbif-staging.org/graphql',
      };
  }
}

export class InvalidGbifEnvError extends Error {
  constructor(gbifEnv: string) {
    super(`Unknown gbifEnv: ${gbifEnv}. Must be one of ${Object.values(GbifEnv).join(', ')}`);
  }
}
