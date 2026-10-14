// Maps a kingdom name to the id of the legacy GBIF kingdom it belongs to (used for icons and the
// translated names in enums.kingdomKey). The Catalogue of Life splits archaea, bacteria and viruses
// into several kingdoms, so these are grouped by name. The lists are the COL kingdoms with these
// names as of the 2024 prokaryote renaming (e.g. "Bacillati (Gibbons & Murray, 1978) Oren & Göker 2024").
const kingdomIdsByName: Record<string, number> = {
  animalia: 1,
  plantae: 6,
  fungi: 5,
  chromista: 4,
  protozoa: 7,
  thermoproteati: 2,
  methanobacteriati: 2,
  promethearchaeati: 2,
  nanobdellati: 2,
  pseudomonadati: 3,
  bacillati: 3,
  fusobacteriati: 3,
  thermotogati: 3,
};

export function getLegacyKingdomId(name: string): number | undefined {
  const firstWord = name.split(' ')[0].toLowerCase();
  if (kingdomIdsByName[firstWord] != null) return kingdomIdsByName[firstWord];
  if (firstWord.startsWith('archaea')) return 2;
  if (firstWord.startsWith('bacteria')) return 3;
  if (firstWord.endsWith('virae') || firstWord.startsWith('virus')) return 8;
  return undefined;
}

type Bucket = { key: string; count: number; name?: string | null };
export type KingdomGroup = {
  id: string;
  legacyId?: number;
  name: string;
  keys: string[];
  count: number;
};

// One group per legacy kingdom, so all COL bacteria kingdoms end up as a single "Bacteria" item.
export function groupKingdoms(buckets: Bucket[]): KingdomGroup[] {
  const groups = new Map<string, KingdomGroup>();
  for (const bucket of buckets) {
    const name = bucket.name?.split(' ')[0] ?? bucket.key;
    const legacyId = bucket.name ? getLegacyKingdomId(bucket.name) : undefined;
    const id = legacyId != null ? `legacy-${legacyId}` : bucket.key;
    const existing = groups.get(id);
    if (existing) {
      existing.keys.push(bucket.key);
      existing.count += bucket.count;
    } else {
      groups.set(id, { id, legacyId, name, keys: [bucket.key], count: bucket.count });
    }
  }
  return [...groups.values()];
}
