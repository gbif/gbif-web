// Minimal FASTA helpers for the sequence-phylogeny feature. Headers are nucleotideSequenceIDs
// (hex strings — safe as FASTA headers and Newick tip names).

/** id -> sequence  →  FASTA string. */
export function buildFasta(seqById: Record<string, string>): string {
  return (
    Object.entries(seqById)
      .map(([id, seq]) => `>${id}\n${seq}`)
      .join('\n') + '\n'
  );
}

/** FASTA string  →  id -> sequence (order preserved; header truncated at first whitespace). */
export function parseFasta(fasta: string): Record<string, string> {
  const out: Record<string, string> = {};
  let current: string | null = null;
  let buffer: string[] = [];
  const flush = () => {
    if (current !== null) out[current] = buffer.join('');
    buffer = [];
  };
  for (const line of fasta.split(/\r?\n/)) {
    if (line.startsWith('>')) {
      flush();
      current = line.slice(1).trim().split(/\s+/)[0];
    } else if (line.trim()) {
      buffer.push(line.trim());
    }
  }
  flush();
  return out;
}
