import { MAX_ROWS, SpeciesRow, SuggestResult } from './types';

// --- CSV parsing ---

function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function detectDelimiter(firstLine: string): string {
  const candidates = [',', ';', '\t', '|'];
  let best = ',';
  let max = 0;
  for (const d of candidates) {
    const count = firstLine.split(d).length - 1;
    if (count > max) {
      max = count;
      best = d;
    }
  }
  return best;
}

export function parseCSV(csvString: string): SpeciesRow[] | { error: string } {
  const lines = csvString.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { error: 'There are no rows in the data.' };
  if (lines.length > MAX_ROWS + 1)
    return {
      error: `Too many rows (maximum ${MAX_ROWS.toLocaleString()}) — try using our APIs instead`,
    };

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCSVLine(lines[0], delimiter).map((h) => h.toLowerCase().trim());

  if (!headers.includes('scientificname')) {
    return {
      error:
        'All rows must have a scientificName column — see the example file for the required format',
    };
  }

  const rows: SpeciesRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], delimiter);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] ?? '';
    });
    if (!obj.scientificname) continue;
    rows.push({
      verbatimScientificName: obj.scientificname,
      preferedKingdom: obj.kingdom || undefined,
      occurrenceId: obj.id || obj.occurrenceid || undefined,
    });
  }

  if (rows.length === 0)
    return { error: 'There are no valid rows with a scientificName in the data.' };
  return rows;
}

// --- API helpers ---

export function applyMatchData(item: SpeciesRow, data: Record<string, unknown>) {
  const fields: (keyof SpeciesRow)[] = [
    'scientificName',
    'matchType',
    'confidence',
    'status',
    'rank',
    'kingdom',
    'phylum',
    'class',
    'order',
    'family',
    'genus',
    'species',
    'kingdomKey',
    'phylumKey',
    'classKey',
    'orderKey',
    'familyKey',
    'genusKey',
    'speciesKey',
    'accepted',
    'acceptedKey',
    'canonicalName',
    'authorship',
    'acceptedUsageKey',
    'usageKey',
  ];
  fields.forEach((f) => {
    (item as Record<string, unknown>)[f] = data[f];
  });
  if (data.taxonomicStatus) item.status = data.taxonomicStatus as string;
  if (data.usageKey) item.key = data.usageKey as number;
  if (item.userEdited) item.matchType = 'EDITED';
}

export function toCandidate(a: Record<string, unknown>): SuggestResult {
  return {
    key: a.usageKey as number,
    scientificName: a.scientificName as string,
    canonicalName: a.canonicalName as string,
    rank: a.rank as string,
    status: a.status as string,
    kingdom: a.kingdom as string | undefined,
    phylum: a.phylum as string | undefined,
    class: a.class as string | undefined,
    order: a.order as string | undefined,
    family: a.family as string | undefined,
    genus: a.genus as string | undefined,
    species: a.species as string | undefined,
  };
}

export async function processInBatches<T>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<void>,
  onProgress: (done: number) => void
): Promise<void> {
  let done = 0;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (item) => {
        await processor(item);
        done++;
        onProgress(done);
      })
    );
  }
}

export function buildCsv(
  species: SpeciesRow[],
  fields: readonly string[],
  excludeUnmatched: boolean
): string {
  const rows = (excludeUnmatched ? species.filter((s) => s.key) : species).filter(
    (s) => !s.discarded
  );
  let csv = fields.join(',') + '\n';
  rows.forEach((row) => {
    csv +=
      fields
        .map((f) => {
          const val = (row as Record<string, unknown>)[f];
          if (val === undefined || val === null) return '';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(',') + '\n';
  });
  return csv;
}
