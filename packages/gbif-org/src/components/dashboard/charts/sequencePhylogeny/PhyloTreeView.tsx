import { phylotree } from 'phylotree';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cssAsText from '@/components/phylogeny/styles';

// Same class map the existing Phylogeny component uses, so the shared phylotree CSS applies.
const css_classes = {
  'tree-container': 'phylotree-container',
  'tree-scale-bar': 'gbif-phylotree-tree-scale-bar',
  node: 'gbif-phylotree-node',
  'internal-node': 'gbif-phylotree-internal-node',
  'tagged-node': 'gbif-phylotree-node-tagged',
  'selected-node': 'gbif-phylotree-node-selected',
  'collapsed-node': 'gbif-phylotree-node-collapsed',
  'root-node': 'gbif-phylotree-root-node',
  branch: 'gbif-phylotree-branch',
  'selected-branch': 'gbif-phylotree-branch-selected',
  'tagged-branch': 'gbif-phylotree-branch-tagged',
  'tree-selection-brush': 'gbif-phylotree-tree-selection-brush',
  'branch-tracer': 'gbif-phylotree-branch-tracer',
  clade: 'gbif-phylotree-clade',
  node_text: 'gbif-phylotree-phylotree-node-text',
};

/**
 * Raise every branch length to `exponent` (γ). With phylotree's fit-to-width scaling, a uniform
 * multiplier is a no-op (it cancels in the scale), so a power transform is what actually changes the
 * look: γ < 1 expands short branches relative to long ones, de-flattening trees where one divergent
 * branch otherwise dominates the scale. γ = 1 is the identity (returned untouched). Negative NJ
 * branch lengths are clamped to 0.
 */
