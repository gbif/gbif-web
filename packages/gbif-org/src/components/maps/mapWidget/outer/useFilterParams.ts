import { useMemo } from 'react';
import { Params } from '../options';

export function useFilterParams(
  basisOfRecord: string[],
  isYearFilterActive: boolean,
  startYear?: number,
  endYear?: number,
  capabilitiesParams?: Record<string, any>
) {
  return useMemo(() => {
    const filterParams: Params = {
      hasCoordinate: true,
      hasGeospatialIssue: false,
      occurrenceStatus: 'PRESENT',
    };

    if (basisOfRecord.length > 0) {
      filterParams.basisOfRecord = basisOfRecord;
    }

    if (isYearFilterActive) {
      filterParams.year = `${startYear},${endYear}`;
    }

    if (capabilitiesParams) {
      Object.assign(filterParams, capabilitiesParams);
    }

    return filterParams;
  }, [basisOfRecord, startYear, endYear, isYearFilterActive, capabilitiesParams]);
}
