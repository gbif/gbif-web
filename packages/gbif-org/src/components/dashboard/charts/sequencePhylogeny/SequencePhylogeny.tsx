import { ClientSideOnly } from '@/components/clientSideOnly';
import { Card, CardContent, CardTitle } from '@/components/ui/smallCard';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { FilterContext } from '@/contexts/filter';
import useBelow from '@/hooks/useBelow';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { parseSequenceFilterValue } from '@/utils/sequenceSearch';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { LuLoader as Loader, LuSettings2 as FilterIcon } from 'react-icons/lu';
import { ColoredPointMap, MapPoint } from './ColoredPointMap';
import { PhyloTreeView } from './PhyloTreeView';
import {
  buildTreeFromDistance,
  computeAlignment,
  filterByCoverage,
  type DistanceResult,
} from './compute';
import { consensusForMembers } from './compute/consensus';
import { useSequenceTreeData } from './useSequenceTreeData';

const PANEL_HEIGHT = 520;
// Sentinel tip id for the user's query sequence (safe as a FASTA header / Newick tip name, and
// won't collide with a real hex nucleotideSequenceID).
const QUERY_ID = '__query__';
// Hide sequences shorter than this fraction of the set's median length — short partials can't be
// placed reliably by the distance method and distort the tree. Median-relative; tune as needed.
const COVERAGE_FRACTION = 0.6;
// Collapse-threshold slider bounds (percent identity). 100 = collapse only identical sequences.
const COLLAPSE_MIN_PCT = 97;
const DEFAULT_COLLAPSE_PCT = 99.5;
const EMPTY_GROUPS: Record<string, string[]> = {};

// One distinct hue per manual group (by index); shared by the colour map and the MRCA signatures.
const groupColour = (idx: number, n: number) =>
  `hsl(${Math.round((idx / Math.max(1, n)) * 360)}, 68%, 50%)`;
const sortedSig = (ids: string[]) => [...ids].sort().join('|');

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="g-flex g-items-center g-justify-center g-gap-2 g-text-sm g-text-slate-500 g-py-16 g-text-center g-px-4">
      {children}
    </div>
  );
}

/**
 * Dashboard item: builds a phylogenetic tree from the sequences matched by the "Similar sequences"
 * filter (kalign MSA → p-distance → neighbor-joining, all client-side) and shows it beside a map of
 * the occurrences carrying those sequences. Tips are nucleotideSequenceIDs. The user groups clades
 * by clicking internal nodes; each group gets a colour shared by the tree tips and the map dots, and
 * tips and dots are linked on hover/selection.
 */
