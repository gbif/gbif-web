export enum GbifEnv {
  Prod = 'prod',
  Dev = 'dev',
  Uat = 'uat',
  Staging = 'staging',
}

// This will be added to the config based on the gbifEnv
export type Endpoints = {
  graphqlEndpoint: string;
  webApiEndpoint: string;
  translationsEntryEndpoint: string;
  countEndpoint: string;
  formsEndpoint: string;
  v1Endpoint?: string;
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
      webApiEndpoint: 'https://graphql.gbif.org',
      countEndpoint: 'https://hp-search.gbif.org',
      formsEndpoint: 'https://graphql.gbif.org/forms',
      v1Endpoint: 'https://api.gbif.org/v1',
    },
    [GbifEnv.Dev]: {
      translationsEntryEndpoint:
        'https://react-components.gbif-dev.org/lib/translations/translations.json',
      graphqlEndpoint: 'https://graphql.gbif-dev.org/graphql',
      webApiEndpoint: 'https://graphql.gbif-dev.org',
      countEndpoint: 'https://hp-search.gbif-dev.org',
      formsEndpoint: 'https://graphql.gbif-dev.org/forms',
      v1Endpoint: 'https://api.gbif-dev.org/v1',
    },
    [GbifEnv.Uat]: {
      translationsEntryEndpoint:
        'https://react-components.gbif-uat.org/lib/translations/translations.json',
      graphqlEndpoint: 'https://graphql.gbif-uat.org/graphql',
      webApiEndpoint: 'https://graphql.gbif-uat.org',
      countEndpoint: 'https://hp-search.gbif-uat.org',
      formsEndpoint: 'https://graphql.gbif-uat.org/forms',
      v1Endpoint: 'https://api.gbif-uat.org/v1',
    },
    [GbifEnv.Staging]: {
      translationsEntryEndpoint:
        'https://react-components.gbif-staging.org/lib/translations/translations.json',
      graphqlEndpoint: 'https://graphql.gbif-staging.org/graphql',
      webApiEndpoint: 'https://graphql.gbif-staging.org',
      countEndpoint: 'https://hp-search.gbif-staging.org',
      formsEndpoint: 'https://graphql.gbif-staging.org/forms',
      v1Endpoint: 'https://api.gbif-staging.org/v1',
    },
  }[gbifEnv];

  endpoints.webApiEndpoint =
    import.meta.env.PUBLIC_WEB_API_ENDPOINT ??
    env?.PUBLIC_WEB_API_ENDPOINT ??
    endpoints.webApiEndpoint;

  endpoints.graphqlEndpoint =
    import.meta.env.PUBLIC_GRAPHQL_ENDPOINT ??
    env?.PUBLIC_GRAPHQL_ENDPOINT ??
    endpoints.graphqlEndpoint;

  endpoints.translationsEntryEndpoint =
    import.meta.env.PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT ??
    env?.PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT ??
    endpoints.translationsEntryEndpoint;

  endpoints.countEndpoint =
    import.meta.env.PUBLIC_COUNT_ENDPOINT ?? env?.PUBLIC_COUNT_ENDPOINT ?? endpoints.countEndpoint;

  endpoints.formsEndpoint =
    import.meta.env.PUBLIC_FORMS_ENDPOINT ?? env?.PUBLIC_FORMS_ENDPOINT ?? endpoints.formsEndpoint;

  return endpoints;
}

export class InvalidGbifEnvError extends Error {
  constructor(gbifEnv: string) {
    super(`Unknown gbifEnv: ${gbifEnv}. Must be one of ${Object.values(GbifEnv).join(', ')}`);
  }
}
