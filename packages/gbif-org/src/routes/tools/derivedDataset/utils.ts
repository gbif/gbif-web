import { RelatedDatasetRow } from './types';

export const MAX_RELATED_DATASET_ROWS = 6000;

const DELIMITERS = [',', ';', '\t', '|'];

function detectDelimiter(line: string): string {
  let best = DELIMITERS[0];
  let bestCount = -1;
  for (const d of DELIMITERS) {
    const count = line.split(d).length;
    if (count > bestCount) {
      best = d;
      bestCount = count;
    }
  }
  return best;
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export type CsvParseResult =
  | { ok: true; rows: RelatedDatasetRow[] }
  | { ok: false; errorId: 'tools.derivedDataset.emptyFile' | 'tools.derivedDataset.tooManyRows' };

export function parseRelatedDatasetsCsv(text: string): CsvParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { ok: false, errorId: 'tools.derivedDataset.emptyFile' };
  }
  if (lines.length > MAX_RELATED_DATASET_ROWS) {
    return { ok: false, errorId: 'tools.derivedDataset.tooManyRows' };
  }

  const delimiter = detectDelimiter(lines[0]);
  const rows: RelatedDatasetRow[] = lines.map((line) => {
    const parts = line.split(delimiter).map(stripQuotes);
    return {
      key: parts[0] ?? '',
      val: parts[1] ?? '',
    };
  });

  return { ok: true, rows };
}

export function isValidCsvFile(file: File): boolean {
  if (!file) return false;
  const name = file.name.toLowerCase();
  return (
    file.type === '' ||
    file.type === 'text/csv' ||
    file.type === 'text/plain' ||
    name.endsWith('.csv') ||
    name.endsWith('.tsv') ||
    name.endsWith('.txt')
  );
}

export function buildRelatedDatasetsMap(
  rows: RelatedDatasetRow[]
): { map: Record<string, number>; validCount: number } {
  const map: Record<string, number> = {};
  let validCount = 0;
  for (const row of rows) {
    const key = row.key?.trim();
    const valNum = Number(row.val);
    if (key && row.val !== '' && Number.isFinite(valNum)) {
      map[key] = valNum;
      validCount += 1;
    }
  }
  return { map, validCount };
}

export type DerivedDatasetRecord = {
  doi: string;
  title?: string;
  sourceUrl?: string;
  description?: string;
  originalDownloadDOI?: string;
  registrationDate?: string;
};

type DerivedDatasetDatasetEntry = {
  datasetKey?: string;
  datasetDOI?: string;
  numberRecords?: number | string;
};

type PagedResult<T> = {
  results: T[];
  endOfRecords?: boolean;
  count?: number;
};

const DATASETS_PAGE_SIZE = 1000;
const DATASETS_MAX_PAGES = 20;

export async function fetchDerivedDataset(
  v1Endpoint: string,
  prefix: string,
  suffix: string,
  signal?: AbortSignal
): Promise<DerivedDatasetRecord> {
  const response = await fetch(`${v1Endpoint}/derivedDataset/${prefix}/${suffix}`, { signal });
  if (response.status === 404) {
    throw new Error('not-found');
  }
  if (!response.ok) {
    throw new Error(`Failed to load derived dataset (HTTP ${response.status})`);
  }
  return (await response.json()) as DerivedDatasetRecord;
}

export async function fetchAllDerivedDatasetRows(
  v1Endpoint: string,
  prefix: string,
  suffix: string,
  signal?: AbortSignal
): Promise<RelatedDatasetRow[]> {
  const rows: RelatedDatasetRow[] = [];
  let offset = 0;
  for (let page = 0; page < DATASETS_MAX_PAGES; page++) {
    const url = `${v1Endpoint}/derivedDataset/${prefix}/${suffix}/datasets?limit=${DATASETS_PAGE_SIZE}&offset=${offset}`;
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Failed to load related datasets (HTTP ${response.status})`);
    }
    const page_data = (await response.json()) as PagedResult<DerivedDatasetDatasetEntry>;
    for (const entry of page_data.results ?? []) {
      const key = entry.datasetDOI || entry.datasetKey || '';
      const val =
        entry.numberRecords == null
          ? ''
          : typeof entry.numberRecords === 'number'
            ? String(entry.numberRecords)
            : entry.numberRecords;
      rows.push({ key, val });
    }
    if (page_data.endOfRecords || (page_data.results ?? []).length < DATASETS_PAGE_SIZE) break;
    offset += DATASETS_PAGE_SIZE;
  }
  return rows;
}
