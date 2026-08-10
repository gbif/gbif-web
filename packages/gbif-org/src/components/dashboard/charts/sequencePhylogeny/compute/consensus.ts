import type { NameAgg, NameCount } from '../useSequenceTreeData';

export type TipConsensus = {
  /** most-frequent scientific name across the tip's members, or null if none known. */
  primary: string | null;
  /** number of distinct taxa across the tip's occurrences. */
  distinct: number;
  /**
   * True when the tip's identifications genuinely disagree, judged on Linnaean names only:
   * two different genera, or (within one genus) two different species epithets. Rank differences
   * (a genus name vs a species in that genus) and non-Linnaean placeholders (UNITE species
   * hypotheses like SH1151976.09FU) are not conflicts.
   */
  ambiguous: boolean;
  /** the top few names with counts (for a tooltip). */
  top: NameCount[];
  /** occurrences considered (approximate: a record carrying several member ids is counted once per id). */
  sampled: number;
};

const EMPTY: TipConsensus = { primary: null, distinct: 0, ambiguous: false, top: [], sampled: 0 };

// UNITE species hypothesis, e.g. "SH1151976.09FU" — a placeholder identifier, not a Linnaean name.
const SH_HYPOTHESIS = /^SH\d+(\.\d+)?[A-Z]{0,2}$/i;
// Rank-indicating suffixes for taxa above genus (family/order/class/phylum, across kingdoms). A
// single capitalised token ending in one of these is a higher taxon, not a genus — so it must not
// win a species label nor create a false genus conflict (e.g. "Cortinariaceae" vs "Cortinarius").
const HIGHER_RANK_SUFFIX =
  /(?:aceae|idae|inae|oidea|oideae|ineae|ales|mycota|mycotina|mycetidae|mycetes|phytina|phyta|opsida|viridae)$/i;
// Second-token markers that are not real epithets.
const NON_EPITHET = new Set(['sp', 'sp.', 'spp', 'spp.', 'cf', 'cf.', 'aff', 'aff.', 'indet', 'indet.']);

export type ParsedName = { genus: string; epithet: string | null };

/**
 * Parse a scientific name into a lowercased genus (+ epithet when it is a real species epithet).
 * Returns null for names with no usable genus token — UNITE species hypotheses (SH…), codes, etc.
 * "Genus sp./cf./aff." and authorship strings yield a genus with a null epithet (genus-level only).
 */
export function parseName(name: string | null | undefined): ParsedName | null {
  if (!name) return null;
  const trimmed = name.trim();
  if (SH_HYPOTHESIS.test(trimmed)) return null;
  const tokens = trimmed.split(/\s+/);
  const genus = tokens[0];
  if (!/^[A-Z][a-zë-]+$/.test(genus)) return null; // not a capitalised genus (e.g. an SH code)
  if (HIGHER_RANK_SUFFIX.test(genus)) return null; // a family/order/… — higher than genus
  let epithet: string | null = null;
  if (tokens.length >= 2) {
    const t = tokens[1].toLowerCase();
    if (!NON_EPITHET.has(t) && /^[a-zë-]+$/.test(t)) epithet = t;
  }
  return { genus: genus.toLowerCase(), epithet };
}

/**
 * Normalised "genus epithet" key when `name` is a proper binomial, else null (genus-only names,
 * higher taxa, species hypotheses, "Genus sp./cf." all return null).
 */
export function binomialKey(name: string | null | undefined): string | null {
  const parsed = parseName(name);
  return parsed?.epithet ? `${parsed.genus} ${parsed.epithet}` : null;
}

/**
 * Merge the scientific-name distributions of the nucleotideSequenceIDs that sit under one tree tip
 * (a dereplication representative and its collapsed members) into a single consensus. Grouping is by
 * taxonKey (falling back to the name string), so synonym/authorship variants don't inflate `distinct`.
 */
export function consensusForMembers(
  memberIds: string[],
  namesById: Record<string, NameAgg>
): TipConsensus {
  const byKey = new Map<string, NameCount>();
  let sampled = 0;
  for (const id of memberIds) {
    const agg = namesById[id];
    if (!agg) continue;
    sampled += agg.sampled;
    for (const nc of agg.names) {
      const key = nc.taxonKey ?? nc.name;
      const existing = byKey.get(key);
      if (existing) existing.count += nc.count;
      else byKey.set(key, { taxonKey: nc.taxonKey, name: nc.name, count: nc.count });
    }
  }
  if (byKey.size === 0) return EMPTY;
  const all = [...byKey.values()].sort((a, b) => b.count - a.count);
  // Conflict on Linnaean names only: >1 distinct genus, or (within one genus) >1 distinct epithet.
  // Genus-only names are compatible with a species in that genus; SH/codes contribute nothing.
  const genera = new Set<string>();
  const epithets = new Set<string>();
  for (const nc of all) {
    const parsed = parseName(nc.name);
    if (!parsed) continue;
    genera.add(parsed.genus);
    if (parsed.epithet) epithets.add(`${parsed.genus} ${parsed.epithet}`);
  }
  const ambiguous = genera.size >= 2 || epithets.size >= 2;
  // Prefer a species binomial for the label when one is present (highest-count binomial, since
  // `all` is count-ordered), so a more frequent higher-rank identification (genus/family) never
  // hides a species-level name. Fall back to the most frequent name when there is no binomial.
  const primary = all.find((nc) => binomialKey(nc.name)) ?? all[0];
  return { primary: primary.name, distinct: all.length, ambiguous, top: all.slice(0, 3), sampled };
}
