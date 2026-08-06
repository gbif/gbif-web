import { ClientSideOnly } from '@/components/clientSideOnly';
import { Card, CardContent, CardTitle } from '@/components/ui/smallCard';
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { LuLoader as Loader } from 'react-icons/lu';
import { ColoredPointMap, MapPoint } from './ColoredPointMap';
import { PhyloTreeView } from './PhyloTreeView';
import {
  assignClades,
  buildTreeFromDistance,
  computeAlignment,
  type DistanceResult,
} from './compute';
import { useSequenceTreeData } from './useSequenceTreeData';

const PANEL_HEIGHT = 520;
const MAX_CLADES = 12;
// Collapse-threshold slider bounds (percent identity). 100 = collapse only identical sequences.
const COLLAPSE_MIN_PCT = 97;
const DEFAULT_COLLAPSE_PCT = 99.5;
const EMPTY_GROUPS: Record<string, string[]> = {};

const clampClades = (k: number, nTips: number) => Math.max(1, Math.min(k, Math.max(1, nTips)));
// Sensible default number of clades for a set of `n` tips.
const defaultCladeCount = (n: number) => Math.max(2, Math.min(8, Math.round(Math.sqrt(n || 1))));

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
 * the occurrences carrying those sequences. Tips are nucleotideSequenceIDs. The tree is split into
 * clades; each clade gets a colour family (gradient within it), shared by the map dots, and tree
 * tips and dots are linked on hover/selection.
 */
