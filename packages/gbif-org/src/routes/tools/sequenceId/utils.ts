import {
  CSV_EXPORT_FIELDS,
  MAX_SEQUENCES,
  SequenceInput,
  SequenceResult,
  SortDirection,
} from './types';

const PRINTABLE_ASCII = /[^\x20-\x7E]/g;

// FASTA: header lines start with '>', sequence lines follow until the next header.
export function parseFasta(input: string): SequenceInput[] {
  const result: SequenceInput[] = [];
  input.split('>').forEach((entry) => {
    const lines = entry.split(/\r?\n/);
    if (lines.length > 1 && lines[0] && lines.slice(1).join('').trim()) {
      result.push({
        occurrenceId: lines[0].replace(PRINTABLE_ASCII, '').trim(),
        sequence: lines
          .slice(1)
          .join('')
          .replace(PRINTABLE_ASCII, '')
          .replace(/[-.]/g, ''),
      });
    }
  });
  return result;
}

// CSV: detect delimiter, find required columns (sequence + id/occurrenceId).
const CSV_DELIMITERS = [',', ';', '\t', '|', '$'];

function detectDelimiter(headerLine: string): string {
  let best = ',';
  let bestCount = 0;
  for (const d of CSV_DELIMITERS) {
    const count = headerLine.split(d).length;
    if (count > bestCount) {
      bestCount = count;
      best = d;
    }
  }
  return best;
}

function inferMarkerFromValue(value: string): string | undefined {
  const v = value.toLowerCase();
  if (v.includes('its')) return 'ITS';
  if (v.includes('coi') || v.includes('co1')) return 'COI';
  if (v.includes('16s')) return '16S';
  if (v.includes('18s')) return '18S';
  if (v.includes('12s')) return '12S';
  if (v.includes('rbcl')) return 'RBCL';
  return undefined;
}

export type ParsedCsv = {
  rows: SequenceInput[];
  detectedMarker?: string;
};

export function parseCsv(input: string): ParsedCsv | { error: string } {
  const lines = input.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { error: 'CSV must contain a header row and at least one data row' };
  }
  const delimiter = detectDelimiter(lines[0]);
  const header = lines[0].split(delimiter).map((c) => c.trim().toLowerCase());

  const seqIdx = header.findIndex((c) => c === 'sequence' || c === 'consensussequence');
  const idIdx = header.findIndex((c) => c === 'id' || c === 'occurrenceid');
  const markerIdx = header.findIndex((c) => c === 'marker');

  if (seqIdx === -1) {
    return {
      error: 'CSV must have a column named "sequence" (or "consensusSequence")',
    };
  }

  const rows: SequenceInput[] = [];
  let detectedMarker: string | undefined;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map((c) => c.trim());
    const sequence = (cols[seqIdx] ?? '').replace(PRINTABLE_ASCII, '').replace(/[-.]/g, '');
    if (!sequence) continue;
    const occurrenceId = idIdx !== -1 ? cols[idIdx] ?? `row-${i}` : `row-${i}`;
    rows.push({ occurrenceId, sequence });

    if (!detectedMarker && markerIdx !== -1 && cols[markerIdx]) {
      detectedMarker = inferMarkerFromValue(cols[markerIdx]);
    }
  }

  if (rows.length === 0) {
    return { error: 'No sequences found in the CSV' };
  }

  return { rows, detectedMarker };
}

// Auto-detect: leading '>' means FASTA, otherwise try CSV.
export function parseSequenceInput(input: string): SequenceInput[] | { error: string } {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { error: 'No input provided' };
  }
  let rows: SequenceInput[];
  if (trimmed.startsWith('>')) {
    rows = parseFasta(trimmed);
    if (rows.length === 0) {
      return { error: 'No FASTA sequences found — each entry must start with ">id" on its own line followed by the sequence' };
    }
  } else {
    const csv = parseCsv(trimmed);
    if ('error' in csv) return csv;
    rows = csv.rows;
  }
  if (rows.length > MAX_SEQUENCES) {
    return {
      error: `Too many sequences (maximum ${MAX_SEQUENCES.toLocaleString()})`,
    };
  }
  return rows;
}

