import { get, difference, keyBy } from 'lodash';
import hash from 'object-hash';
import { getEnumData } from './enum';
import config from '#/config';
import prev from '#/helpers/enums/interpretationRemark.json';
const prevMap = keyBy(prev, 'id');

const second = 1000;
const minute = 60 * second;
const interval = get(config, 'healthUpdateFrequency.enums', minute * 30);
let status = { status: 'ok', message: null, error: null };

async function getLatestInterpretationRemark() {
  // Discretely write latest interpretationRemark
  try {
    const interpretationRemarkLatest = await getEnumData(
      'enumeration/interpretationRemark',
    );
    return interpretationRemarkLatest;
  } catch (error) {
    console.log('Failed to fetch latest interpretationRemark from API:');
    console.log(error);
  }

  return undefined;
}

const getChangedValues = (prevMap, currentMap) => {
  const newValues = difference(Object.keys(currentMap), Object.keys(prevMap));
  const missingValues = difference(
    Object.keys(prevMap),
    Object.keys(currentMap),
  );
  let msg = '';
  if (newValues.length) {
    msg += `New values: ${newValues.join(', ')}`;
  }
  if (missingValues.length) {
    msg += `Missing values: ${missingValues.join(', ')}`;
  }
  return msg;
};

const getTermDiffs = (current, prev) => {
  // First check if they are JSON identical before doing the expensive check
  if (
    hash(current, { unorderedArrays: true }) ===
    hash(prev, { unorderedArrays: true })
  ) {
    return [];
  }
  return [
    ...difference(current, prev).map((d) => `New related term: ${d}`),
    ...difference(prev, current).map((d) => `Missing related term: ${d}`),
  ];
};

const getChangeReport = async (current) => {
  const currentMap = keyBy(current, 'id');
  const msg = getChangedValues(prevMap, currentMap);
  const diffs = Object.keys(prevMap)
    .map((key) => {
      if (
        currentMap[key] &&
        hash(currentMap[key], { unorderedArrays: true }) !==
          hash(prevMap[key], { unorderedArrays: true })
      ) {
        const statusDiffMsg =
          prevMap[key].status !== currentMap[key].status
            ? `Status changed to ${currentMap[key].status}`
            : '';
        const termsDiffMsg = getTermDiffs(
          currentMap[key].relatedTerms,
          prevMap[key].relatedTerms,
        );
        return statusDiffMsg || termsDiffMsg.length > 0
          ? `${key}: ${
              statusDiffMsg ? `${statusDiffMsg}; ` : ''
            }${termsDiffMsg.join('; ')}`
          : undefined;
      }
      return undefined;
    })
    .filter((d) => !!d);

  return `${msg ? `${msg}; ` : ''}${diffs.join('; ')}`;
};

async function update() {
  try {
    const enumMap = await getLatestInterpretationRemark();
    const changeReport = await getChangeReport(enumMap);
    if (changeReport) {
      status = {
        status: 'warning',
        message: `InterpretationRemark out of sync, needs update. ${changeReport}`,
        error: null,
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

const getInterpretationRemarkStatus = () => status;

if (!config.apiv1) {
  console.log('\x1b[33m%s\x1b[0m', 'Skipping sync check for GBIF interpretation remarks as config is missing for GBIF APIv1');
} else {
  update();
}

export { getInterpretationRemarkStatus, getLatestInterpretationRemark };
