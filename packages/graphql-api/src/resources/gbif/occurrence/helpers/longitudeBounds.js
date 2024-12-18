import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import maxBy from 'lodash/maxBy';

function getLongitudeBounds(buckets, intervalSize) {
  if (buckets.length === 0) return null;
  const firstNotGap = buckets.find((x) => x.doc_count !== 0).key;
  let firstNotGapIndex = 0;

  // generate an array with all longitudes in the correct intervals we (perhaps) have data for
  let intervalCounter = -180;
  const intervals = [];
  while (intervalCounter <= 180) {
    intervals.push(intervalCounter);
    intervalCounter += intervalSize;
    if (firstNotGap === intervalCounter) {
      firstNotGapIndex = intervals.length - 1;
    }
  }

  const bucketMap = keyBy(buckets, 'key');
  // set all initial gaps to 0 or 1 depending on weather the cell is empty or not.
  const gaps = intervals.map((lon, i) => {
    const count = get(bucketMap, `[${lon}].doc_count`) ? 0 : 1;
    return {
      start: i,
      size: count,
    };
  });
  const { length } = gaps;

  // run through the array twice. Performance is hardly an issue
  let index = firstNotGapIndex + 1 === length ? 0 : firstNotGapIndex + 1;
  while (index !== firstNotGapIndex) {
    const prevIndex = index - 1 < 0 ? length - 1 : index - 1;
    if (gaps[prevIndex].size > 0 && gaps[index].size > 0) {
      gaps[index].start = gaps[prevIndex].start;
      gaps[index].size = gaps[prevIndex].size + 1;
    }
    index = index + 1 === length ? 0 : index + 1;
  }

  const largestHole = maxBy(gaps, 'size');
  const startDataIndex = (largestHole.start + largestHole.size) % length;
  const endDataIndex = largestHole.start;

  const west = intervals[startDataIndex];
  let east = intervals[endDataIndex];
  if (east < west) east += 360;
  return { west, east };
}

export default getLongitudeBounds;
