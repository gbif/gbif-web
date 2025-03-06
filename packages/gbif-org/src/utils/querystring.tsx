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
    const values = params.getAll(key).filter((x) => x !== undefined && x !== null && x !== '');
    if (asArrays) {
      result[key] = values.map(tryParse);
    } else {
      result[key] = values.length === 1 ? tryParse(values[0]) : values.map(tryParse);
    }
  }

  return result;
}

export function tryParse(value: string): string | number | JSON {
  let jsonValue = value;
  try {
    jsonValue = JSON.parse(value);
  } catch (e) {
    // if JSON.parse fails, it is not a JSON string
  }
  if (isValidFloat(value)) {
    return parseFloat(value);
  }
  return jsonValue;
}

function isValidFloat(str: string): boolean {
  // First, parse the string as a float
  const parsed = parseFloat(str);

  // Check if the parsed result is NaN (not a number)
  if (isNaN(parsed)) {
    return false;
  }
  // chat that the original str does not contain letters or characters beyond 0-9 and punctuation .
  if (/[^0-9.]/.test(str)) {
    return false;
  }
  return true;
}
