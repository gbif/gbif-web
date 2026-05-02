import { PaginationFooter } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/largeCard';
import { Switch } from '@/components/ui/switch';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { cn } from '@/utils/shadcn';
import { Fragment, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  PAGE_SIZE,
  RESULT_COLUMNS,
  SEQUENCE_PREVIEW_LENGTH,
  SequenceResult,
  SortDirection,
} from './types';
import { buildAlignment, sortResults } from './utils';
import { Classification } from '@/components/classification';

type ResultsPhaseProps = {
  results: SequenceResult[];
  marker: string;
  matchedCount: number;
  isProcessing: boolean;
  isComplete: boolean;
  matchError?: string;
  excludeUnmatched: boolean;
  offset: number;
  sortColumn?: string;
  sortDirection: SortDirection;
  onBack: () => void;
  onSetOffset: (offset: number) => void;
  onSetExcludeUnmatched: (value: boolean) => void;
  onSort: (column: string) => void;
  onGenerateCsv: () => void;
};

export function ResultsPhase({
  results,
  marker,
  matchedCount,
  isProcessing,
  isComplete,
  matchError,
  excludeUnmatched,
  offset,
  sortColumn,
  sortDirection,
  onBack,
  onSetOffset,
  onSetExcludeUnmatched,
  onSort,
  onGenerateCsv,
}: ResultsPhaseProps) {
  const [alignmentFor, setAlignmentFor] = useState<SequenceResult | undefined>();

  const filtered = useMemo(
    () =>
      excludeUnmatched
        ? results.filter(
            (r) => r.match && r.match.matchType && r.match.matchType !== 'BLAST_NO_MATCH'
          )
        : results,
    [results, excludeUnmatched]
  );
  const sorted = useMemo(
    () => sortResults(filtered, sortColumn, sortDirection),
    [filtered, sortColumn, sortDirection]
  );
  const visible = sorted.slice(offset, offset + PAGE_SIZE);

  const total = results.length;
  const progressPct = total > 0 ? Math.round((matchedCount / total) * 100) : 0;

  // Summary stats — only meaningful when complete.
  const summary = useMemo(() => {
    const withMatch = results.filter(
      (r) => r.match && r.match.matchType && r.match.matchType !== 'BLAST_NO_MATCH'
    ).length;
    const closeToOtu = results.filter((r) => (r.match?.identity ?? 0) >= 99).length;
    const inGbif = results.filter((r) => r.match?.taxonMatch?.usage?.key).length;
    return { withMatch, closeToOtu, inGbif };
  }, [results]);

  return (
    <PageContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-full g-pt-6 g-pb-8">
        <Button variant="ghost" size="sm" className="g-mb-4 g-text-slate-500" onClick={onBack}>
          ↺ <FormattedMessage id="tools.sequenceId.startOver" defaultMessage="Start over" />
        </Button>

        {isProcessing && (
          <Card className="g-bg-white g-mb-4 g-p-6">
            <p className="g-text-base g-text-gray-700 g-mb-3">
              <FormattedMessage
                id="tools.sequenceId.blastingProgress"
                defaultMessage="Blasting sequences — {done} of {total} processed ({pct}%)"
                values={{ done: matchedCount, total, pct: progressPct }}
              />
            </p>
            <div className="g-h-2 g-bg-slate-200 g-rounded-full g-overflow-hidden g-w-full">
              <div
                className="g-h-full g-bg-primary-500 g-transition-all g-duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </Card>
        )}

        {isComplete && (
          <Card className="g-bg-white g-mb-4">
            <div className="g-px-6 g-py-5 g-grid g-grid-cols-2 md:g-grid-cols-4 g-gap-4 g-text-center">
              <Stat
                value={total}
                label={
                  <FormattedMessage
                    id="tools.sequenceId.totalSequences"
                    defaultMessage="Total sequences"
                  />
                }
              />
              <Stat
                value={total > 0 ? `${Math.round((summary.withMatch / total) * 100)}%` : '0%'}
                label={
                  <FormattedMessage
                    id="tools.sequenceId.withBlastMatch"
                    defaultMessage="With BLAST match"
                  />
                }
              />
              <Stat
                value={total > 0 ? `${Math.round((summary.closeToOtu / total) * 100)}%` : '0%'}
                label={
                  <FormattedMessage
                    id="tools.sequenceId.identityHigh"
                    defaultMessage="Identity ≥ 99%"
                  />
                }
              />
              <Stat
                value={total > 0 ? `${Math.round((summary.inGbif / total) * 100)}%` : '0%'}
                label={
                  <FormattedMessage
                    id="tools.sequenceId.inGbifBackbone"
                    defaultMessage="In GBIF backbone"
                  />
                }
              />
            </div>
            <div className="g-px-6 g-py-5 g-border-t g-border-slate-100 g-bg-slate-50/60 g-grid g-grid-cols-1 md:g-grid-cols-2 g-gap-x-8 g-gap-y-6">
              <DatabaseDescription marker={marker} />
              <MatchTypeLegend />
            </div>
            {matchError && (
              <div className="g-mx-6 g-mb-5 g-bg-amber-50 g-text-amber-700 g-rounded g-px-4 g-py-2 g-text-sm">
                {matchError}
              </div>
            )}
          </Card>
        )}

        <Card className="g-bg-white">
          <div className="g-overflow-x-auto">
            <table className="g-w-full g-text-sm">
              <thead className="g-sticky g-top-0 g-bg-white g-shadow-sm g-z-10">
                <tr>
                  {RESULT_COLUMNS.map((col) => {
                    const isActive = sortColumn === col.key;
                    const sortable = col.key !== 'alignment';
                    return (
                      <th
                        key={col.key}
                        className="g-px-4 g-py-3 g-text-left g-font-medium g-text-slate-500 g-whitespace-nowrap"
                      >
                        {sortable ? (
                          <button
                            className="g-flex g-items-center g-gap-1 hover:g-text-slate-700 g-transition-colors"
                            onClick={() => onSort(col.key)}
                          >
                            <FormattedMessage id={col.id} defaultMessage={col.defaultMessage} />
                            {isActive && (
                              <span className="g-text-slate-400">
                                {sortDirection === 'asc' ? '▲' : '▼'}
                              </span>
                            )}
                          </button>
                        ) : (
                          <FormattedMessage id={col.id} defaultMessage={col.defaultMessage} />
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {visible.map((row, idx) => (
                  <ResultRow
                    key={offset + idx}
                    row={row}
                    onShowAlignment={() => setAlignmentFor(row)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="g-flex g-items-center g-justify-end g-flex-wrap g-gap-4 g-p-4 g-border-t g-border-gray-100">
            {sorted.length > PAGE_SIZE && (
              <div className="g-flex-1 g-min-w-0">
                <PaginationFooter
                  offset={offset}
                  limit={PAGE_SIZE}
                  count={sorted.length}
                  onChange={(newOffset) => {
                    onSetOffset(newOffset);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
            <div className="g-flex g-items-center g-gap-6">
              <label className="g-flex g-items-center g-gap-2 g-cursor-pointer g-text-sm g-text-gray-600">
                <FormattedMessage
                  id="tools.sequenceId.excludeUnmatched"
                  defaultMessage="Exclude unmatched"
                />
                <Switch
                  checked={excludeUnmatched}
                  onCheckedChange={(v) => {
                    onSetExcludeUnmatched(v);
                    onSetOffset(0);
                  }}
                />
              </label>
              <Button onClick={onGenerateCsv} disabled={isProcessing}>
                <FormattedMessage id="tools.sequenceId.generateCsv" defaultMessage="Generate CSV" />
              </Button>
            </div>
          </div>
        </Card>
      </ArticleTextContainer>

      <AlignmentDialog result={alignmentFor} onClose={() => setAlignmentFor(undefined)} />
    </PageContainer>
  );
}

function Stat({ value, label }: { value: number | string; label: React.ReactNode }) {
  return (
    <div>
      <div className="g-text-2xl g-font-bold g-text-slate-800">{value}</div>
      <div className="g-text-xs g-text-slate-500 g-mt-1">{label}</div>
    </div>
  );
}

function ResultRow({ row, onShowAlignment }: { row: SequenceResult; onShowAlignment: () => void }) {
  const [sequenceExpanded, setSequenceExpanded] = useState(false);
  const m = row.match;
  const usage = m?.taxonMatch?.usage;
  const classification = m?.taxonMatch?.classification ?? [];

  if (row.status === 'pending') {
    return (
      <tr className="g-border-t g-border-gray-100 g-text-gray-400">
        <td className="g-px-4 g-py-2 g-whitespace-nowrap g-font-mono g-text-xs">
          {row.occurrenceId}
        </td>
        <td colSpan={RESULT_COLUMNS.length - 1} className="g-px-4 g-py-2 g-italic">
          <FormattedMessage id="tools.sequenceId.pending" defaultMessage="Pending…" />
        </td>
      </tr>
    );
  }

  if (row.status === 'errored' || !m) {
    return (
      <tr className="g-border-t g-border-gray-100 g-text-red-500">
        <td className="g-px-4 g-py-2 g-whitespace-nowrap g-font-mono g-text-xs">
          {row.occurrenceId}
        </td>
        <td colSpan={RESULT_COLUMNS.length - 1} className="g-px-4 g-py-2">
          <FormattedMessage
            id="tools.sequenceId.failed"
            defaultMessage="Failed: {error}"
            values={{ error: row.error ?? 'Unknown error' }}
          />
        </td>
      </tr>
    );
  }

  const sequence = row.sequence ?? '';
  const truncated =
    !sequenceExpanded && sequence.length > SEQUENCE_PREVIEW_LENGTH
      ? sequence.slice(0, SEQUENCE_PREVIEW_LENGTH)
      : sequence;

  return (
    <tr className="g-border-t g-border-gray-100 hover:g-bg-gray-50 g-text-gray-900 g-align-top">
      {/* occurrenceId */}
      <td className="g-px-4 g-py-2 g-whitespace-nowrap g-font-mono g-text-xs">
        {row.occurrenceId}
      </td>
      {/* marker */}
      <td className="g-px-4 g-py-2 g-whitespace-nowrap g-text-slate-600">{row.marker}</td>
      {/* identity */}
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        {typeof m.identity === 'number' ? `${m.identity.toFixed(2)}%` : ''}
      </td>
      {/* bitScore */}
      <td className="g-px-4 g-py-2 g-whitespace-nowrap g-text-slate-600">{m.bitScore}</td>
      {/* expectValue */}
      <td className="g-px-4 g-py-2 g-whitespace-nowrap g-text-slate-600">
        {typeof m.expectValue === 'number' ? m.expectValue.toExponential(2) : ''}
      </td>
      {/* queryCoverage */}
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        {typeof m.qcovs === 'number' ? `${m.qcovs}%` : ''}
      </td>
      {/* queryLength */}
      <td className="g-px-4 g-py-2 g-whitespace-nowrap g-text-slate-600">{sequence.length}</td>
      {/* matchType */}
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        <MatchTypeBadge matchType={m.matchType} />
      </td>
      {/* scientificName */}
      <td className="g-px-4 g-py-2">
        {usage ? (
          <a
            href={`/species/${usage.key}`}
            target="_blank"
            rel="noreferrer"
            className="g-text-primary-600 hover:g-underline"
            dangerouslySetInnerHTML={{ __html: usage.formattedName ?? usage.name }}
          />
        ) : (
          <>
            <span>{m.name}</span>
            {m.taxonMatchError ? (
              <span className="g-block g-text-xs g-text-red-400 g-mt-0.5">
                <FormattedMessage
                  id="tools.sequenceId.taxonLookupFailed"
                  defaultMessage="(taxonomy lookup failed)"
                />
              </span>
            ) : m.matchType && m.matchType !== 'BLAST_NO_MATCH' ? (
              <span className="g-block g-text-xs g-text-slate-400 g-mt-0.5">
                <FormattedMessage
                  id="tools.sequenceId.notInGbif"
                  defaultMessage="(not in GBIF taxonomy)"
                />
              </span>
            ) : null}
          </>
        )}
      </td>
      {/* alignment */}
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        {m.querySequence && m.subjectSequence && (
          <Button variant="outline" size="sm" onClick={onShowAlignment}>
            <FormattedMessage id="tools.sequenceId.viewAlignment" defaultMessage="Alignment" />
          </Button>
        )}
      </td>
      {/* classification */}
      <td className="g-px-4 g-py-2 g-text-xs g-text-slate-600 g-min-w-[450px]">
        {classification.length > 0 ? (
          <Classification>
            {classification.map((c) => (
              <span key={c.key}>
                <a
                  href={`/species/${c.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:g-underline g-text-slate-600"
                >
                  {c.name}
                </a>
              </span>
            ))}
          </Classification>
        ) : null}
      </td>
      {/* sequence */}
      <td className="g-px-4 g-py-2 g-text-xs g-font-mono g-text-slate-600 g-break-all g-min-w-[300px] g-max-w-md">
        {truncated}
        {sequence.length > SEQUENCE_PREVIEW_LENGTH && (
          <button
            className="g-ml-1 g-text-primary-600 hover:g-underline g-font-sans g-whitespace-nowrap"
            onClick={() => setSequenceExpanded((v) => !v)}
          >
            {sequenceExpanded ? (
              <FormattedMessage id="tools.sequenceId.showLess" defaultMessage="show less" />
            ) : (
              <FormattedMessage id="tools.sequenceId.showMore" defaultMessage="… show more" />
            )}
          </button>
        )}
      </td>
    </tr>
  );
}

const MATCH_TYPE_LABELS: Record<string, { id: string; defaultMessage: string }> = {
  BLAST_EXACT_MATCH: { id: 'tools.sequenceId.matchType.exact', defaultMessage: 'Exact match' },
  BLAST_AMBIGUOUS_MATCH: {
    id: 'tools.sequenceId.matchType.ambiguous',
    defaultMessage: 'Ambiguous match',
  },
  BLAST_CLOSE_MATCH: { id: 'tools.sequenceId.matchType.close', defaultMessage: 'Close match' },
  BLAST_WEAK_MATCH: { id: 'tools.sequenceId.matchType.weak', defaultMessage: 'Weak match' },
  BLAST_NO_MATCH: { id: 'tools.sequenceId.matchType.none', defaultMessage: 'No match' },
};

function MatchTypeBadge({ matchType }: { matchType?: string }) {
  if (!matchType) return null;
  const tone =
    matchType === 'BLAST_EXACT_MATCH'
      ? 'g-bg-green-600 g-text-white'
      : matchType === 'BLAST_AMBIGUOUS_MATCH' || matchType === 'BLAST_CLOSE_MATCH'
        ? 'g-bg-amber-100 g-text-amber-700'
        : 'g-bg-red-500 g-text-white';
  const label = MATCH_TYPE_LABELS[matchType];
  return (
    <span
      className={cn(
        'g-inline-block g-px-2 g-py-0.5 g-rounded g-text-xs g-font-bold g-tracking-wide g-whitespace-nowrap',
        tone
      )}
    >
      {label ? (
        <FormattedMessage id={label.id} defaultMessage={label.defaultMessage} />
      ) : (
        matchType.replace('BLAST_', '').replace('_', ' ').toLowerCase()
      )}
    </span>
  );
}

function AlignmentDialog({ result, onClose }: { result?: SequenceResult; onClose: () => void }) {
  const m = result?.match;
  const alignment = m ? buildAlignment(m) : '';
  const usage = m?.taxonMatch?.usage;
  const scientificName = usage?.formattedName ?? usage?.name ?? m?.name;
  return (
    <Dialog open={!!result} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="g-max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage
              id="tools.sequenceId.alignmentFor"
              defaultMessage="Alignment for {id}"
              values={{ id: result?.occurrenceId }}
            />
          </DialogTitle>
          {m && (
            <div className="g-mt-2 g-space-y-1 g-text-sm g-text-slate-600">
              {scientificName && (
                <div>
                  <span className="g-text-slate-500 g-mr-1">
                    <FormattedMessage
                      id="tools.sequenceId.colScientificName"
                      defaultMessage="scientificName"
                    />
                    :
                  </span>
                  <span
                    className="g-text-slate-800"
                    dangerouslySetInnerHTML={{ __html: scientificName }}
                  />
                </div>
              )}
              <div className="g-flex g-flex-wrap g-gap-x-4 g-gap-y-1">
                {typeof m.identity === 'number' && (
                  <span>
                    <span className="g-text-slate-500 g-mr-1">
                      <FormattedMessage
                        id="tools.sequenceId.colIdentity"
                        defaultMessage="identity"
                      />
                      :
                    </span>
                    <span className="g-text-slate-800">{m.identity.toFixed(2)}%</span>
                  </span>
                )}
                {typeof m.bitScore === 'number' && (
                  <span>
                    <span className="g-text-slate-500 g-mr-1">
                      <FormattedMessage
                        id="tools.sequenceId.colBitScore"
                        defaultMessage="bitScore"
                      />
                      :
                    </span>
                    <span className="g-text-slate-800">{m.bitScore}</span>
                  </span>
                )}
                {typeof m.expectValue === 'number' && (
                  <span>
                    <span className="g-text-slate-500 g-mr-1">
                      <FormattedMessage
                        id="tools.sequenceId.colExpectValue"
                        defaultMessage="expectValue"
                      />
                      :
                    </span>
                    <span className="g-text-slate-800">{m.expectValue.toExponential(2)}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogHeader>
        <pre className="g-text-xs g-font-mono g-whitespace-pre g-overflow-x-auto g-bg-slate-50 g-p-4 g-rounded">
          {alignment}
        </pre>
      </DialogContent>
    </Dialog>
  );
}

function makeLink(href: string) {
  return (chunks: React.ReactNode) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="g-text-primary-600 hover:g-underline"
    >
      {chunks}
    </a>
  );
}

function DatabaseDescription({ marker }: { marker: string }) {
  const description = (() => {
    switch (marker) {
      case 'ITS':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.ITS"
            defaultMessage="Your data have been matched against a blast database of the <link>UNITE general FASTA release for eukaryotes v9.0</link>. All returned matches have then been matched against the GBIF backbone taxonomy by their identifier (e.g. SH1571756.08FU). These OTU identifiers can be used for publishing sequence based data to GBIF. The result can be downloaded as a csv with identifiers included."
            values={{ link: makeLink('https://unite.ut.ee/repository.php') }}
          />
        );
      case 'COI':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.COI"
            defaultMessage="Your data have been matched against a 99% clustered version of the <link>BOLD Public Database v2025-10-17</link> public data (COI-5P sequences) All returned matches have then been matched against the GBIF backbone taxonomy by their identifier (e.g. BOLD:ADJ8357). These OTU identifiers can be used for publishing sequence based data to GBIF. The result can be downloaded as a csv with identifiers included."
            values={{ link: makeLink('https://doi.org/10.15468/inygc6') }}
          />
        );
      case '16S':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.16S"
            defaultMessage="Your data have been matched against the <link>Genome Taxonomy Database r214</link> 16S rRNA gene sequences identified within the set of representative genomes"
            values={{ link: makeLink('https://gtdb.ecogenomic.org/downloads') }}
          />
        );
      case '12S':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.12S"
            defaultMessage="Your data have been matched against the <link>MitoFish</link> v41 database of 12S sequences"
            values={{ link: makeLink('http://mitofish.aori.u-tokyo.ac.jp/') }}
          />
        );
      case '18S':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.18S"
            defaultMessage="Your data have been matched against the <link>PR2</link> v5.0.0 database of 18S sequences"
            values={{ link: makeLink('https://pr2-database.org/') }}
          />
        );
      case 'RBCL':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.RBCL"
            defaultMessage="Your data have been matched against the <link>Diat.barcode database</link> v15.2 database of rbcl sequences"
            values={{
              link: makeLink(
                'https://carrtel-collection.hub.inrae.fr/barcoding-databases/diat.barcode'
              ),
            }}
          />
        );
      case '12s_mt12s_eukaryotes_midori2':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.12s_mt12s_eukaryotes_midori2"
            defaultMessage="Your data have been matched against the <link>Midori2 database version GB268</link> of 12S sequences"
            values={{ link: makeLink('https://www.reference-midori.info/index.html') }}
          />
        );
      case '16s_mt16s_eukaryotes_midori2':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.16s_mt16s_eukaryotes_midori2"
            defaultMessage="Your data have been matched against the <link>Midori2 database version GB268</link> of 16S sequences"
            values={{ link: makeLink('https://www.reference-midori.info/index.html') }}
          />
        );
      case 'cytb_eukaryotes_midori2':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.cytb_eukaryotes_midori2"
            defaultMessage="Your data have been matched against the <link>Midori2 database version GB268</link> of cytb sequences"
            values={{ link: makeLink('https://www.reference-midori.info/index.html') }}
          />
        );
      case '12s_nbdl':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.12s_nbdl"
            defaultMessage="Your data have been matched against the <link>National Biodiversity Data Library, Australia</link>, 12S sequences"
            values={{ link: makeLink('https://nbdl.csiro.au/') }}
          />
        );
      case '16s_nbdl':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.16s_nbdl"
            defaultMessage="Your data have been matched against the <link>National Biodiversity Data Library, Australia</link>, 16S sequences"
            values={{ link: makeLink('https://nbdl.csiro.au/') }}
          />
        );
      case 'coi_nbdl':
        return (
          <FormattedMessage
            id="tools.sequenceId.description.coi_nbdl"
            defaultMessage="Your data have been matched against the <link>National Biodiversity Data Library, Australia</link>, COI sequences"
            values={{ link: makeLink('https://nbdl.csiro.au/') }}
          />
        );
      default:
        return null;
    }
  })();
  if (!description) return null;
  return <p className="g-text-sm g-text-slate-700 g-leading-relaxed">{description}</p>;
}

const MATCH_TYPE_LEGEND: { type: string; id: string; defaultMessage: string }[] = [
  {
    type: 'BLAST_EXACT_MATCH',
    id: 'tools.sequenceId.matchType.exactDescription',
    defaultMessage:
      'identity >= 99% and queryCoverage >= 80%. This is within the threshold of the OTU.',
  },
  {
    type: 'BLAST_AMBIGUOUS_MATCH',
    id: 'tools.sequenceId.matchType.ambiguousDescription',
    defaultMessage:
      'identity >= 99% and queryCoverage >= 80%, but there is at least one more match with similar identity',
  },
  {
    type: 'BLAST_CLOSE_MATCH',
    id: 'tools.sequenceId.matchType.closeDescription',
    defaultMessage:
      'identity < 99% but > 90% and queryCoverage >= 80%. It is something close to the OTU, maybe the same Genus.',
  },
  {
    type: 'BLAST_WEAK_MATCH',
    id: 'tools.sequenceId.matchType.weakDescription',
    defaultMessage:
      'there is a match, but with identity < 90% or/and queryCoverage < 80%. Depending on the quality of the sequence, bit score, identity and expect value, a higher taxon could be inferred from this.',
  },
  {
    type: 'BLAST_NO_MATCH',
    id: 'tools.sequenceId.matchType.noneDescription',
    defaultMessage: 'No match.',
  },
];

function MatchTypeLegend() {
  return (
    <div>
      <h4 className="g-text-sm g-font-semibold g-text-slate-700 g-mb-2">
        <FormattedMessage id="tools.sequenceId.matchTypes" defaultMessage="Match types" />
      </h4>
      <dl className="g-grid g-grid-cols-[auto_1fr] g-gap-x-3 g-gap-y-2 g-text-xs g-text-slate-600 g-items-start">
        {MATCH_TYPE_LEGEND.map((item) => (
          <Fragment key={item.type}>
            <dt className="g-pt-0.5">
              <MatchTypeBadge matchType={item.type} />
            </dt>
            <dd className="g-leading-relaxed">
              <FormattedMessage id={item.id} defaultMessage={item.defaultMessage} />
            </dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}
