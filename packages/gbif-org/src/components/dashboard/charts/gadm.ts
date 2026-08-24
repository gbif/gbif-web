// Truncates a GADM level map (level0..level4) down to the entry matching
// `targetGid`, so a facet bucket only shows the classification up to its own
// level (e.g. a level 1 bucket shouldn't show a deeper level 2/3 name that
// happens to belong to whichever occurrence the entity lookup returned).
export function filterLevels<T extends { gid: string }>(
  obj: Record<string, T> | undefined,
  targetGid: string
): Record<string, T> {
  const result: Record<string, T> = {};

  if (!obj) return result;

  for (const level in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, level)) {
      const currentGid = obj[level].gid;
      result[level] = obj[level];

      if (currentGid === targetGid) {
        break;
      }
    }
  }

  return result;
}
