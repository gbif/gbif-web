import { phylotree } from 'phylotree';
import { useEffect, useRef } from 'react';
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

type Props = {
  /** Newick string whose tip names are nucleotideSequenceIDs. */
  newick: string;
  /** tip id -> colour (e.g. cluster colour). */
  colourById?: Record<string, string>;
  /** tip id -> display label (e.g. "<id> (+N variants)"). Falls back to the id. */
  labelById?: Record<string, string>;
  hoveredId?: string | null;
  selectedIds?: Set<string>;
  onHoverTip?: (id: string | null) => void;
  onSelectTip?: (id: string) => void;
  height?: number;
};

/**
 * Renders a Newick tree with phylotree.js into an isolated shadow root (so its CSS doesn't leak),
 * with tip colours and two-way linking hooks. Tip elements are tagged `data-tip="<id>"` so colour
 * and hover/selection highlight can be re-applied on prop changes without re-rendering the tree.
 */
export function PhyloTreeView({
  newick,
  colourById,
  labelById,
  hoveredId,
  selectedIds,
  onHoverTip,
  onSelectTip,
  height = 500,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Keep latest callbacks in a ref so the (expensive) render effect only depends on `newick`.
  const cbRef = useRef({ onHoverTip, onSelectTip });
  cbRef.current = { onHoverTip, onSelectTip };

  // Render the tree once per Newick.
  useEffect(() => {
    const host = ref.current;
    if (!newick || !host) return;

    const options = {
      'show-menu': false,
      'left-right-spacing:': 'fit-to-size',
      selectable: false,
      zoom: false,
      'node-styler': (element: any, data: any) => {
        const name: string | undefined = data?.data?.name;
        const isTip = !!name && !data.children;
        if (!isTip) return;
        element.attr('data-tip', name);
        element.style('cursor', 'pointer');
        element.on('mouseover', () => cbRef.current.onHoverTip?.(name!));
        element.on('mouseout', () => cbRef.current.onHoverTip?.(null));
        element.on('click', () => cbRef.current.onSelectTip?.(name!));
      },
    };

    let svg: SVGElement;
    try {
      const tree: any = new phylotree(newick);
      // phylotree needs render called before display exists; render twice (see phylotree #471).
      tree.render(options);
      tree.display.css(css_classes).update();
      tree.render(options);
      tree.display.spacing_x(14).update();
      tree.display.spacing_y(16).update();
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
  }, [newick]);

  // Apply colours + hover/selection highlight to the rendered tips (no re-render). Runs whenever
  // colours, hover, or selection change, and after a fresh render (newick).
  useEffect(() => {
    const shadow = ref.current?.shadowRoot;
    if (!shadow) return;
    const tips = shadow.querySelectorAll<SVGElement>('[data-tip]');
    tips.forEach((el) => {
      const id = el.getAttribute('data-tip')!;
      const colour = colourById?.[id];
      const isHovered = !!hoveredId && id === hoveredId;
      const isSelected = !!selectedIds?.has(id);
      el.style.fill = colour ?? '';
      el.style.fontWeight = isHovered || isSelected ? 'bold' : '';
      el.style.textDecoration = isSelected ? 'underline' : '';
      // Fade non-hovered tips so the linked one stands out when hovering from the map.
      el.style.opacity = hoveredId && !isHovered ? '0.35' : '1';
      // Swap the visible label (e.g. add "(+N variants)"); the data-tip attribute keeps the id.
      const label = labelById?.[id];
      if (label) {
        const textEl = el.tagName.toLowerCase() === 'text' ? el : el.querySelector('text');
        if (textEl && textEl.textContent !== label) textEl.textContent = label;
      }
    });
  }, [newick, colourById, labelById, hoveredId, selectedIds]);

  return <div ref={ref} className="g-overflow-auto g-bg-white" style={{ height }} />;
}
