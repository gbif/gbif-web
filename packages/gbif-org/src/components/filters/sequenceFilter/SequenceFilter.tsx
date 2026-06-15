import { useConfig } from '@/config/config';
import { FilterContext, FilterType } from '@/contexts/filter';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/shadcn';
import {
  parseSequenceFilterValue,
  resolveSequence,
  SequenceBin,
} from '@/utils/sequenceSearch';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LuLoader as Loader } from 'react-icons/lu';
import { FormattedMessage } from 'react-intl';
import { AboutButton } from '../aboutButton';
import { ApplyCancel } from '../filterTools';
import { Option } from '../option';

type SequenceFilterProps = {
  filterHandle: string;
  about?: React.FC;
  onApply?: ({ keepOpen, filter }?: { keepOpen?: boolean; filter?: FilterType }) => void;
  onCancel?: () => void;
  className?: string;
  style?: React.CSSProperties;
  pristine?: boolean;
};

export const SequenceFilter = React.forwardRef<HTMLDivElement, SequenceFilterProps>(
  ({ filterHandle, about: About, onApply, onCancel, className, style }, ref) => {
    const { filter, setField } = useContext(FilterContext);
    const config = useConfig();
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
    const resolve = async (raw: string) => {
      const seq = raw.trim();
      if (!seq) return;
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
      } catch {
        setError('error');
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

    // A fresh search (new/edited sequence) resets the selection.
    const search = async () => {
      setSelected([]);
      setPristine(false);
      await resolve(sequence);
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

    const nonEmptyBins = bins.filter((b) => b.ids.length > 0);

    return (
      <div ref={ref} className={cn('g-flex g-flex-col', className)} style={style}>
        <div className="g-flex-auto g-overflow-auto g-p-4">
          <textarea
            className="g-w-full g-h-28 g-text-xs g-font-mono g-border g-rounded g-p-2 g-resize-y"
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
              <FormattedMessage id="filters.nucleotideSequenceId.search" defaultMessage="Find similar" />
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
                        values={{ count: bin.ids.length }}
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
