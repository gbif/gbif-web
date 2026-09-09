import Properties, { Term as T, Value as V } from '@/components/properties';
import { Card } from '@/components/ui/largeCard';
import { OccurrenceQuery } from '@/gql/graphql';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Group } from './groups';
import { Img } from '@/components/Img';
import { cn } from '@/utils/shadcn';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/reactRouterPlugins';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { MdSearch } from 'react-icons/md';
import { LuLoader as Loader } from 'react-icons/lu';
import useQuery from '@/hooks/useQuery';
import { SEQUENCE_BIN_DEFS } from '@/utils/sequenceSearch';
import { IssueTag, IssueTags } from '../properties';
import { prettifyEnum, TargetGeneLabel } from '@/components/filters/displayNames';

export function Preparation({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'preparation';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.preparation.name"
      id="preparation"
      updateToc={updateToc}
    />
  );
}

export function ResourceRelationship({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'resourceRelationship';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.resourceRelationship.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function Amplification({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'amplification';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.amplification.name"
      id="amplification"
      updateToc={updateToc}
    />
  );
}

export function Permit({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'permit';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.permit.name"
      id="permit"
      updateToc={updateToc}
    />
  );
}

export function Loan({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'loan';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.loan.name"
      id="loan"
      updateToc={updateToc}
    />
  );
}

export function Preservation({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'preservation';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.preservation.name"
      id="preservation"
      updateToc={updateToc}
    />
  );
}

export function MaterialSampleExt({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'materialSample';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.materialSample.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function Audubon({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'audubon';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.audubon.name"
      id="audubon"
      updateToc={updateToc}
    />
  );
}

// Batch-validate raw sequences to obtain their sanitised form (used only when an occurrence carries
// several sequences, where extension-row order can't be trusted). Typed locally so it compiles
// before codegen has generated types for the new field.
const SEQUENCE_VALIDATION_QUERY = /* GraphQL */ `
  query DnaSequenceValidation($sequences: [String!]!) {
    sequenceValidation(sequences: $sequences) {
      rawSequence
      sequence
      nucleotideSequenceID
      invalid
      endsTrimmed
      gapsOrWhitespaceRemoved
      naturalLanguageDetected
      nFraction
      nonACGTNFraction
    }
  }
`;
type SequenceValidation = {
  rawSequence?: string | null;
  sequence?: string | null;
  nucleotideSequenceID?: string | null;
  invalid?: boolean | null;
  endsTrimmed?: boolean | null;
  gapsOrWhitespaceRemoved?: boolean | null;
  naturalLanguageDetected?: boolean | null;
  nFraction?: number | null;
  nonACGTNFraction?: number | null;
};
type SequenceValidationResult = {
  sequenceValidation?: Array<SequenceValidation | null> | null;
};

// Map a single sequence's validation flags to the NUCLEOTIDE_SEQUENCE_* issue enums. Boolean flags
// map one-to-one; the two fraction-based issues (HIGH_N_FRACTION / HIGH_AMBIGUITY) are threshold
// derived upstream, so we don't reproduce the thresholds here — instead we only surface them when
// the occurrence itself reports the issue, attributing it to the sequence with the largest metric
// (handled by the caller). This helper returns just the boolean-derived issues.
function booleanIssuesFromValidation(v: SequenceValidation | null | undefined): string[] {
  if (!v) return [];
  const issues: string[] = [];
  if (v.invalid) issues.push('NUCLEOTIDE_SEQUENCE_INVALID');
  if (v.endsTrimmed) issues.push('NUCLEOTIDE_SEQUENCE_ENDS_TRIMMED');
  if (v.gapsOrWhitespaceRemoved) issues.push('NUCLEOTIDE_SEQUENCE_GAPS_REMOVED');
  if (v.naturalLanguageDetected) issues.push('NUCLEOTIDE_SEQUENCE_NATURAL_LANGUAGE');
  return issues;
}

export function DNADerivedData({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'dnaDerivedData';
  // Surface the sequence-quality flags for this record next to the block header. These issues
  // relate to the DNA derived data, so they belong with this block rather than a generic field.
  const dnaIssues =
    occurrence?.issues?.filter(
      (issue) => issue.startsWith('NUCLEOTIDE_SEQUENCE_') || issue === 'TARGET_GENE_INVALID'
    ) ?? [];
  // Colour each issue tag by its real interpretationRemark severity rather than a fixed level.
  // These flags relate to DNA-derived-data extension fields, not core terms, so the per-term
  // { id, severity } path does not cover them; use the occurrence-level issuesWithSeverity list
  // instead. Issues with no known severity fall back to the neutral tag colour.
  const severityByIssue: Record<string, string> = {};
  occurrence?.issuesWithSeverity?.forEach((issue) => {
    if (issue?.id && issue?.severity) severityByIssue[issue.id] = issue.severity;
  });
  // Order by severity (ERROR → WARNING → INFO → unknown), but always pin
  // NUCLEOTIDE_SEQUENCE_INVALID first when present.
  const severityRank: Record<string, number> = { ERROR: 0, WARNING: 1, INFO: 2 };
  const rankOf = (issue: string) =>
    issue === 'NUCLEOTIDE_SEQUENCE_INVALID' ? -1 : severityRank[severityByIssue[issue]] ?? 3;
  const nucleotideIssues = [...dnaIssues].sort((a, b) => rankOf(a) - rankOf(b));

  // Raw (verbatim) sequences from the extension rows, and the sanitised counterparts we can pair
  // to them. For a single sequence the interpreted nucleotideSequences[0] pairs positionally
  // (safe at count 1). With several, the extension-row order and the nucleotideSequences order are
  // not guaranteed to match, so we validate the raw sequences (batched via GraphQL) — the
  // validation service returns each sequence's sanitised form directly, in input order.
  const rawSequences: string[] = ((occurrence?.extensions as any)?.[extensionName] ?? [])
    .map((row: any) => row?.dna_sequence)
    .filter((s: unknown): s is string => typeof s === 'string' && s.length > 0);
  const multiple = rawSequences.length >= 2;
  const rawKey = rawSequences.join('|');

  const validation = useQuery<SequenceValidationResult, unknown>(SEQUENCE_VALIDATION_QUERY, {
    lazyLoad: true,
  });
  useEffect(() => {
    if (multiple) validation.load({ variables: { sequences: rawSequences } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawKey, multiple]);

  const sanitizedByRaw = useMemo(() => {
    const out: Record<string, string> = {};
    if (multiple) {
      const results = validation.data?.sequenceValidation ?? [];
      // Results preserve input order; a sanitised value of '' means the raw isn't usable.
      rawSequences.forEach((raw, i) => {
        const san = results[i]?.sequence;
        if (raw && san) out[raw] = san;
      });
    } else {
      const raw = rawSequences[0];
      const san = occurrence?.nucleotideSequences?.[0]?.sequence;
      if (raw && san) out[raw] = san;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiple, rawKey, validation.data, occurrence?.nucleotideSequences]);
  const sanitizing = multiple && validation.loading;

  // Interpreted target gene per raw sequence, so the extension's verbatim target_gene field can show
  // the inferred concept alongside it. Single sequence pairs positionally (safe at count 1); with
  // several we pair each raw to its interpreted record by nucleotideSequenceID (from validation).
  // Invalid sequences have no id (and no interpreted pairing), so they simply show the verbatim value.
  const interpretedTargetGeneByRaw = useMemo(() => {
    const out: Record<string, string> = {};
    const sequences = occurrence?.nucleotideSequences ?? [];
    if (multiple) {
      const conceptById: Record<string, string> = {};
      sequences.forEach((ns) => {
        const concept = ns?.targetGene?.concept;
        if (ns?.nucleotideSequenceID && concept) conceptById[ns.nucleotideSequenceID] = concept;
      });
      const results = validation.data?.sequenceValidation ?? [];
      rawSequences.forEach((raw, i) => {
        const id = results[i]?.nucleotideSequenceID;
        const concept = id ? conceptById[id] : undefined;
        if (raw && concept) out[raw] = concept;
      });
    } else {
      const raw = rawSequences[0];
      const concept = sequences[0]?.targetGene?.concept;
      if (raw && concept) out[raw] = concept;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiple, rawKey, validation.data, occurrence?.nucleotideSequences]);

  // Verbatim target gene per raw sequence, read straight from the extension rows (MIxS term 0000044,
  // or the rs.gbif.org 'target_gene' term). Used to attribute TARGET_GENE_INVALID: that issue has no
  // per-sequence validation flag, but it applies to a sequence whose verbatim gene failed to
  // interpret to a concept — i.e. a row with a verbatim value but no interpreted counterpart.
  const verbatimTargetGeneByRaw = useMemo(() => {
    const out: Record<string, string> = {};
    const rows = (occurrence?.extensions as any)?.[extensionName] ?? [];
    rows.forEach((row: any) => {
      const raw = row?.dna_sequence;
      const gene = row?.['0000044'] ?? row?.target_gene;
      if (typeof raw === 'string' && raw && typeof gene === 'string' && gene.trim()) out[raw] = gene;
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawKey, occurrence?.extensions]);

  // Raw sequence(s) the occurrence-level TARGET_GENE_INVALID applies to: a verbatim gene present but
  // no interpreted concept. Works for a single sequence (no validation service needed). If none can
  // be pinpointed, the issue falls back to the block header.
  const dnaIssueSet = new Set<string>(dnaIssues);
  const targetGeneInvalidRaws = useMemo(() => {
    const set = new Set<string>();
    if (!dnaIssueSet.has('TARGET_GENE_INVALID')) return set;
    rawSequences.forEach((raw) => {
      if (verbatimTargetGeneByRaw[raw] && !interpretedTargetGeneByRaw[raw]) set.add(raw);
    });
    return set;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawKey, verbatimTargetGeneByRaw, interpretedTargetGeneByRaw]);

  // With several sequences we can attribute each NUCLEOTIDE_SEQUENCE_* issue to the specific
  // sequence it applies to (from that sequence's validation flags) rather than lumping them all in
  // the block header. For a single sequence there's nothing to disambiguate, so we keep the header.
  const perSequenceActive = multiple && !!validation.data?.sequenceValidation;
  const issuesByRaw = useMemo(() => {
    const out: Record<string, string[]> = {};
    if (!perSequenceActive) return out;
    const results = validation.data?.sequenceValidation ?? [];
    rawSequences.forEach((raw) => {
      out[raw] = [];
    });
    const add = (raw: string, issue: string) => {
      if (dnaIssueSet.has(issue) && out[raw] && !out[raw].includes(issue)) out[raw].push(issue);
    };
    // Boolean flags map one-to-one to an issue on that sequence.
    rawSequences.forEach((raw, i) => {
      booleanIssuesFromValidation(results[i]).forEach((issue) => add(raw, issue));
    });
    // Fraction-based issues are threshold-derived upstream; surface them only when the occurrence
    // reports the issue and attribute to the sequence(s) with the largest metric value.
    const attributeMax = (issue: string, metric: (v: SequenceValidation | null | undefined) => number) => {
      if (!dnaIssueSet.has(issue)) return;
      const max = rawSequences.reduce((m, _, i) => Math.max(m, metric(results[i])), 0);
      if (max <= 0) return;
      rawSequences.forEach((raw, i) => {
        if (metric(results[i]) >= max) add(raw, issue);
      });
    };
    attributeMax('NUCLEOTIDE_SEQUENCE_HIGH_N_FRACTION', (v) => v?.nFraction ?? 0);
    attributeMax('NUCLEOTIDE_SEQUENCE_HIGH_AMBIGUITY', (v) => v?.nonACGTNFraction ?? 0);
    // Sort each sequence's issues the same way the header does.
    Object.keys(out).forEach((raw) => out[raw].sort((a, b) => rankOf(a) - rankOf(b)));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perSequenceActive, rawKey, validation.data]);

  // The header shows only issues we couldn't attribute to a specific sequence. The
  // NUCLEOTIDE_SEQUENCE_* issues placed next to a sequence, and TARGET_GENE_INVALID placed next to a
  // verbatim target-gene value, are removed from the header.
  const attributedIssues = new Set<string>();
  Object.values(issuesByRaw).forEach((list) => list.forEach((issue) => attributedIssues.add(issue)));
  if (targetGeneInvalidRaws.size > 0) attributedIssues.add('TARGET_GENE_INVALID');
  const headerIssues = nucleotideIssues.filter((issue) => !attributedIssues.has(issue));

  return (
    <GenericExtension
      {...{
        occurrence,
        extensionName,
        overwrites: {
          dna_sequence: ({ item }) => (
            <DNASequence
              sequence={item['dna_sequence']}
              sanitized={sanitizedByRaw[item['dna_sequence']]}
              sanitizing={sanitizing}
              issues={issuesByRaw[item['dna_sequence']]}
              severityByIssue={severityByIssue}
            />
          ),
          // Verbatim target gene lives under the MIxS term key 0000044 (some records may use the
          // rs.gbif.org 'target_gene' term instead); pair the row to its interpreted concept by
          // its raw sequence, and surface TARGET_GENE_INVALID here when this row's gene is the one
          // that failed to interpret.
          '0000044': ({ item }) => (
            <TargetGeneField
              raw={item['0000044']}
              interpreted={interpretedTargetGeneByRaw[item['dna_sequence']]}
              invalid={targetGeneInvalidRaws.has(item['dna_sequence'])}
              invalidSeverity={severityByIssue['TARGET_GENE_INVALID']}
            />
          ),
          target_gene: ({ item }) => (
            <TargetGeneField
              raw={item['target_gene']}
              interpreted={interpretedTargetGeneByRaw[item['dna_sequence']]}
              invalid={targetGeneInvalidRaws.has(item['dna_sequence'])}
              invalidSeverity={severityByIssue['TARGET_GENE_INVALID']}
            />
          ),
        },
      }}
      titleExtra={
        headerIssues.length > 0 ? (
          <IssueTags>
            {headerIssues.map((issue) => (
              <IssueTag type={severityByIssue[issue] ?? 'LIGHT'} key={issue}>
                <FormattedMessage
                  id={`enums.occurrenceIssue.${issue}`}
                  defaultMessage={prettifyEnum(issue) ?? ''}
                />
              </IssueTag>
            ))}
          </IssueTags>
        ) : undefined
      }
      label="occurrenceDetails.extensions.dnaDerivedData.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

function DNASequence({
  sequence,
  sanitized,
  sanitizing,
  issues,
  severityByIssue,
}: {
  sequence: string;
  // The sanitised counterpart of the verbatim `sequence`, when it could be paired.
  sanitized?: string | null;
  // The sanitised form is still being fetched (multi-sequence records validate asynchronously).
  sanitizing?: boolean;
  // NUCLEOTIDE_SEQUENCE_* issues attributed to this specific sequence (multi-sequence records only).
  issues?: string[];
  // Issue → interpretationRemark severity, for tag colouring.
  severityByIssue?: Record<string, string>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<'original' | 'sanitized'>('original');
  const hasSanitized = typeof sanitized === 'string' && sanitized.length > 0;
  // Only offer the toggle when the sanitised form actually differs from the original.
  const differs = hasSanitized && sanitized !== sequence;
  const showTabs = differs || sanitizing;
  const shown = view === 'sanitized' && differs ? sanitized : sequence;
  const seqIssues = issues ?? [];

  return (
    <div>
      {(showTabs || seqIssues.length > 0) && (
        <div className="g-mb-2 g-flex g-items-center g-flex-wrap g-gap-2">
          {showTabs && (
            <div className="g-inline-flex g-rounded g-border g-border-slate-200 g-text-xs g-overflow-hidden">
              {(['original', 'sanitized'] as const).map((tab) => {
                const disabled = tab === 'sanitized' && !differs;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setView(tab)}
                    disabled={disabled}
                    aria-pressed={view === tab}
                    className={cn(
                      'g-px-2 g-py-1 g-flex g-items-center g-gap-1',
                      view === tab ? 'g-bg-slate-100 g-font-medium' : 'hover:g-bg-slate-50',
                      disabled && 'g-opacity-50 g-cursor-not-allowed'
                    )}
                  >
                    <FormattedMessage
                      id={`occurrenceDetails.dnaSequence.${tab}`}
                      defaultMessage={tab === 'original' ? 'Original' : 'Sanitised'}
                    />
                    {tab === 'sanitized' && sanitizing && !differs && (
                      <Loader className="g-animate-spin g-w-3 g-h-3 g-text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {seqIssues.length > 0 && (
            <IssueTags>
              {seqIssues.map((issue) => (
                <IssueTag type={severityByIssue?.[issue] ?? 'LIGHT'} key={issue}>
                  <FormattedMessage
                    id={`enums.occurrenceIssue.${issue}`}
                    defaultMessage={prettifyEnum(issue) ?? ''}
                  />
                </IssueTag>
              ))}
            </IssueTags>
          )}
        </div>
      )}
      <div>
        <code className={cn('g-text-sm', { 'g-line-clamp-2': !expanded })}>{shown}</code>
      </div>
      <div className="g-mt-2 g-flex g-items-center g-gap-2">
        <Button variant="outline" size="sm" onClick={() => setExpanded((v) => !v)}>
          <FormattedMessage
            id={expanded ? 'occurrenceDetails.showLess' : 'occurrenceDetails.showMore'}
          />
        </Button>
        <SimpleTooltip
          title={
            <FormattedMessage
              id="occurrenceDetails.searchSimilarSequences"
              defaultMessage="Search for occurrences with similar sequences"
            />
          }
          asChild
        >
          <Button asChild variant="outline" size="sm">
            <DynamicLink
              pageId="occurrenceSearch"
              searchParams={{
                'nucleotideSequence.sequence': sequence,
                // Pre-select the three highest-identity bins (=100, 99.5–100, 99–99.5)
                // so the search filters to closely-matching sequences straight away.
                'nucleotideSequence.similarity': JSON.stringify(
                  SEQUENCE_BIN_DEFS.slice(0, 3).map((b) => b.id)
                ),
              }}
              aria-label="Search for occurrences with similar sequences"
            >
              <MdSearch />
            </DynamicLink>
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  );
}

// Shows the verbatim target gene together with the interpreted concept, following the core-term
// convention (properties.tsx): the interpreted value on top, the verbatim value muted below with an
// "Original" tag. `interpreted` is a target_gene vocabulary concept id — resolved to its localised
// label (e.g. "Internal Transcribed Spacer 2 (ITS2)") via the same TargetGeneLabel the filter uses.
// When nothing could be interpreted we just show the verbatim value.
function TargetGeneField({
  raw,
  interpreted,
  invalid,
  invalidSeverity,
}: {
  raw?: string;
  interpreted?: string | null;
  invalid?: boolean;
  invalidSeverity?: string;
}) {
  const hasInterpreted = typeof interpreted === 'string' && interpreted.length > 0;
  // TARGET_GENE_INVALID belongs on the verbatim value it applies to — the gene string that couldn't
  // be interpreted — sitting alongside the "Original"/"Inferred" tags.
  const invalidTag = invalid ? (
    <IssueTag type={invalidSeverity ?? 'LIGHT'}>
      <FormattedMessage
        id="enums.occurrenceIssue.TARGET_GENE_INVALID"
        defaultMessage="Invalid target gene"
      />
    </IssueTag>
  ) : null;
  if (!hasInterpreted) {
    // Nothing was interpreted (typically because the gene is invalid): show the verbatim value with
    // the issue tag next to it.
    return (
      <span>
        {raw}
        {invalidTag && (
          <>
            {' '}
            <IssueTags>{invalidTag}</IssueTags>
          </>
        )}
      </span>
    );
  }
  return (
    <div>
      <div>
        <TargetGeneLabel id={interpreted} />{' '}
        <IssueTags>
          <IssueTag type="INFO">
            <FormattedMessage id="occurrenceDetails.info.inferred" defaultMessage="Inferred" />
          </IssueTag>
        </IssueTags>
      </div>
      {raw && (
        <div style={{ opacity: 0.6, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {raw}{' '}
          <IssueTags>
            <IssueTag type="LIGHT">
              <FormattedMessage id="occurrenceDetails.info.original" defaultMessage="Original" />
            </IssueTag>
            {invalidTag}
          </IssueTags>
        </div>
      )}
    </div>
  );
}

export function Cloning({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'cloning';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.cloning.name"
      id="cloning"
      updateToc={updateToc}
    />
  );
}

export function Reference({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'reference';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.reference.name"
      id="reference"
      updateToc={updateToc}
    />
  );
}

export function EolReference({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'eolReference';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.eolReference.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function GermplasmAccession({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'germplasmAccession';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.germplasmAccession.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function GermplasmMeasurementScore({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'germplasmMeasurementScore';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.germplasmMeasurementScore.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function GermplasmMeasurementTrait({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'germplasmMeasurementTrait';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.germplasmMeasurementTrait.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function GermplasmMeasurementTrial({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'germplasmMeasurementTrial';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.germplasmMeasurementTrial.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function IdentificationHistory({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'identification';
  const id = 'identificationHistory';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.identification.name"
      id={id}
      updateToc={updateToc}
    />
  );
}

export function Identifier({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'identifier';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.identifier.name"
      id="identifier"
      updateToc={updateToc}
    />
  );
}

export function MeasurementOrFact({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'measurementOrFact';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.measurementOrFact.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function ExtendedMeasurementOrFact({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'extendedMeasurementOrFact';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.extendedMeasurementOrFact.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function ChronometricAge({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'chronometricAge';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.chronometricAge.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function GelImage({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'gelImage';
  return (
    <GenericExtension
      {...{
        occurrence,
        extensionName,
        overwrites: {
          identifier: ({ item }) => (
            <div>
              <Img src={item['identifier']} failedClassName="g-h-36 g-bg-slate-200" />
              <div>{item['identifier']}</div>
            </div>
          ),
        },
      }}
      label="occurrenceDetails.extensions.gelImage.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

function GenericExtension({
  occurrence,
  label,
  id,
  extensionName,
  overwrites,
  updateToc,
  titleExtra,
  ...props
}: {
  occurrence: OccurrenceQuery['occurrence'];
  extensionName: string;
  overwrites?: { [key: string]: (props: { item: any }) => React.ReactNode };
  label: string;
  id: string;
  updateToc?: (id: string, visible: boolean) => void;
  titleExtra?: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (id && updateToc) {
      updateToc && updateToc(id, visible);
    }
  }, [visible, updateToc, id]);

  const list = occurrence?.extensions?.[extensionName];
  if (!list || list.length === 0) {
    if (visible) setVisible(false);
    return null;
  } else {
    if (!visible) setVisible(true);
  }

  return (
    <Group label={label} id={id} titleExtra={titleExtra} className="g-pt-0 md:g-pt-0" {...props}>
      {list.length === 1 && (
        <GenericExtensionContent
          item={list[0]}
          extensionName={extensionName}
          overwrites={overwrites}
        />
      )}
      {list.length > 1 && (
        <div>
          <div style={{ fontSize: '12px' }}>
            <FormattedMessage id="counts.nRows" values={{ total: list.length }} />
          </div>
          {list.map((item, i) => (
            <ListCard key={i}>
              <GenericExtensionContent
                item={item}
                extensionName={extensionName}
                overwrites={overwrites}
                style={{ fontSize: '90%' }}
              />
            </ListCard>
          ))}
        </div>
      )}
    </Group>
  );
}

export function GenericExtensionContent({
  item,
  extensionName,
  overwrites = {},
  style,
}: {
  item: any;
  extensionName: string;
  overwrites?: { [key: string]: (props: { item: any }) => React.ReactNode };
  style?: React.CSSProperties;
}) {
  const fields = Object.keys(item);
  return (
    <Properties breakpoint={800} style={style}>
      {fields.map((field) => {
        if (overwrites[field]) {
          return (
            <ExtField key={field} {...{ item, extensionName, field }}>
              {overwrites[field]({ item })}
            </ExtField>
          );
        } else {
          return <ExtField key={field} {...{ item, extensionName, field }} />;
        }
      })}
    </Properties>
  );
}

function ExtField({
  item,
  extensionName,
  field,
  children,
  ...props
}: {
  item: any;
  extensionName: string;
  field: string;
  children?: React.ReactNode;
}) {
  if (!item[field]) return null;
  return (
    <>
      <T>
        <FormattedMessage
          id={`occurrenceDetails.extensions.${extensionName}.properties.${field}`}
          defaultMessage={getDefaultMessage(field)}
        />
      </T>
      <V>{children ? children : item[field]}</V>
    </>
  );
}

function ListCard(props) {
  return <Card className="g-mb-2 g-p-4 " {...props} />;
}

function getDefaultMessage(field: string) {
  return field.split('/').pop();
}