export function SequencePhylogeny({ predicate }: { predicate?: unknown }) {
  const { seqById, pointsById, namesById, matchedIds, loading, error, total, capped, mapCapped, maxSequences } =
    useSequenceTreeData(predicate);

  const seqKey = useMemo(() => Object.keys(seqById).sort().join(','), [seqById]);
  const sequenceCount = seqKey ? seqKey.split(',').length : 0;

  // The sequence the user pasted into the "Similar sequences" filter — their query subject. It is
  // added to the alignment/tree as a specially-marked tip (it is not one of the matched records).
  const filterContext = useContext(FilterContext);
  const querySequence = useMemo(() => {
    const raw = (filterContext?.filter as any)?.must?.nucleotideSequenceId?.[0];
    const parsed = raw != null ? parseSequenceFilterValue(raw) : undefined;
    // Drop any FASTA header line, strip whitespace, upper-case (IUPAC ambiguity codes are kept).
    const seq = parsed?.sequence
      ?.split(/\r?\n/)
      .filter((l) => !l.startsWith('>'))
      .join('')
      .replace(/\s+/g, '')
      .toUpperCase();
    return seq && seq.length > 0 ? seq : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterContext?.filterHash]);

  // Drop matched sequences that are too short to place reliably (see COVERAGE_FRACTION).
  const coverage = useMemo(() => filterByCoverage(seqById, COVERAGE_FRACTION), [seqById]);
  const hiddenShortCount = coverage.hiddenIds.length;

  // Kept matched sequences plus the query, fed to alignment/tree. The query is always kept (it is
  // the user's subject, marked separately). Counts/captions stay on the full matched set.
  const seqForTree = useMemo(
    () => (querySequence ? { [QUERY_ID]: querySequence, ...coverage.kept } : coverage.kept),
    [coverage.kept, querySequence]
  );
  const treeSeqKey = useMemo(() => Object.keys(seqForTree).sort().join(','), [seqForTree]);

  const [fullDist, setFullDist] = useState<DistanceResult | null>(null);
  // Alignment column count, kept so the tree build can size the polytomy-collapse epsilon.
  const [alignLen, setAlignLen] = useState(0);
  const [aligning, setAligning] = useState(false);
  const [computeError, setComputeError] = useState<unknown>(null);
  // Collapse sequences that are >= this % identical into a single representative tip.
  const [collapsePct, setCollapsePct] = useState(DEFAULT_COLLAPSE_PCT);
  const threshold = Math.max(0, (100 - collapsePct) / 100);
  // Branch-length amplification. Trees over highly-similar sequences are often visually flat. The
  // slider drives two effects from one value: a horizontal stretch (always visible, spacing_y) and
  // a power transform γ = 1/amp that expands short branches relative to long ones (contrast).
  const [branchAmp, setBranchAmp] = useState(2);
  const branchExponent = 1 / branchAmp;
  // What clicking a tree node does: paint/group clades ('select', default) or re-root the tree.
  const [interactionMode, setInteractionMode] = useState<'select' | 'reroot'>('select');

  // Expensive step (kalign MSA + distance matrix) — runs once per resolved sequence set (query
  // included).
  useEffect(() => {
    const ids = treeSeqKey ? treeSeqKey.split(',') : [];
    if (ids.length < 2) {
      setFullDist(null);
      setAlignLen(0);
      setAligning(false);
      return;
    }
    let cancelled = false;
    setAligning(true);
    setComputeError(null);
    setFullDist(null);
    computeAlignment(seqForTree)
      .then((res) => {
        if (!cancelled) {
          setFullDist(res.fullDist);
          setAlignLen(res.alignmentLength);
        }
      })
      .catch((e) => {
        if (!cancelled) setComputeError(e);
      })
      .finally(() => {
        if (!cancelled) setAligning(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeSeqKey]);

  // Cheap step: collapse at the current threshold + build the tree. The query is pinned so it is
  // never collapsed into a matched representative. Recomputes instantly when the slider moves.
  const built = useMemo(
    () =>
      fullDist
        ? buildTreeFromDistance(
            fullDist,
            threshold,
            querySequence ? new Set([QUERY_ID]) : undefined,
            alignLen
          )
        : null,
    [fullDist, threshold, querySequence, alignLen]
  );
  const newick = built?.newick ?? null;
  const groups = built?.groups ?? EMPTY_GROUPS;

  // Representatives (distinct sequences = tree tips) and the collapse mapping.
  const repCount = useMemo(() => Object.keys(groups).length, [groups]);
  // Distinct matched sequences (excludes the query tip, which is pinned as its own representative).
  const distinctMatched = repCount - (querySequence ? 1 : 0);
  const repOfId = useMemo(() => {
    const out: Record<string, string> = {};
    for (const [rep, members] of Object.entries(groups)) for (const m of members) out[m] = rep;
    return out;
  }, [groups]);
  const intl = useIntl();

  // Consensus scientific name per tip (representative), merging the name distributions of all
  // collapsed members. Cheap; recomputes only when the tip set or the fetched names change.
  const consensusByRep = useMemo(() => {
    const out: Record<string, ReturnType<typeof consensusForMembers>> = {};
    for (const [rep, members] of Object.entries(groups)) {
      out[rep] = consensusForMembers(members, namesById);
    }
    return out;
  }, [groups, namesById]);

  const labelById = useMemo(() => {
    const out: Record<string, string> = {};
    // Tip labels show a short id (first 5 chars) — the full id is kept on the tip's data-tip
    // attribute for colouring/linking.
    const short = (id: string) => `${id.slice(0, 5)}…`;
    const truncate = (s: string) => (s.length > 36 ? `${s.slice(0, 35)}…` : s);
    // Strip the author string from a scientific name for the tip label: keep the binomial when the
    // second word is a species epithet (starts lowercase), otherwise just the first word (a
    // uninomial genus/higher taxon). The full name stays in the tooltip.
    const taxonName = (s: string) => {
      const words = s.trim().split(/\s+/);
      if (words.length >= 2 && /^[a-z]/.test(words[1])) return `${words[0]} ${words[1]}`;
      return words[0] ?? s;
    };
    for (const [rep, members] of Object.entries(groups)) {
      if (rep === QUERY_ID) {
        out[rep] = intl.formatMessage({
          id: 'dashboard.sequencePhylogeny.queryTip',
          defaultMessage: '◆ Your query sequence',
        });
        continue;
      }
      const idPart =
        members.length > 1
          ? `${short(rep)}  ${intl.formatMessage(
              {
                id: 'dashboard.sequencePhylogeny.variants',
                defaultMessage: '(+{n, plural, one {# similar variant} other {# similar variants}})',
              },
              { n: members.length - 1 }
            )}`
          : short(rep);
      // Lead with the consensus name (+ a ▲ when identifications disagree); the id/variants detail
      // stays in the tooltip. Fall back to the id when no name is known.
      const consensus = consensusByRep[rep];
      out[rep] = consensus?.primary
        ? `${truncate(taxonName(consensus.primary))}${consensus.ambiguous ? ' ▲' : ''}`
        : idPart;
    }
    return out;
  }, [groups, intl, consensusByRep]);

  // Native tooltip per tip: full id, collapsed-variant count, and the name distribution — so
  // hovering a tip reveals the underlying id and explains any ▲ ambiguity marker.
  const tipTitleById = useMemo(() => {
    const out: Record<string, string> = {};
    for (const [rep, members] of Object.entries(groups)) {
      if (rep === QUERY_ID) {
        out[rep] = 'Your query sequence (not a GBIF record)';
        continue;
      }
      const c = consensusByRep[rep];
      const lines = [rep];
      if (members.length > 1) lines.push(`+${members.length - 1} similar variant(s)`);
      if (c && c.top.length > 0) {
        lines.push('');
        for (const n of c.top) lines.push(`${n.name} (${n.count})`);
        if (c.distinct > c.top.length) lines.push(`… ${c.distinct - c.top.length} more`);
        lines.push(`based on ${c.sampled} record(s)`);
      }
      out[rep] = lines.join('\n');
    }
    return out;
  }, [groups, consensusByRep]);

  // Manual grouping: the user paints clades by clicking internal nodes. Groups are stored as tip-id
  // sets (stable across tree re-renders); colours are derived by group index so they stay distinct.
  const [manualGroups, setManualGroups] = useState<string[][]>([]);
  const handleSelectClade = useCallback((tipIds: string[]) => {
    if (tipIds.length === 0) return;
    setManualGroups((prev) => {
      const set = new Set(tipIds);
      // Clicking a subtree that is already exactly one group toggles it off (erase).
      const exactIdx = prev.findIndex(
        (g) => g.length === set.size && g.every((id) => set.has(id))
      );
      if (exactIdx !== -1) return prev.filter((_, i) => i !== exactIdx);
      // Otherwise remove these tips from any other group (last-click-wins), drop emptied groups,
      // and add the clicked subtree as a new group.
      const trimmed = prev
        .map((g) => g.filter((id) => !set.has(id)))
        .filter((g) => g.length > 0);
      return [...trimmed, [...set]];
    });
  }, []);
  const clearManualGroups = useCallback(() => setManualGroups([]), []);
  // Every nucleotideSequenceID covered by the manual groups, for the "Use as filter" action. Group
  // members are tree tips (representatives), so each is expanded to the sequences it collapsed
  // (groups[rep]); the pinned query tip is not a real record and is excluded.
  const groupedSequenceIds = useMemo(() => {
    const out = new Set<string>();
    for (const group of manualGroups) {
      for (const rep of group) {
        for (const id of groups[rep] ?? [rep]) {
          if (id !== QUERY_ID) out.add(id);
        }
      }
    }
    return [...out];
  }, [manualGroups, groups]);
  // Preview the subtree under a hovered internal node (manual mode).
  const [previewIds, setPreviewIds] = useState<Set<string> | null>(null);
  const handleHoverClade = useCallback(
    (tipIds: string[] | null) => setPreviewIds(tipIds ? new Set(tipIds) : null),
    []
  );

  const manualColourById = useMemo(() => {
    const out: Record<string, string> = {};
    const n = manualGroups.length;
    manualGroups.forEach((ids, idx) => {
      const colour = groupColour(idx, n);
      ids.forEach((id) => {
        out[id] = colour;
      });
    });
    return out;
  }, [manualGroups]);

  // Sorted-tip signature -> colour for each group, so the tree can emphasise each group's stem
  // (MRCA) branch.
  const cladeSignatureColour = useMemo(() => {
    const out: Record<string, string> = {};
    const n = manualGroups.length;
    manualGroups.forEach((ids, idx) => {
      out[sortedSig(ids)] = groupColour(idx, n);
    });
    return out;
  }, [manualGroups]);

  // Tips + map dots are driven by this one map: the user's manual groups (unpainted tips = neutral).
  const colourById = manualColourById;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Draggable split between the tree and the map. `treeFlex` is the tree's share of the row width
  // (the map gets the rest). Only active in the side-by-side layout; the panels stack below `lg`.
  const stackedPanels = useBelow(1024);
  const splitRef = useRef<HTMLDivElement>(null);
  const [treeFlex, setTreeFlex] = useState(0.5);
  const [draggingSplit, setDraggingSplit] = useState(false);
  const onSplitMove = useCallback((e: PointerEvent) => {
    const el = splitRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setTreeFlex(Math.min(0.85, Math.max(0.15, ratio)));
  }, []);
  const onSplitEnd = useCallback(() => {
    setDraggingSplit(false);
    window.removeEventListener('pointermove', onSplitMove);
    window.removeEventListener('pointerup', onSplitEnd);
  }, [onSplitMove]);
  const onSplitStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setDraggingSplit(true);
      window.addEventListener('pointermove', onSplitMove);
      window.addEventListener('pointerup', onSplitEnd);
    },
    [onSplitMove, onSplitEnd]
  );
  const onSplitKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setTreeFlex((v) => Math.max(0.15, v - 0.05));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setTreeFlex((v) => Math.min(0.85, v + 0.05));
    }
  }, []);
  // Clean up window listeners if we unmount mid-drag.
  useEffect(
    () => () => {
      window.removeEventListener('pointermove', onSplitMove);
      window.removeEventListener('pointerup', onSplitEnd);
    },
    [onSplitMove, onSplitEnd]
  );

  // Map dots are keyed by the representative id (so a group's occurrences share colour + linking).
  // Colour is applied by the map from `colourById` (not baked into the point), so recolouring
  // doesn't rebuild the feature set.
  const points: MapPoint[] = useMemo(() => {
    const out: MapPoint[] = [];
    const seen = new Set<string>();
    for (const [id, pts] of Object.entries(pointsById)) {
      // Skip occurrences whose sequence isn't a tree tip (hidden as too short, or otherwise absent),
      // so the map stays consistent with the tree.
      const rep = repOfId[id];
      if (!rep) continue;
      for (const p of pts) {
        const dedupeKey = `${rep}|${p.key}`;
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);
        out.push({ id: rep, lat: p.lat, lon: p.lon });
      }
    }
    return out;
  }, [pointsById, repOfId]);

  const showTree = !!newick && sequenceCount >= 2 && !loading && !aligning && !error && !computeError;

  let body: React.ReactNode;
  if (matchedIds.length === 0) {
    body = (
      <Hint>
        <FormattedMessage
          id="dashboard.sequencePhylogeny.noFilter"
          defaultMessage="Apply the “Similar sequences” filter to build a tree from the matched sequences."
        />
      </Hint>
    );
  } else if (capped) {
    body = (
      <Hint>
        <FormattedMessage
          id="dashboard.sequencePhylogeny.tooMany"
          defaultMessage="Too many matched sequences ({count}) to align in the browser. Narrow the similarity threshold to under {max}."
          values={{ count: matchedIds.length, max: maxSequences }}
        />
      </Hint>
    );
  } else if (loading || aligning) {
    body = (
      <Hint>
        <Loader className="g-animate-spin g-text-slate-400" />
        <FormattedMessage
          id="dashboard.sequencePhylogeny.building"
          defaultMessage="Aligning sequences and building the tree…"
        />
      </Hint>
    );
  } else if (error || computeError) {
    body = (
      <Hint>
        <FormattedMessage
          id="dashboard.sequencePhylogeny.error"
          defaultMessage="Could not build the tree from these sequences."
        />
      </Hint>
    );
  } else if (!showTree) {
    body = (
      <Hint>
        <FormattedMessage
          id="dashboard.sequencePhylogeny.tooFew"
          defaultMessage="Need at least two matched sequences to build a tree."
        />
      </Hint>
    );
  } else {
    body = (
      <>
      {/* Transparent overlay during a drag so the map/tree don't capture the pointer. */}
      {draggingSplit && <div className="g-fixed g-inset-0 g-z-50 g-cursor-col-resize" />}
      <div
        ref={splitRef}
        className={cn('g-flex g-gap-3', stackedPanels ? 'g-flex-col' : 'g-flex-row')}
      >
        <div
          className={cn('g-min-w-0 g-border g-rounded g-border-slate-200', stackedPanels && 'g-flex-1')}
          style={stackedPanels ? undefined : { flexGrow: treeFlex, flexBasis: 0 }}
        >
          <PhyloTreeView
            newick={newick!}
            colourById={colourById}
            labelById={labelById}
            tipTitleById={tipTitleById}
            branchLengthExponent={branchExponent}
            horizontalScale={branchAmp}
            hoveredId={hoveredId}
            selectedIds={selectedIds}
            onHoverTip={setHoveredId}
            onSelectTip={toggleSelect}
            onSelectClade={handleSelectClade}
            onHoverClade={handleHoverClade}
            interactionMode={interactionMode}
            previewIds={previewIds}
            cladeSignatureColour={cladeSignatureColour}
            queryId={querySequence ? QUERY_ID : undefined}
            height={PANEL_HEIGHT}
          />
        </div>
        {!stackedPanels && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize tree and map"
            aria-valuenow={Math.round(treeFlex * 100)}
            aria-valuemin={15}
            aria-valuemax={85}
            tabIndex={0}
            onPointerDown={onSplitStart}
            onKeyDown={onSplitKey}
            className="g-shrink-0 g-w-1.5 g-cursor-col-resize g-rounded g-bg-slate-200 hover:g-bg-slate-400 focus:g-bg-slate-400 focus:g-outline-none"
          />
        )}
        <div
          className={cn(
            'g-min-w-0 g-border g-rounded g-border-slate-200 g-overflow-hidden',
            stackedPanels && 'g-flex-1'
          )}
          style={stackedPanels ? undefined : { flexGrow: 1 - treeFlex, flexBasis: 0 }}
        >
          <ColoredPointMap
            points={points}
            colourById={colourById}
            hoveredId={hoveredId}
            selectedIds={selectedIds}
            onHoverTip={setHoveredId}
            onSelectTip={toggleSelect}
            height={PANEL_HEIGHT}
          />
        </div>
      </div>
      </>
    );
  }

  return (
    <Card className="g-p-4">
      <CardContent className="g-p-0">
        <div className="g-flex g-items-center g-justify-between g-mb-2 g-gap-2 g-flex-wrap">
          <CardTitle>
            <FormattedMessage
              id="dashboard.sequencePhylogeny"
              defaultMessage="Sequence phylogeny"
            />
          </CardTitle>
          <div className="g-flex g-items-center g-gap-3 g-flex-wrap">
            {showTree && (
              <label className="g-flex g-items-center g-gap-1 g-text-xs g-text-slate-500">
                <FormattedMessage
                  id="dashboard.sequencePhylogeny.collapse"
                  defaultMessage="Collapse ≥ {pct}%"
                  values={{ pct: collapsePct.toFixed(1) }}
                />
                <input
                  type="range"
                  min={COLLAPSE_MIN_PCT}
                  max={100}
                  step={0.1}
                  value={collapsePct}
                  onChange={(e) => setCollapsePct(parseFloat(e.target.value))}
                  className="g-w-24"
                  aria-label="Collapse threshold"
                />
              </label>
            )}
            {showTree && (
              <label className="g-flex g-items-center g-gap-1 g-text-xs g-text-slate-500">
                <FormattedMessage
                  id="dashboard.sequencePhylogeny.branchScale"
                  defaultMessage="Branch length"
                />
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.25}
                  value={branchAmp}
                  onChange={(e) => setBranchAmp(parseFloat(e.target.value))}
                  className="g-w-20"
                  aria-label="Branch length amplification"
                />
              </label>
            )}
            {showTree && repCount >= 3 && (
              <div className="g-flex g-items-center g-gap-2 g-text-xs g-text-slate-500">
                {/* Switch what a node click does: paint/group clades, or re-root the tree. */}
                <div className="g-inline-flex g-rounded g-border g-border-slate-300 g-overflow-hidden">
                  {(['select', 'reroot'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setInteractionMode(m)}
                      aria-pressed={interactionMode === m}
                      className={cn(
                        'g-px-2 g-py-0.5',
                        interactionMode === m
                          ? 'g-bg-slate-100 g-font-medium'
                          : 'hover:g-bg-slate-50'
                      )}
                    >
                      <FormattedMessage
                        id={`dashboard.sequencePhylogeny.clickMode.${m}`}
                        defaultMessage={m === 'select' ? 'Select' : 'Re-root'}
                      />
                    </button>
                  ))}
                </div>
                {manualGroups.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={clearManualGroups}
                      className="g-rounded g-border g-border-slate-300 g-px-2 g-py-0.5 hover:g-bg-slate-100"
                    >
                      <FormattedMessage
                        id="dashboard.sequencePhylogeny.grouping.clear"
                        defaultMessage="Clear groups ({n})"
                        values={{ n: manualGroups.length }}
                      />
                    </button>
                    {groupedSequenceIds.length > 0 && (
                      <DynamicLink
                        pageId="occurrenceSearch"
                        // Fresh params clear the current search; the grouped sequence ids become a
                        // nucleotideSequenceID filter and we land on the table view.
                        searchParams={{
                          view: 'table',
                          'nucleotideSequence.nucleotideSequenceID': groupedSequenceIds,
                        }}
                        className="g-inline-flex g-items-center g-gap-1 g-rounded g-border g-border-slate-300 g-px-2 g-py-0.5 hover:g-bg-slate-100"
                      >
                        <FormattedMessage
                          id="search.group.useAsFilter"
                          defaultMessage="Use as filter"
                        />
                        <FilterIcon className="g-text-sm" />
                      </DynamicLink>
                    )}
                  </>
                ) : (
                  <span className="g-text-slate-400">
                    {interactionMode === 'reroot' ? (
                      <FormattedMessage
                        id="dashboard.sequencePhylogeny.reroot.hint"
                        defaultMessage="Click a node to re-root the tree"
                      />
                    ) : (
                      <FormattedMessage
                        id="dashboard.sequencePhylogeny.grouping.hint"
                        defaultMessage="Click a branch point to group its clade"
                      />
                    )}
                  </span>
                )}
              </div>
            )}
            {matchedIds.length > 0 && !capped && sequenceCount > 0 && (
              <span className="g-flex-none g-text-xs g-text-slate-500">
                <FormattedMessage
                  id="dashboard.sequencePhylogeny.count"
                  defaultMessage="{n} sequences · {o} occurrences"
                  values={{ n: sequenceCount, o: total }}
                />
                {distinctMatched > 0 && distinctMatched < sequenceCount && (
                  <FormattedMessage
                    id="dashboard.sequencePhylogeny.distinct"
                    defaultMessage=" · {d} distinct"
                    values={{ d: distinctMatched }}
                  />
                )}
                {hiddenShortCount > 0 && (
                  <SimpleTooltip
                    title={
                      <FormattedMessage
                        id="dashboard.sequencePhylogeny.shortHiddenTip"
                        defaultMessage="Sequences shorter than {pct}% of the median length are hidden: too short to place reliably in the tree."
                        values={{ pct: Math.round(COVERAGE_FRACTION * 100) }}
                      />
                    }
                    asChild
                  >
                    <span className="g-ms-2 g-text-amber-600">
                      <FormattedMessage
                        id="dashboard.sequencePhylogeny.shortHidden"
                        defaultMessage="· {n} short hidden"
                        values={{ n: hiddenShortCount }}
                      />
                    </span>
                  </SimpleTooltip>
                )}
                {mapCapped && (
                  <span className="g-ms-2 g-text-amber-600">
                    <FormattedMessage
                      id="dashboard.sequencePhylogeny.mapCapped"
                      defaultMessage="(map shows first {shown})"
                      values={{ shown: points.length }}
                    />
                  </span>
                )}
                {mapCapped && (
                  <span className="g-ms-2 g-text-amber-600">
                    <FormattedMessage
                      id="dashboard.sequencePhylogeny.namesSampled"
                      defaultMessage="· names from a sample"
                    />
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
        <ClientSideOnly>{body}</ClientSideOnly>
      </CardContent>
    </Card>
  );
}
