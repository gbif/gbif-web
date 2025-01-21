import { merge } from 'ts-deepmerge';
import { configAdapter } from './configAdapter';
import { GbifEnv, getDefaultEndpointsBasedOnGbifEnv } from '@/config/endpoints';
import { Config } from '@/config/config';

export function prepareConfig(config: unknown): Config {
  if (typeof config !== 'object' || config === null) {
    console.error('Invalid config object. It must be an object.');
  }

  const convertedConfig = configAdapter(config as object);
  const configWithDefaults = merge.withOptions(
    { allowUndefinedOverrides: false },
    convertedConfig,
    getDefaultEndpointsBasedOnGbifEnv(convertedConfig.gbifEnv ?? GbifEnv.Prod)
  ) as Config;

  return configWithDefaults;
}
