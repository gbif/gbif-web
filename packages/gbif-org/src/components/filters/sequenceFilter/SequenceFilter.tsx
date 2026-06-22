import { useConfig } from '@/config/config';
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import useQuery from '@/hooks/useQuery';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/shadcn';
import {
  parseSequenceFilterValue,
  resolveSequence,
  SequenceBin,
  SequenceResolution,
} from '@/utils/sequenceSearch';
import cloneDeep from 'lodash/cloneDeep';
import hash from 'object-hash';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LuLoader as Loader } from 'react-icons/lu';
import { FormattedMessage } from 'react-intl';
import { AboutButton } from '../aboutButton';
import { ApplyCancel, FacetQuery, getAsQuery } from '../filterTools';
import { Option } from '../option';

type SequenceFilterProps = {
  filterHandle: string;
  about?: React.FC;
  // Facet on nucleotideSequenceNucleotideSequenceID (with an `include` variable). When
  // provided, the per-bin counts reflect how many of the matched sequences still occur under
  // the other active filters.
  facetQuery?: string;
  searchConfig: FilterConfigType;
  onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
  onCancel?: () => void;
  className?: string;
  style?: React.CSSProperties;
  pristine?: boolean;
};

export const SequenceFilter = React.forwardRef<HTMLDivElement, SequenceFilterProps>(
  ({ filterHandle, about: About, facetQuery, searchConfig, onApply, onCancel, className, style }, ref) => {
    const { filter, setField } = useContext(FilterContext);
    const config = useConfig();
    const searchContext = useSearchContext();
    // Base for graphql-api unstable-api controllers (vsearch lives here).
    const webUtilsBase = import.meta.env.PUBLIC_WEB_UTILS;

    const existing = parseSequenceFilterValue(filter?.must?.[filterHandle]?.[0]);

    const [sequence, setSequence] = useState<string>(existing?.sequence ?? '');
    const [bins, setBins] = useState<SequenceBin[]>([]);
    const [selected, setSelected] = useState<string[]>(existing?.selected ?? []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<'invalid' | 'error' | null>(null);
    const [searched, setSearched] = useState(false);
    const [pristine, setPristine] = useState(true);
    const didInit = useRef(false);

    // Core resolve (cache-backed). Does not touch the current selection.
    const resolve = async (raw: string): Promise<SequenceResolution | undefined> => {
      const seq = raw.trim();
      if (!seq) return undefined;
      setLoading(true);
      setError(null);
      try {
        const resolution = await resolveSequence(seq, config.v1Endpoint, webUtilsBase);
        if (resolution.invalid) {
          setBins([]);
          setError('invalid');
        } else {
          setBins(resolution.bins);
        }
        setSearched(true);
        return resolution;
      } catch {
        setError('error');
        return undefined;
      } finally {
        setLoading(false);
      }
    };

    // Restore the bins for an existing sequence when the filter is reopened (cheap — the
    // cache is usually already warm). Keeps the existing selection.
    useEffect(() => {
      if (didInit.current) return;
      didInit.current = true;
      if (existing?.sequence) resolve(existing.sequence);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // A fresh search (new/edited sequence) resets the selection. Once new results arrive,
    // also clear any previously-applied filter immediately, so the live result set stops
    // showing the old sequence's matches instead of waiting for the user to click Apply
    // again. The popover stays open (no onApply) for the new bin picks.
    const search = async () => {
      setSelected([]);
      setPristine(false);
      const resolution = await resolve(sequence);
      if (resolution && !resolution.invalid) {
        const applied = parseSequenceFilterValue(filter?.must?.[filterHandle]?.[0]);
        if (applied) setField(filterHandle, []);
      }
    };

    const toggleBin = (id: string) => {
      setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
      setPristine(false);
    };

    const apply = () => {
      const hasSelection = selected.length > 0 && sequence.trim().length > 0;
      const value = JSON.stringify({ sequence: sequence.trim(), selected });
      const next = setField(filterHandle, hasSelection ? [value] : []);
      onApply?.({ keepOpen: false, filter: next });
    };

    // --- Filter-aware bin counts -------------------------------------------------------
    // Restrict a facet on nucleotideSequenceID to the matched (candidate) ids, scoped by the
    // other active filters (this handle removed), so each bin can show how many of its
    // sequences still occur under e.g. a country filter. Mirrors the enum-filter pattern.
    const candidateIds = useMemo(
      () => Array.from(new Set(bins.flatMap((b) => (Array.isArray(b.ids) ? b.ids : [])))),
      [bins]
    );
    const prunedFilter = useMemo(() => {
      const pruned = cleanUpFilter(cloneDeep(filter));
      delete pruned.must?.[filterHandle];
      delete pruned.mustNot?.[filterHandle];
      return pruned;
    }, [filter, filterHandle]);
    const prunedHash = hash(prunedFilter);

    const { data: facetData, load: facetLoad } = useQuery<FacetQuery, unknown>(facetQuery ?? '', {
      lazyLoad: true,
    });

    const candidateKey = candidateIds.join(',');
    useEffect(() => {
      if (!facetQuery || candidateIds.length === 0) return;
      const query = getAsQuery({ filter: prunedFilter, searchContext, searchConfig });
      const extra = { include: candidateIds, size: candidateIds.length };
      facetLoad({
        variables:
          searchContext.queryType === 'V1' ? { query, ...extra } : { ...(query as object), ...extra },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facetQuery, candidateKey, prunedHash]);

    // Set of ids that still occur under the other filters. `undefined` while loading/absent →
    // fall back to the raw vsearch counts.
    const survivingSet = useMemo(() => {
      const field = facetData?.search?.facet?.field;
      if (!field) return undefined;
      return new Set(field.filter((x) => x?.name).map((x) => x.name as string));
    }, [facetData]);

    const binCount = (bin: SequenceBin) =>
      survivingSet ? bin.ids.filter((id) => survivingSet.has(id)).length : bin.ids.length;

    const nonEmptyBins = bins.filter((b) => b.ids.length > 0);

    return (
      <div ref={ref} className={cn('g-flex g-flex-col', className)} style={style}>
        <div className="g-flex-auto g-overflow-auto g-p-4">
          <textarea
            className="g-w-full g-h-18 g-text-xs g-font-mono g-border g-rounded g-p-2 g-resize-y"
            value={sequence}
            spellCheck={false}
            onChange={(e) => {
              setSequence(e.target.value);
              setSearched(false);
            }}
            onBlur={() => {
              if (sequence.trim() && !searched && !loading) search();
            }}
            placeholder={'ACGT...'}
          />
          <div className="g-mt-2 g-flex g-items-center g-gap-2">
            <Button size="sm" onClick={search} disabled={loading || !sequence.trim()}>
              <FormattedMessage
                id="filters.nucleotideSequenceId.search"
                defaultMessage="Find similar"
              />
            </Button>
            {loading && <Loader className="g-animate-spin g-text-slate-400" />}
            {About && (
              <AboutButton className="g-ms-auto g-text-slate-400">
                <About />
              </AboutButton>
            )}
          </div>

          {error === 'invalid' && (
            <p className="g-mt-3 g-text-sm g-text-orange-600">
              <FormattedMessage
                id="filters.nucleotideSequenceId.invalid"
                defaultMessage="That doesn't look like a valid nucleotide sequence."
              />
            </p>
          )}
          {error === 'error' && (
            <p className="g-mt-3 g-text-sm g-text-red-600">
              <FormattedMessage
                id="filters.nucleotideSequenceId.error"
                defaultMessage="Could not search for similar sequences. Please try again."
              />
            </p>
          )}

          {!loading && searched && nonEmptyBins.length === 0 && !error && (
            <p className="g-mt-3 g-text-sm g-text-slate-500">
              <FormattedMessage
                id="filters.nucleotideSequenceId.noMatches"
                defaultMessage="No similar sequences found."
              />
            </p>
          )}

          {nonEmptyBins.length > 0 && (
            <div className="g-mt-3">
              {nonEmptyBins.map((bin) => (
                <Option
                  key={bin.id}
                  checked={selected.includes(bin.id)}
                  onClick={() => toggleBin(bin.id)}
                >
                  <span className="g-flex g-justify-between g-gap-4">
                    <FormattedMessage
                      id={`filters.nucleotideSequenceId.bin.${bin.id}`}
                      defaultMessage={`${bin.min}%`}
                    />
                    <span className="g-flex-none g-text-slate-500">
                      <FormattedMessage
                        id="filters.nucleotideSequenceId.uniqueSequences"
                        defaultMessage="{count, plural, one {# distinct sequence} other {# distinct sequences}}"
                        values={{ count: binCount(bin) }}
                      />
                    </span>
                  </span>
                </Option>
              ))}
            </div>
          )}
        </div>

        <ApplyCancel
          onApply={apply}
          onCancel={onCancel}
          pristine={pristine}
          disabled={selected.length === 0}
        />
      </div>
    );
  }
);
