import useFetchGet from '@/hooks/useFetchGet';
import { stringify } from '@/utils/querystring';
import { Params } from '../options';

export type Capabilities = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  minYear: number;
  maxYear: number;
  total: number;
  generated: string;
};

type Args = {
  capabilitiesParams: Params;
};

type Result = {
  data?: Capabilities;
};

export function useCapabilities({ capabilitiesParams }: Args): Result {
  const queryString = stringify(capabilitiesParams);

  const endpoint =
    import.meta.env.PUBLIC_API_V2 +
    '/map/occurrence/density/capabilities.json' +
    (queryString ? `?${queryString}` : '');

  return useFetchGet({
    endpoint: endpoint,
    keepDataWhileLoading: true,
  });
}
