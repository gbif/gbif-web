// Clade detection + colouring for the sequence tree.
//
// The tree is split into K clades by cutting the K-1 longest branches (the most divergent
// splits). Each clade gets one base hue; members within a clade get a gradient (lightness + a
// small hue drift) ordered by their position in the tree, so a clade reads as one colour family
// while individual tips stay distinguishable. Colours are never reused across clades.

export type CladeTree = { name: string | null; length: number; children: CladeTree[] };

// neighbor-joining's getAsObject() node -> CladeTree.
export function normalizeTree(node: any): CladeTree {
  return {
    name: node?.taxon?.name ?? null,
    length: typeof node?.length === 'number' ? node.length : 0,
    children: (node?.children ?? []).map(normalizeTree),
  };
}

export type CladeColouring = {
  colourById: Record<string, string>;
  cladeById: Record<string, number>;
  cladeCount: number;
};

type Rec = {
  name: string | null;
  length: number;
  children: Rec[];
  parent: Rec | null;
};

/** Split `tree` into ~`k` clades and return a colour per tip id. */
export function assignClades(tree: CladeTree, k: number): CladeColouring {
  const orderedTips: string[] = [];
  const leafByName: Record<string, Rec> = {};
  const nonRootNodes: Rec[] = [];

  const build = (node: CladeTree, parent: Rec | null): Rec => {
    const rec: Rec = { name: node.name, length: node.length, children: [], parent };
    if (node.name != null && node.children.length === 0) {
      leafByName[node.name] = rec;
      orderedTips.push(node.name);
    } else {
      rec.children = node.children.map((c) => build(c, rec));
      // Only internal (non-root) branches are cut candidates, so clades are subtrees rather than
      // isolated single tips on long terminal branches.
      if (parent) nonRootNodes.push(rec);
    }
    return rec;
  };
  const root = build(tree, null);

  const nTips = orderedTips.length;
  const K = Math.max(1, Math.min(k, nTips));

  // Cut the K-1 longest internal branches; those subtree roots become clade roots.
  const cutSet = new Set<Rec>(
    nonRootNodes
      .slice()
      .sort((a, b) => b.length - a.length)
      .slice(0, Math.max(0, K - 1))
  );

  // Each tip belongs to its deepest cut ancestor, or the root remainder if none.
  const cladeRootOfTip = new Map<string, Rec>();
  for (const id of orderedTips) {
    let cur: Rec | null = leafByName[id];
    let found: Rec | null = null;
    while (cur && cur.parent) {
      if (cutSet.has(cur)) {
        found = cur;
        break;
      }
      cur = cur.parent;
    }
    cladeRootOfTip.set(id, found ?? root);
  }

  // Order clades by the tree position of their first tip (stable hue assignment).
  const cladeIndex = new Map<Rec, number>();
  const members: string[][] = [];
  for (const id of orderedTips) {
    const cladeRoot = cladeRootOfTip.get(id)!;
    let idx = cladeIndex.get(cladeRoot);
    if (idx === undefined) {
      idx = members.length;
      cladeIndex.set(cladeRoot, idx);
      members.push([]);
    }
    members[idx].push(id);
  }
  const cladeCount = members.length;

  const colourById: Record<string, string> = {};
  const cladeById: Record<string, number> = {};
  members.forEach((ids, idx) => {
    const baseHue = (idx / Math.max(1, cladeCount)) * 360;
    const m = ids.length;
    ids.forEach((id, j) => {
      const t = m > 1 ? j / (m - 1) : 0.5; // 0..1 across the clade
      const hue = (baseHue + (t - 0.5) * 24 + 360) % 360; // ±12° drift within the clade
      const lightness = 38 + t * 30; // 38%..68%
      colourById[id] = `hsl(${Math.round(hue)}, 68%, ${Math.round(lightness)}%)`;
      cladeById[id] = idx;
    });
  });

  return { colourById, cladeById, cladeCount };
}
