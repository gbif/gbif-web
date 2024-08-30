// though simple it would be good to test these. I'm also a bit surprised there isn't an easier way to do this (without including a 10kb library)
// I used to rely a lot on the now deprecated querystring libarary.
// perhaps we should just use the query-string library?
export type ParamValue = string | number | undefined | null | JSON | object;
export type ParamQuery = Record<string, ParamValue | ParamValue[]>;

export function stringify(params: ParamQuery) {
  return asStringParams(params).toString();
}

export function asStringParams(params: ParamQuery): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const singleValue = params[key];
    const values = Array.isArray(singleValue) ? singleValue : [singleValue];
    values.forEach((value: ParamValue) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, value as string);
        }
      }
    });
  }

  return searchParams;
}

export function parse(serialized: string): ParamQuery {
  const params = new URLSearchParams(serialized);
  return parseParams(params);
}

export function parseParams(params: URLSearchParams, asArrays?: boolean): ParamQuery {
  const result: ParamQuery = {};

  for (const key of params.keys()) {
    const values = params.getAll(key);
    if (asArrays) {
      result[key] = values.map(tryParse);
    } else {
      result[key] = values.length === 1 ? tryParse(values[0]) : values.map(tryParse);
    }
  }

  return result;
}

function tryParse(value: string): string | number | JSON {
  let jsonValue = value;
  try {
    jsonValue = JSON.parse(value);
  } catch (e) {
    // if JSON.parse fails, it is not a JSON string
  }
  const parsed = parseFloat(jsonValue);
  return isNaN(parsed) ? jsonValue : parsed;
}
