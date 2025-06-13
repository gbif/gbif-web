import { useMemo } from 'react';
import { Params } from '../options';

export function useFilterParams(
  basisOfRecord: string[],
  isYearFilterActive: boolean,
  startYear?: number,
  endYear?: number,
  taxonKey?: string,
  country?: string
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

    if (country) {
      filterParams.country = country;
    }
    if (taxonKey) {
      filterParams.taxonKey = taxonKey;
    }

    return filterParams;
  }, [basisOfRecord, startYear, endYear, isYearFilterActive, taxonKey, country]);
}