function exaggerateBranchLengths(newick: string, exponent: number): string {
  if (!Number.isFinite(exponent) || exponent === 1) return newick;
  return newick.replace(/:(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, (_m, num) => {
    const scaled = Math.pow(Math.max(0, parseFloat(num)), exponent);
    return `:${Number.isFinite(scaled) ? scaled.toPrecision(6) : num}`;
  });
}

type Props = {
  /** Newick string whose tip names are nucleotideSequenceIDs. */
  newick: string;
  /** tip id -> colour (e.g. cluster colour). */
  colourById?: Record<string, string>;
  /** tip id -> display label (e.g. "<id> (+N variants)"). Falls back to the id. */
  labelById?: Record<string, string>;
  /** tip id -> native tooltip text (full id, name distribution, …), shown via an SVG <title>. */
  tipTitleById?: Record<string, string>;
  /** exponent applied to branch lengths (γ); < 1 amplifies/de-flattens, 1 = unchanged. */
  branchLengthExponent?: number;
  /**
   * Multiplier on the horizontal (branch-length) axis. Unlike the exponent, this always visibly
   * stretches the tree — phylotree scales every x-position by the left-right spacing, independent of
   * branch-length variance or a cladogram fallback. 1 = default width.
   */
  horizontalScale?: number;
  hoveredId?: string | null;
  selectedIds?: Set<string>;
  onHoverTip?: (id: string | null) => void;
  onSelectTip?: (id: string) => void;
  /** Click an internal node → receive the tip ids of its whole subtree (for manual grouping). When
   *  provided, internal nodes become clickable. */
  onSelectClade?: (tipIds: string[]) => void;
  /** Hover an internal node → its subtree tip ids (or null on leave), for grouping preview. */
  onHoverClade?: (tipIds: string[] | null) => void;
  /** What a node click does: 'select' (group/link, the default) or 'reroot' (re-root the tree on
   *  the clicked node, in place via phylotree). */
  interactionMode?: 'select' | 'reroot';
  /** Subtree tip ids currently previewed (hovered internal node) — highlights those branches/tips. */
  previewIds?: Set<string> | null;
  /** Sorted-tip-id signature ("a|b|c") -> colour for group MRCAs; their stem branch is emphasised. */
  cladeSignatureColour?: Record<string, string>;
  /** The query sequence's tip id — rendered specially (the user's subject of investigation). */
  queryId?: string;
  height?: number;
};

// Distinct, high-contrast colour for the query tip so it stands out from any group colour.
const QUERY_COLOUR = '#b91c1c';

/** All tip names under a phylotree/d3 hierarchy node (recurses over `.children`). */
function leavesOf(node: any): string[] {
  if (node?.children && node.children.length) return node.children.flatMap(leavesOf);
  const name = node?.data?.name;
  return name ? [name] : [];
}

/**
 * Find the node in a (headless) phylotree whose subtree tip set exactly matches `target`. Tip names
 * are unique, so a leaf set identifies a single node — used to map a click on the rendered tree onto
 * the corresponding node of a fresh tree we can re-root without touching the DOM.
 */
function findNodeByLeafSet(tree: any, target: string[]): any {
  const want = [...target].sort().join('|');
  let found: any = null;
  tree.nodes.each((n: any) => {
    if (!found && leavesOf(n).sort().join('|') === want) found = n;
  });
  return found;
}

/**
 * Renders a Newick tree with phylotree.js into an isolated shadow root (so its CSS doesn't leak),
 * with tip colours and two-way linking hooks. Tip elements are tagged `data-tip="<id>"` so colour
 * and hover/selection highlight can be re-applied on prop changes without re-rendering the tree.
 */
export function PhyloTreeView({
  newick,
  colourById,
  labelById,
  tipTitleById,
  branchLengthExponent = 1,
  horizontalScale = 1,
  hoveredId,
  selectedIds,
  onHoverTip,
  onSelectTip,
  onSelectClade,
  onHoverClade,
  interactionMode = 'select',
  previewIds,
  cladeSignatureColour,
  queryId,
  height = 500,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Keep latest callbacks + mode in a ref so the (expensive) render effect only depends on the
  // rendered Newick and click handlers always read the current mode.
  const cbRef = useRef({ onHoverTip, onSelectTip, onSelectClade, onHoverClade, interactionMode });
  cbRef.current = { onHoverTip, onSelectTip, onSelectClade, onHoverClade, interactionMode };

  // Re-rooting: an alternative topology chosen by the user, replacing the incoming `newick` until
  // the source changes. It is already branch-length-exaggerated (it comes from re-rooting the
  // rendered tree), so it is rendered as-is; a fresh `newick` or exponent resets it.
  const [rerootedNewick, setRerootedNewick] = useState<string | null>(null);
  useEffect(() => setRerootedNewick(null), [newick, branchLengthExponent]);
  const renderNewick = useMemo(
    () => rerootedNewick ?? exaggerateBranchLengths(newick, branchLengthExponent),
    [rerootedNewick, newick, branchLengthExponent]
  );

  // Render the tree once per Newick.
  useEffect(() => {
    const host = ref.current;
    if (!renderNewick || !host) return;

    const options = {
      'show-menu': false,
      'left-right-spacing:': 'fit-to-size',
      selectable: false,
      zoom: false,
      'node-styler': (element: any, data: any) => {
        const name: string | undefined = data?.data?.name;
        const isTip = !!name && !data.children;
        // Re-root on the clicked node. phylotree's own reroot re-renders into a container it manages,
        // which doesn't exist in our manual shadow-DOM setup — so instead re-root a fresh *headless*
        // tree (no display ⇒ reroot skips all DOM work), read back its Newick, and let React re-render
        // from it. The clicked node belongs to the rendered tree, so we locate its counterpart in the
        // headless tree by leaf set.
        const reroot = () => {
          try {
            const headless: any = new phylotree(renderNewick);
            const target = findNodeByLeafSet(headless, leavesOf(data));
            if (!target) return;
            headless.reroot(target);
            setRerootedNewick(headless.getNewick());
          } catch {
            // Ignore invalid re-root targets (e.g. the current root).
          }
        };
        if (isTip) {
          element.attr('data-tip', name);
          element.style('cursor', 'pointer');
          element.on('mouseover', () => cbRef.current.onHoverTip?.(name!));
          element.on('mouseout', () => cbRef.current.onHoverTip?.(null));
          element.on('click', () => {
            if (cbRef.current.interactionMode === 'reroot') reroot();
            else cbRef.current.onSelectTip?.(name!);
          });
        } else if (cbRef.current.onSelectClade || cbRef.current.onHoverClade) {
          // Internal node: click groups its subtree (select mode) or re-roots on it (re-root mode);
          // hover previews the subtree either way.
          const leaves = leavesOf(data);
          element.style('cursor', 'pointer');
          element.on('click', () => {
            if (cbRef.current.interactionMode === 'reroot') reroot();
            else cbRef.current.onSelectClade?.(leaves);
          });
          if (cbRef.current.onHoverClade) {
            element.on('mouseover', () => cbRef.current.onHoverClade?.(leaves));
            element.on('mouseout', () => cbRef.current.onHoverClade?.(null));
          }
        }
      },
      // Tag each branch with the tip ids of the subtree below it, so branches can be tinted per
      // group in the colour pass without re-rendering.
      'edge-styler': (container: any, edge: any) => {
        const el = container?.node?.() ?? container;
        if (el && el.setAttribute) {
          el.__leaves = leavesOf(edge?.target);
          el.setAttribute('data-branch', '');
        }
      },
    };

    let svg: SVGElement;
    try {
      const tree: any = new phylotree(renderNewick);
      // phylotree needs render called before display exists; render twice (see phylotree #471).
      tree.render(options);
      tree.display.css(css_classes).update();
      tree.render(options);
      tree.display.spacing_x(14).update();
      // spacing_y is the horizontal (branch-length) axis in phylotree; scaling it stretches the
      // whole tree horizontally, which always responds to the slider (see horizontalScale).
      tree.display.spacing_y(Math.max(1, Math.round(16 * horizontalScale))).update();
      svg = tree.display.show();
    } catch {
      // Degenerate/unsupported tree (e.g. a single tip) — leave the panel empty rather than crash.
      return;
    }

    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    while (shadow.firstChild) shadow.removeChild(shadow.firstChild);
    const style = document.createElement('style');
    style.textContent = cssAsText;
    shadow.appendChild(style);
    shadow.appendChild(svg);

    return () => {
      const s = host.shadowRoot;
      if (s) while (s.firstChild) s.removeChild(s.firstChild);
    };
    // `onSelectClade`/`onHoverClade` are included so toggling manual-grouping mode (which flips them
    // between a stable callback and undefined) re-renders the tree and (un)wires the internal-node
    // click/hover handlers.
  }, [renderNewick, horizontalScale, onSelectClade, onHoverClade]);

  // Apply colours + hover/selection highlight to the rendered tips (no full re-render). Extracted so
  // the effect below can re-run it after the tree is (re)rendered or any style input changes.
  const applyStyles = useCallback(() => {
    const shadow = ref.current?.shadowRoot;
    if (!shadow) return;
    const tips = shadow.querySelectorAll<SVGElement>('[data-tip]');
    tips.forEach((el) => {
      const id = el.getAttribute('data-tip')!;
      const colour = colourById?.[id];
      const isHovered = !!hoveredId && id === hoveredId;
      const isSelected = !!selectedIds?.has(id);
      const isPreview = !!previewIds?.has(id);
      const isQuery = !!queryId && id === queryId;
      // The query tip is always drawn in its own colour + bold, overriding any group colour, and is
      // never faded, so the user's subject of investigation stays visible.
      el.style.fill = isQuery ? QUERY_COLOUR : colour ?? '';
      el.style.fontWeight = isQuery || isHovered || isSelected || isPreview ? 'bold' : '';
      el.style.textDecoration = isSelected ? 'underline' : '';
      el.style.opacity = !isQuery && hoveredId && !isHovered ? '0.35' : '1';
      // Swap the visible label (e.g. add "(+N variants)"); the data-tip attribute keeps the id.
      const label = labelById?.[id];
      if (label) {
        const textEl = el.tagName.toLowerCase() === 'text' ? el : el.querySelector('text');
        if (textEl && textEl.textContent !== label) textEl.textContent = label;
      }
      // Native tooltip: full id + scientific-name distribution, without cluttering the tip.
      const title = tipTitleById?.[id];
      if (title != null) {
        let titleEl = el.querySelector(':scope > title') as SVGTitleElement | null;
        if (!titleEl) {
          titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
          el.insertBefore(titleEl, el.firstChild);
        }
        if (titleEl.textContent !== title) titleEl.textContent = title;
      }
    });

    // Tint branches by group: a branch whose entire descendant tip set shares one colour is drawn
    // in that colour; the group's stem branch (its subtree exactly matches a group) is thickened as
    // an MRCA cue. Hovering an internal node previews its subtree's branches.
    const branches = shadow.querySelectorAll<SVGElement & { __leaves?: string[] }>('[data-branch]');
    branches.forEach((el) => {
      const leaves = el.__leaves ?? [];
      let stroke = '';
      let width = '';
      if (leaves.length > 0) {
        const colours = new Set(leaves.map((lid) => colourById?.[lid]));
        const only = colours.size === 1 ? [...colours][0] : undefined;
        if (only) {
          stroke = only;
          const sig = [...leaves].sort().join('|');
          if (cladeSignatureColour?.[sig]) width = '3.5'; // stem of a whole group = MRCA marker
        }
      }
      if (previewIds && leaves.length > 0 && leaves.every((lid) => previewIds.has(lid))) {
        stroke = stroke || '#334155';
        width = '3.5';
      }
      el.style.stroke = stroke;
      el.style.strokeWidth = width;
    });
  }, [
    colourById,
    labelById,
    tipTitleById,
    hoveredId,
    selectedIds,
    previewIds,
    cladeSignatureColour,
    queryId,
  ]);

  // Re-apply after a fresh render (rendered Newick or scale change rebuilds the SVG) or when any
  // style input changes.
  useEffect(() => {
    applyStyles();
  }, [applyStyles, renderNewick, horizontalScale]);

  return <div ref={ref} className="g-overflow-auto g-bg-white" style={{ height }} />;
}
