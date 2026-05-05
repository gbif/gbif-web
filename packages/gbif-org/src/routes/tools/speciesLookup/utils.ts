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

const MAJOR_RANKS = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'] as const;
type MajorRank = (typeof MAJOR_RANKS)[number];

export function applyMatchData(item: SpeciesRow, data: Record<string, unknown>) {
  const usage = data.usage as Record<string, unknown> | undefined;
  const acceptedUsage = data.acceptedUsage as Record<string, unknown> | undefined;
  const diagnostics = data.diagnostics as Record<string, unknown> | undefined;
  const classification = data.classification as
    | Array<{ rank: string; name: string; key: string }>
    | undefined;

  if (usage) {
    item.key = usage.key as string;
    item.usageKey = usage.key as string;
    item.scientificName = usage.name as string;
    item.rank = usage.rank as string;
    item.status = (usage.status ?? usage.taxonomicStatus) as string | undefined;
  } else {
    item.key = undefined;
    item.usageKey = undefined;
    item.scientificName = undefined;
    item.rank = undefined;
    item.status = undefined;
  }

  if (acceptedUsage) {
    item.acceptedUsageKey = acceptedUsage.key as string;
    item.accepted = acceptedUsage.name as string;
    item.acceptedKey = acceptedUsage.key as string;
  } else {
    item.acceptedUsageKey = undefined;
    item.accepted = undefined;
    item.acceptedKey = undefined;
  }

  if (diagnostics) {
    item.matchType = diagnostics.matchType as string;
    item.confidence = diagnostics.confidence as number;
  } else {
    item.matchType = undefined;
    item.confidence = undefined;
  }

  // Clear all major Linnaean classification fields first
  MAJOR_RANKS.forEach((rank) => {
    (item as Record<string, unknown>)[rank] = undefined;
    (item as Record<string, unknown>)[`${rank}Key`] = undefined;
  });

  if (classification) {
    classification.forEach((c) => {
      const rank = c.rank?.toLowerCase() as MajorRank;
      if (MAJOR_RANKS.includes(rank)) {
        (item as Record<string, unknown>)[rank] = c.name;
        (item as Record<string, unknown>)[`${rank}Key`] = c.key;
      }
    });
  }

  if (item.userEdited) item.matchType = 'EDITED';
}

export function applySuggestion(item: SpeciesRow, suggestion: SuggestResult) {
  item.key = suggestion.key;
  item.usageKey = suggestion.key;
  item.scientificName = suggestion.scientificName;
  item.rank = suggestion.rank;
  item.status = suggestion.status;
  item.matchType = 'EDITED';
  item.confidence = undefined;

  item.acceptedUsageKey = suggestion.acceptedKey;
  item.acceptedKey = suggestion.acceptedKey;
  item.accepted = suggestion.accepted;

  // Suggest results don't return higher-rank keys; alternatives from the match
  // call carry classification names but no keys either.
  MAJOR_RANKS.forEach((rank) => {
    (item as Record<string, unknown>)[rank] = (suggestion as Record<string, unknown>)[rank];
    (item as Record<string, unknown>)[`${rank}Key`] = undefined;
  });

  item.alternatives = undefined;
  item.discarded = false;
}

export function toCandidate(a: Record<string, unknown>): SuggestResult {
  const usage = a.usage as Record<string, unknown> | undefined;
  const acceptedUsage = a.acceptedUsage as Record<string, unknown> | undefined;
  const classification = a.classification as
    | Array<{ rank: string; name: string; key: string }>
    | undefined;

  const classMap: Partial<Record<MajorRank, string>> = {};
  if (classification) {
    classification.forEach((c) => {
      const rank = c.rank?.toLowerCase() as MajorRank;
      if (MAJOR_RANKS.includes(rank)) classMap[rank] = c.name;
    });
  }

  return {
    key: usage?.key as string,
    scientificName: usage?.name as string,
    rank: usage?.rank as string,
    status: (usage?.status ?? usage?.taxonomicStatus) as string,
    acceptedKey: acceptedUsage?.key as string | undefined,
    accepted: acceptedUsage?.name as string | undefined,
    kingdom: classMap.kingdom,
    phylum: classMap.phylum,
    class: classMap.class,
    order: classMap.order,
    family: classMap.family,
    genus: classMap.genus,
    species: classMap.species,
  };
}

export function fromTaxonSuggestion(t: Record<string, unknown>): SuggestResult {
  return {
    key: t.taxonID as string,
    scientificName: t.scientificName as string,
    rank: t.taxonRank as string,
    status: t.taxonomicStatus as string,
    acceptedKey: t.acceptedNameUsageID as string | undefined,
    accepted: t.acceptedNameUsage as string | undefined,
    group: t.group as string | undefined,
    context: t.context as string | undefined,
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
