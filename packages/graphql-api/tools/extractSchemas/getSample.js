/*
Extract sample data from an endpoint and save it
*/
import fs from 'fs';
import got from 'got';
import qs from 'qs';
import commandLineArgs from 'command-line-args';

const cliOptions = [
  {
    name: 'api_v1',
    alias: 'a',
    type: String,
    defaultValue: 'https://api.gbif.org/v1',
  },
  { name: 'endpoint', alias: 'e', type: String },
  { name: 'paging', alias: 'p', type: Boolean, defaultValue: false },
  { name: 'size', alias: 's', type: Number, defaultValue: 100 },
  { name: 'name', alias: 'n', type: String, defaultValue: 'tmp' },
];
const options = commandLineArgs(cliOptions);

if (!options.endpoint) {
  throw new Error(
    'An endpoint is required. e.g. "grscicoll/collection/search"',
  );
}
console.log(options);

async function getData(url, query) {
  const res = await got(url, {
    prefixUrl: options.api_v1,
    searchParams: qs.stringify(query),
    responseType: 'json',
  });
  if (res.statusCode !== 200) {
    throw Error(`Unable to get data from: ${url}`);
  }
  return res.body;
}

function saveFile(obj, fileName) {
  const name = `${__dirname}/data/${fileName}.json`;
  fs.writeFile(name, JSON.stringify(obj, null, 2), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`File saved as: ${name}`);
    }
  });
}

async function extract() {
  if (!options.paging) {
    // no paging, just get the required size
    const response = await getData(options.endpoint, { limit: options.size });
    saveFile(response.results, options.name);
  } else {
    // the endpoint has paging, iterate to the requested size, 100 at a time
    const limit = 100;
    let offset = 0;
    let endOfRecords = false;
    let samples = [];
    let count;
    while (!endOfRecords) {
      console.log(`offset: ${offset}`, 'limit: ', limit);
      // eslint-disable-next-line no-await-in-loop
      const response = await getData(options.endpoint, {
        limit,
        offset,
      });
      offset += limit;
      endOfRecords = offset > options.size || response.count < offset;
      samples = samples.concat(response.results);
      console.log(`samples: ${samples.length}`);
      if (!count) {
        count = response.count;
        console.log(`count: ${count}`);
      }
    }
    saveFile(samples, options.name);
  }
}

extract();
