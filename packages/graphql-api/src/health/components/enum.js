import config from '#/config';
import { getSchema } from '#/helpers/enums';
import prevVersionEnums from '#/helpers/enums/enums.json';
import { gql } from 'apollo-server';
import got from 'got';
import { difference, get, zipObject } from 'lodash';
import hash from 'object-hash';

const { apiv1: API_V1 } = config;
const interval = get(config, 'healthUpdateFrequency.enums', 15 * 60 * 1000); // milliseconds
let status = { status: 'ok', message: null, error: null };

async function getEnumData(url) {
  const res = await got(url, {
    prefixUrl: API_V1,
    responseType: 'json',
  });
  if (res.statusCode !== 200) {
    throw Error(`Unable to get data from: ${url}`);
  }
  return res.body;
}

async function loadEnums() {
  const types = await getEnumData('enumeration/basic');
  const enums = await Promise.all(
    types.map((type) => getEnumData(`enumeration/basic/${type}`)),
  );
  const enumMap = zipObject(types, enums);
  return enumMap;
}

const getEnumDiffs = (current, prev, name) => {
  // First check if they are JSON identical before doing the expensive check
  if (
    hash(current, { unorderedArrays: true }) ===
    hash(prev, { unorderedArrays: true })
  ) {
    return [];
  }
  return [
    ...difference(current, prev).map((d) => `New value: ${name}.${d}`),
    ...difference(prev, current).map((d) => `Missing value: ${name}.${d}`),
  ];
};

async function getChangeReport(currentVersionEnums) {
  if (
    hash(currentVersionEnums, { unorderedArrays: true }) !==
    hash(prevVersionEnums, { unorderedArrays: true })
  ) {
    const newEnums = difference(
      Object.keys(currentVersionEnums),
      Object.keys(prevVersionEnums),
    );
    const missingEnums = difference(
      Object.keys(prevVersionEnums),
      Object.keys(currentVersionEnums),
    );
    const changedEnums = Object.keys(prevVersionEnums)
      .map((name) => ({
        name,
        values: getEnumDiffs(
          currentVersionEnums[name],
          prevVersionEnums[name],
          name,
        ),
      }))
      .filter((c) => c.values.length > 0);
    if (newEnums.length === 0 && changedEnums.length === 0) {
      return null;
    }
    const newEnumsMessage = newEnums.length
      ? `New enums: ${newEnums.join(', ')}.`
      : '';
    const missingEnumsMessage = missingEnums.length
      ? `Missing enums: ${missingEnums.join(', ')}.`
      : '';
    const changedEnumsMessage = changedEnums.length
      ? `Changed enums: ${changedEnums
          .map((e) => e.values.join(', '))
          .join('; ')}`
      : '';
    return [newEnumsMessage, missingEnumsMessage, changedEnumsMessage]
      .filter((v) => !!v)
      .join(' ');
    // fs.writeFile(`${__dirname}/enums.json`, currentVersionEnums);
  }
  return null;
}

const schemaIsValid = (enums) => {
  const enumsSchema = getSchema(enums);
  try {
    gql`
      ${enumsSchema}

      type Query {
        """
        _empty is nonsense, and only here as we are not allowed to extend an empty type.
        """
        _empty: String
      }
    `;
    return { valid: true, error: null };
  } catch (err) {
    return { valid: false, error: err };
  }
};

async function update() {
  try {
    const enumMap = await loadEnums();
    const changeReport = await getChangeReport(enumMap);
    if (changeReport) {
      const validationReport = schemaIsValid(enumMap);
      status = {
        status: 'warning',
        message: `ENUMS out of sync, needs update. New GraphQL ENUM schema is ${
          validationReport.valid ? 'VALID' : 'INVALID'
        }. ${changeReport}`,
        error: validationReport.error,
      };
    } else {
      status = { status: 'ok', message: null, error: null };
    }
    setTimeout(update, interval);
  } catch (err) {
    status = { status: 'error', message: null, error: err };
    setTimeout(update, interval);
  }
}

const getEnumStatus = () => status;

if (!config.apiv1) {
  console.log(
    '\x1b[33m%s\x1b[0m',
    'Skipping sync check for GBIF enumerations as config is missing for GBIF APIv1',
  );
} else {
  update();
}

export { getEnumData, getEnumStatus, loadEnums, schemaIsValid };