export function SequencePhylogeny({ predicate }: { predicate?: unknown }) {
  const { seqById, pointsById, matchedIds, loading, error, total, capped, mapCapped, maxSequences } =
    useSequenceTreeData(predicate);

  const seqKey = useMemo(() => Object.keys(seqById).sort().join(','), [seqById]);
  const sequenceCount = seqKey ? seqKey.split(',').length : 0;

  const [fullDist, setFullDist] = useState<DistanceResult | null>(null);
  const [aligning, setAligning] = useState(false);
  const [computeError, setComputeError] = useState<unknown>(null);
  // Collapse sequences that are >= this % identical into a single representative tip.
  const [collapsePct, setCollapsePct] = useState(DEFAULT_COLLAPSE_PCT);
  const threshold = Math.max(0, (100 - collapsePct) / 100);

  // Expensive step (kalign MSA + distance matrix) — runs once per resolved sequence set.
  useEffect(() => {
    const ids = seqKey ? seqKey.split(',') : [];
    if (ids.length < 2) {
      setFullDist(null);
      setAligning(false);
      return;
    }
    let cancelled = false;
    setAligning(true);
    setComputeError(null);
    setFullDist(null);
    computeAlignment(seqById)
      .then((res) => {
        if (!cancelled) setFullDist(res.fullDist);
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
  }, [seqKey]);

  // Cheap step: collapse at the current threshold + build the tree. Recomputes instantly when the
  // collapse slider moves — no re-alignment.
  const built = useMemo(
    () => (fullDist ? buildTreeFromDistance(fullDist, threshold) : null),
    [fullDist, threshold]
  );
  const newick = built?.newick ?? null;
  const tree = built?.tree ?? null;
  const groups = built?.groups ?? EMPTY_GROUPS;

  // Representatives (distinct sequences = tree tips) and the collapse mapping.
  const repCount = useMemo(() => Object.keys(groups).length, [groups]);
  const repOfId = useMemo(() => {
    const out: Record<string, string> = {};
    for (const [rep, members] of Object.entries(groups)) for (const m of members) out[m] = rep;
    return out;
  }, [groups]);
  const intl = useIntl();
  const labelById = useMemo(() => {
    const out: Record<string, string> = {};
    // Tip labels show a short id (first 5 chars) — the full id is kept on the tip's data-tip
    // attribute for colouring/linking.
    const short = (id: string) => `${id.slice(0, 5)}…`;
    for (const [rep, members] of Object.entries(groups)) {
      out[rep] =
        members.length > 1
          ? `${short(rep)}  ${intl.formatMessage(
              {
                id: 'dashboard.sequencePhylogeny.variants',
                defaultMessage: '(+{n, plural, one {# similar variant} other {# similar variants}})',
              },
              { n: members.length - 1 }
            )}`
          : short(rep);
    }
    return out;
  }, [groups, intl]);

  // Number of clades: adaptive default based on distinct sequences, reset when they change.
  const [clades, setClades] = useState(2);
  useEffect(() => {
    setClades(defaultCladeCount(repCount));
  }, [repCount]);

  const { colourById, cladeCount } = useMemo(() => {
    if (!tree) return { colourById: {} as Record<string, string>, cladeCount: 0 };
    const { colourById, cladeCount } = assignClades(tree, clampClades(clades, repCount));
    return { colourById, cladeCount };
  }, [tree, clades, repCount]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Map dots are keyed by the representative id (so a group's occurrences share colour + linking).
  // Colour is applied by the map from `colourById` (not baked into the point), so recolouring
  // doesn't rebuild the feature set.
  const points: MapPoint[] = useMemo(() => {
    const out: MapPoint[] = [];
    const seen = new Set<string>();
    for (const [id, pts] of Object.entries(pointsById)) {
      const rep = repOfId[id] ?? id;
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
      <div className="g-flex g-flex-col lg:g-flex-row g-gap-3">
        <div className="g-flex-1 g-min-w-0 g-border g-rounded g-border-slate-200">
          <PhyloTreeView
            newick={newick!}
            colourById={colourById}
            labelById={labelById}
            hoveredId={hoveredId}
            selectedIds={selectedIds}
            onHoverTip={setHoveredId}
            onSelectTip={toggleSelect}
            height={PANEL_HEIGHT}
          />
        </div>
        <div className="g-flex-1 g-min-w-0 g-border g-rounded g-border-slate-200 g-overflow-hidden">
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
            {showTree && repCount >= 3 && (
              <div className="g-flex g-items-center g-gap-1 g-text-xs g-text-slate-500">
                <button
                  type="button"
                  aria-label="Fewer subtrees"
                  className="g-w-5 g-h-5 g-rounded g-border g-border-slate-300 disabled:g-opacity-40"
                  disabled={clampClades(clades, repCount) <= 1}
                  onClick={() => setClades((c) => clampClades(c - 1, repCount))}
                >
                  −
                </button>
                <span className="g-min-w-[5.5rem] g-text-center">
                  <FormattedMessage
                    id="dashboard.sequencePhylogeny.subtrees"
                    defaultMessage="{n} subtrees"
                    values={{ n: cladeCount }}
                  />
                </span>
                <button
                  type="button"
                  aria-label="More subtrees"
                  className="g-w-5 g-h-5 g-rounded g-border g-border-slate-300 disabled:g-opacity-40"
                  disabled={clampClades(clades, repCount) >= Math.min(MAX_CLADES, repCount)}
                  onClick={() => setClades((c) => clampClades(c + 1, repCount))}
                >
                  +
                </button>
              </div>
            )}
            {matchedIds.length > 0 && !capped && sequenceCount > 0 && (
              <span className="g-flex-none g-text-xs g-text-slate-500">
                <FormattedMessage
                  id="dashboard.sequencePhylogeny.count"
                  defaultMessage="{n} sequences · {o} occurrences"
                  values={{ n: sequenceCount, o: total }}
                />
                {repCount > 0 && repCount < sequenceCount && (
                  <FormattedMessage
                    id="dashboard.sequencePhylogeny.distinct"
                    defaultMessage=" · {d} distinct"
                    values={{ d: repCount }}
                  />
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
              </span>
            )}
          </div>
        </div>
        <ClientSideOnly>{body}</ClientSideOnly>
      </CardContent>
    </Card>
  );
}
