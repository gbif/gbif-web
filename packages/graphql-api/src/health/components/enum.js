const got = require("got");
const _ = require("lodash");
const config = require("../../config");
const { gql } = require("apollo-server");
const hash = require('object-hash');
const { getSchema } = require("../../enums");

const API_V1 = config.apiv1;
const interval = _.get(config, "healthUpdateFrequency.enums", 30000);
let status = { status: "ok", message: null, error: null };

async function loadEnums() {
  const types = await getEnumData("enumeration/basic");
  const enums = await Promise.all(
    types.map((type) => getEnumData(`enumeration/basic/${type}`))
  );
  const enumMap = _.zipObject(types, enums);
  return enumMap;
}

async function getEnumData(url) {
  const res = await got(url, {
    prefixUrl: API_V1,
    responseType: "json",
  });
  if (res.statusCode !== 200) {
    throw Error("Unable to get data from: " + url);
  }
  return res.body;
}

const getEnumDiffs = (current, prev, name) => {
  // First check if they are JSON identical before doing the expensive check
  if (hash(current, { unorderedArrays: true }) === hash(prev, { unorderedArrays: true })) {
    return [];
  } else {
    return [
      ..._.difference(current, prev).map((d) => `New value: ${name}.${d}`),
      ..._.difference(prev, current).map((d) => `Missing value: ${name}.${d}`),
    ];
  }
};

function getChangeReport(currentVersionEnums) {
  const prevVersionEnums = require("../../enums/enums.json");

  if (
    hash(currentVersionEnums, { unorderedArrays: true }) !== hash(prevVersionEnums, { unorderedArrays: true })
  ) {
    const newEnums = _.difference(
      Object.keys(currentVersionEnums),
      Object.keys(prevVersionEnums)
    );
    const missingEnums = _.difference(
      Object.keys(prevVersionEnums),
      Object.keys(currentVersionEnums)
    );
    const changedEnums = Object.keys(prevVersionEnums)
      .map((name) => ({
        name,
        values: getEnumDiffs(
          currentVersionEnums[name],
          prevVersionEnums[name],
          name
        ),
      }))
      .filter((c) => c.values.length > 0);
    if (newEnums.length === 0 && changedEnums.length === 0) {
      return null;
    } else {
      const newEnumsMessage = newEnums.length
        ? `New enums: ${newEnums.join(", ")}.`
        : "";
      const missingEnumsMessage = missingEnums.length
        ? `Missing enums: ${missingEnums.join(", ")}.`
        : "";
      const changedEnumsMessage = changedEnums.length
        ? `Changed enums: ${changedEnums
          .map((e) => e.values.join(", "))
          .join("; ")}`
        : "";
      return [newEnumsMessage, missingEnumsMessage, changedEnumsMessage]
        .filter((v) => !!v)
        .join(" ");
    } // fs.writeFile(`${__dirname}/enums.json`, currentVersionEnums);
  } else {
    return null;
  }
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
    const changeReport = getChangeReport(enumMap);
    if (changeReport) {
      const validationReport = schemaIsValid(enumMap);
      status = {
        status: "warning",
        message: `ENUMS out of sync, needs update. New GraphQL ENUM schema is ${validationReport.valid ? "VALID" : "INVALID"
          }. ${changeReport}`,
        error: validationReport.error,
      };
    } else {
      status = { status: "ok", message: null, error: null };
    }
    setTimeout(update, interval)
  } catch (err) {
    status = { status: "error", message: null, error: err };
    setTimeout(update, interval)
  }
}

const getEnumStatus = () => status;

update();

module.exports = {
  getEnumStatus,
  loadEnums,
  schemaIsValid,
  getEnumData
};