// File extension/MIME sniff for the upload box. We accept FASTA-ish text and CSV.
export function isSupportedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith('.csv') || name.endsWith('.tsv') || name.endsWith('.txt')) return true;
  if (name.endsWith('.fasta') || name.endsWith('.fa') || name.endsWith('.fna')) return true;
  if (file.type === 'text/csv' || file.type === 'text/plain' || file.type === '') return true;
  return false;
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// CSV export — flattens classification into an underscore-joined string.
function classificationToString(result: SequenceResult): string {
  const cls = result.match?.taxonMatch?.classification;
  if (!cls || cls.length === 0) return '';
  return cls.map((c) => c.name).join('_');
}

function getExportValue(result: SequenceResult, field: string): string | number | undefined {
  const m = result.match;
  switch (field) {
    case 'occurrenceId':
      return result.occurrenceId;
    case 'marker':
      return result.marker;
    case 'identity':
      return m?.identity;
    case 'bitScore':
      return m?.bitScore;
    case 'expectValue':
      return m?.expectValue;
    case 'queryCoverage':
      return m?.qcovs;
    case 'matchType':
      return m?.matchType;
    case 'scientificName':
      return m?.taxonMatch?.usage?.name ?? m?.name;
    case 'classification':
      return classificationToString(result);
    case 'sequence':
      return result.sequence;
    default:
      return undefined;
  }
}

export function buildCsv(results: SequenceResult[], excludeUnmatched: boolean): string {
  const rows = excludeUnmatched
    ? results.filter((r) => r.match && r.match.matchType !== 'BLAST_NO_MATCH')
    : results;
  let csv = CSV_EXPORT_FIELDS.join(',') + '\n';
  rows.forEach((row) => {
    csv +=
      CSV_EXPORT_FIELDS.map((f) => {
        const val = getExportValue(row, f);
        if (val === undefined || val === null || val === '') return '';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(',') + '\n';
  });
  return csv;
}

// Sortable accessors for the result table — mirror the columns in RESULT_COLUMNS.
function getSortValue(result: SequenceResult, column: string): unknown {
  const m = result.match;
  switch (column) {
    case 'occurrenceId':
      return result.occurrenceId;
    case 'marker':
      return result.marker;
    case 'identity':
      return m?.identity;
    case 'bitScore':
      return m?.bitScore;
    case 'expectValue':
      return m?.expectValue;
    case 'queryCoverage':
      return m?.qcovs;
    case 'queryLength':
      return result.sequence?.length;
    case 'matchType':
      return m?.matchType;
    case 'scientificName':
      return m?.taxonMatch?.usage?.name ?? m?.name;
    case 'classification':
      return classificationToString(result);
    case 'sequence':
      return result.sequence;
    default:
      return undefined;
  }
}

export function sortResults(
  results: SequenceResult[],
  column: string | undefined,
  direction: SortDirection
): SequenceResult[] {
  if (!column) return results;
  const sorted = [...results];
  sorted.sort((a, b) => {
    const av = getSortValue(a, column);
    const bv = getSortValue(b, column);
    if (av === undefined && bv === undefined) return 0;
    if (av === undefined) return 1;
    if (bv === undefined) return -1;
    if (typeof av === 'number' && typeof bv === 'number') return av - bv;
    const as = String(av).toLowerCase();
    const bs = String(bv).toLowerCase();
    if (as < bs) return -1;
    if (as > bs) return 1;
    return 0;
  });
  if (direction === 'desc') sorted.reverse();
  return sorted;
}

export function buildAlignment(match: { qstart?: string; qend?: string; sstart?: string; send?: string; querySequence?: string; subjectSequence?: string }): string {
  if (!match.querySequence || !match.subjectSequence) return '';
  const qstart = match.qstart ?? '';
  const sstart = match.sstart ?? '';
  const padLen = Math.max(qstart.length, sstart.length) + 1;
  const q2 = match.querySequence.split('');
  const s2 = match.subjectSequence.split('');
  let diff = ''.padEnd(padLen + 6);
  for (let i = 0; i < q2.length; i++) {
    diff += q2[i] === s2[i] ? '|' : ' ';
  }
  const q = 'query ' + qstart.padEnd(padLen) + match.querySequence + ' ' + (match.qend ?? '');
  const s = 'sbjct ' + sstart.padEnd(padLen) + match.subjectSequence + ' ' + (match.send ?? '');
  return `${q}\n${diff}\n${s}`;
}
