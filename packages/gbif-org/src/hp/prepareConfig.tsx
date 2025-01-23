import { Config } from '@/config/config';
import { getEndpoints } from '@/config/endpoints';
import { merge } from 'ts-deepmerge';
import { configAdapter } from './configAdapter';

export function prepareConfig(config: unknown): Config {
  if (typeof config !== 'object' || config === null) {
    console.error('Invalid config object. It must be an object.');
  }

  const convertedConfig = configAdapter(config as object);
  const configWithDefaults = merge.withOptions(
    { allowUndefinedOverrides: false },
    convertedConfig,
    getEndpoints()
  ) as Config;

  return configWithDefaults;
}
