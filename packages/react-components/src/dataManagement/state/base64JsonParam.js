import { Base64 } from 'js-base64';

export const Base64JsonParam = {
  encode: obj => obj ? Base64.encode(JSON.stringify(obj)) : undefined,
  decode: obj => {
    try {
      const value = obj ? Base64.decode(obj) : obj;
      let parsedValue = JSON.parse(value);
      return parsedValue;
    } catch (err) {
      return undefined;
    }
  }
};

export default Base64JsonParam;