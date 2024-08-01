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
  countEndpoint: string;
  formsEndpoint: string;
  v1Endpoint?: string;
};

export function isGbifEnv(value: string): value is GbifEnv {
  return Object.values(GbifEnv).includes(value as GbifEnv);
}

export function getDefaultEndpointsBasedOnGbifEnv(gbifEnv: GbifEnv): Endpoints {
  // This can happen as the gbifEnv is passed as a string when configuring the HostedPortal
  if (!isGbifEnv(gbifEnv)) {
    throw new InvalidGbifEnvError(gbifEnv);
  }

  const endpoints: Endpoints = {
    [GbifEnv.Prod]: {
      translationsEntryEndpoint:
        'https://react-components.gbif.org/lib/translations/translations.json',
      graphqlEndpoint: 'https://graphql.gbif.org/graphql',
      countEndpoint: 'https://hp-search.gbif.org',
      formsEndpoint: 'https://graphql.gbif.org/forms',
      v1Endpoint: 'https://api.gbif.org/v1',
    },
    [GbifEnv.Dev]: {
      translationsEntryEndpoint:
        'https://react-components.gbif-dev.org/lib/translations/translations.json',
      graphqlEndpoint: 'https://graphql.gbif-dev.org/graphql',
      countEndpoint: 'https://hp-search.gbif-dev.org',
      formsEndpoint: 'https://graphql.gbif-dev.org/forms',
      v1Endpoint: 'https://api.gbif-dev.org/v1',
    },
    [GbifEnv.Uat]: {
      translationsEntryEndpoint:
        'https://react-components.gbif-uat.org/lib/translations/translations.json',
      graphqlEndpoint: 'https://graphql.gbif-uat.org/graphql',
      countEndpoint: 'https://hp-search.gbif-uat.org',
      formsEndpoint: 'https://graphql.gbif-uat.org/forms',
      v1Endpoint: 'https://api.gbif-uat.org/v1',
    },
    [GbifEnv.Staging]: {
      translationsEntryEndpoint:
        'https://react-components.gbif-staging.org/lib/translations/translations.json',
      graphqlEndpoint: 'https://graphql.gbif-staging.org/graphql',
      countEndpoint: 'https://hp-search.gbif-staging.org',
      formsEndpoint: 'https://graphql.gbif-staging.org/forms',
      v1Endpoint: 'https://api.gbif-staging.org/v1',
    },
  }[gbifEnv];

  return endpoints;
}

export class InvalidGbifEnvError extends Error {
  constructor(gbifEnv: string) {
    super(`Unknown gbifEnv: ${gbifEnv}. Must be one of ${Object.values(GbifEnv).join(', ')}`);
  }
}
