// though simple it would be good to test these. I'm also a bit surprised there isn't an easier way to do this (without including a 10kb library)
// I used to rely a lot on the now deprecated querystring libarary.
type paramValue = string | number | undefined | null;

export function stringify(params: Record<string, paramValue | (paramValue)[]>) {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const singleValue = params[key];
    const values = Array.isArray(singleValue) ? singleValue : [singleValue];
    values.forEach((value: string | number | null | undefined) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value as string);
      }
    });
  }

  return searchParams.toString();
}

export function parse(serialized: string) {
  const params = new URLSearchParams(serialized);
  const result: Record<string, string | number | (string | number)[]> = {};

  for (const key of params.keys()) {
      const values = params.getAll(key);
      result[key] = values.length === 1 ? tryParseNumber(values[0]) : values.map(tryParseNumber);
    }

  return result;
}

function tryParseNumber(value: string): string | number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? value : parsed;
}