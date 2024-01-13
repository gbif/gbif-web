export enum GbifEnv {
  Prod = 'prod',
  Dev = 'dev',
  Uat = 'uat',
  Staging = 'staging',
}

// This will be added to the config based on the gbifEnv
export type Endpoints = {
  graphqlEndpoint: string;
  translationsEntryEndpoint: string;
};

export function isGbifEnv(value: string): value is GbifEnv {
  return Object.values(GbifEnv).includes(value as GbifEnv);
}

export function getEndpointsBasedOnGbifEnv(
  gbifEnv: GbifEnv,
  // Used in the codegen script as it will not have access to the env variables
  env?: Record<string, string>
): Endpoints {
  // This can happen as the gbifEnv is passed as a string when configuring the HostedPortal
  if (!isGbifEnv(gbifEnv)) {
    throw new InvalidGbifEnvError(gbifEnv);
  }

  const endpoints: Endpoints = {
    [GbifEnv.Prod]: {
      translationsEntryEndpoint:
        'https://react-components.gbif.org/lib/translations/translations.json',
      graphqlEndpoint: 'https://graphql.gbif.org/graphql',
    },
    [GbifEnv.Dev]: {
      translationsEntryEndpoint:
        'https://react-components.gbif-dev.org/lib/translations/translations.json',
      graphqlEndpoint: 'https://graphql.gbif-dev.org/graphql',
    },
    [GbifEnv.Uat]: {
      translationsEntryEndpoint:
        'https://react-components.gbif-uat.org/lib/translations/translations.json',
      graphqlEndpoint: 'https://graphql.gbif-uat.org/graphql',
    },
    [GbifEnv.Staging]: {
      translationsEntryEndpoint:
        'https://react-components.gbif-staging.org/lib/translations/translations.json',
      graphqlEndpoint: 'https://graphql.gbif-staging.org/graphql',
    },
  }[gbifEnv];

  endpoints.graphqlEndpoint =
    import.meta.env.PUBLIC_GRAPHQL_ENDPOINT ??
    env?.PUBLIC_GRAPHQL_ENDPOINT ??
    endpoints.graphqlEndpoint;

  endpoints.translationsEntryEndpoint =
    import.meta.env.PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT ??
    env?.PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT ??
    endpoints.translationsEntryEndpoint;

  return endpoints;
}

export class InvalidGbifEnvError extends Error {
  constructor(gbifEnv: string) {
    super(`Unknown gbifEnv: ${gbifEnv}. Must be one of ${Object.values(GbifEnv).join(', ')}`);
  }
}
