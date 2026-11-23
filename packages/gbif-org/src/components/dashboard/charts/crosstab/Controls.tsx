import { filterSearchScore } from '@/components/filters/filterSearch';
import { SimpleTooltip } from '@/components/simpleTooltip';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toggleVariants } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';
import { MdArrowDropDown, MdCheck, MdSwapHoriz } from 'react-icons/md';
import { useIntl } from 'react-intl';
import { dimensions, type Dimension } from './dimensions';

type SegmentedProps<T extends string> = {
  label: string;
  value: T;
  options: { id: T; text: string; title?: string }[];
  onChange: (value: T) => void;
};

// Controls side by side in one outline, with a line between them: the colour choice, and each axis
// (its dimension and, for numbers, its bucket size).
// Styled as the site's toggle groups (e.g. "has coordinates" in the location filter): the group's
// outline as `ToggleGroup`'s, each part as one of its items.
const segmentGroup =
  'g-bg-white g-inline-flex g-max-w-full g-flex-wrap g-items-stretch g-rounded g-border g-border-solid g-border-primary-500 g-overflow-hidden';
const segment = toggleVariants({ variant: 'primary', size: 'sm' });

/** A few exclusive choices as buttons side by side: the site's toggle group. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      variant="primary"
      aria-label={label}
      value={value}
      // A click on the chosen one would clear the choice: keep it.
      onValueChange={(next) => next && onChange(next as T)}
    >
      {options.map((o) => (
        <ToggleGroupItem key={o.id} value={o.id} variant="primary" size="sm" title={o.title}>
          {o.text}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

/** One axis: choose the dimension and, when it is a number, the bucket size. */
export function AxisControl({
  label,
  dimension,
  onChange,
  bucketLabel,
  interval,
  auto,
  raised,
  onInterval,
}: {
  label: string;
  dimension: Dimension;
  onChange: (id: string) => void;
  bucketLabel: string;
  /** The bucket size asked for, if any. */
  interval?: number;
  /** The bucket size used when none is asked for. */
  auto?: number;
  /** The size asked for was raised to keep the number of buckets manageable: the size used, and why. */
  raised?: { size: number; message: string };
  onInterval: (size: number | undefined) => void;
}) {
  return (
    <span className="g-inline-flex g-items-center g-gap-1">
      {/* The dimension and its bucket size sit together, as one group. */}
      <span className={segmentGroup}>
        <DimensionPicker label={label} dimension={dimension} onChange={onChange} />
        {dimension.kind === 'histogram' && (
          <SizeInput
            label={bucketLabel}
            value={interval}
            shown={raised?.size}
            placeholder={auto}
            onCommit={onInterval}
          />
        )}
      </span>
      {dimension.kind === 'histogram' && raised && <RaisedMark message={raised.message} />}
    </span>
  );
}

/** The dimension of an axis: a button that opens a searchable list, like More filters. */
function DimensionPicker({
  label,
  dimension,
  onChange,
}: {
  label: string;
  dimension: Dimension;
  onChange: (id: string) => void;
}) {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const name = (d: Dimension) => intl.formatMessage({ id: d.labelId, defaultMessage: d.id });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${label}: ${name(dimension)}`}
          title={label}
          className={cn(segment, 'g-inline-flex g-items-center g-max-w-[14rem]')}
        >
          <span className="g-truncate">{name(dimension)}</span>
          <MdArrowDropDown className="g-ms-1 g-flex-none" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="g-p-0 g-w-72" align="start">
        <Command filter={filterSearchScore}>
          <CommandInput
            placeholder={intl.formatMessage({ id: 'dashboard.crosstab.searchDimension' })}
          />
          <CommandEmpty>
            {intl.formatMessage({ id: 'dashboard.crosstab.noMatchingDimensions' })}
          </CommandEmpty>
          <CommandList>
            <CommandGroup heading={label}>
              {dimensions.map((d) => (
                <CommandItem
                  key={d.id}
                  // cmdk needs a unique value per item, so the id ends the search text
                  value={`${name(d)} ${d.id}`}
                  className="g-flex g-items-center g-justify-between"
                  onSelect={() => {
                    setOpen(false);
                    if (d.id !== dimension.id) onChange(d.id);
                  }}
                >
                  {name(d)}
                  {d.id === dimension.id && <MdCheck className="g-flex-none" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** Shown next to a bucket size that was raised: the size in the field is not the one typed. */
function RaisedMark({ message }: { message: string }) {
  return (
    <SimpleTooltip title={message}>
      <span
        role="img"
        aria-label={message}
        className="g-inline-flex g-items-center g-justify-center g-w-4 g-h-4 g-rounded-full g-bg-orange-500 g-text-yellow-100 g-text-[11px] g-font-bold g-leading-none g-cursor-help"
      >
        !
      </span>
    </SimpleTooltip>
  );
}

/**
 * A bucket size. Applied when the field is left or Enter is pressed, not on every key. `shown` is the
 * size used when it differs from the one asked for (it was raised): the field shows it, while the
 * size asked for stays stored, so it applies again once a filter allows it.
 */
function SizeInput({
  label,
  value,
  shown,
  placeholder,
  onCommit,
}: {
  label: string;
  value?: number;
  shown?: number;
  placeholder?: number;
  onCommit: (size: number | undefined) => void;
}) {
  const display = shown ?? value;
  const [text, setText] = useState(display ? String(display) : '');
  useEffect(() => setText(display ? String(display) : ''), [display]);
  const commit = () => {
    const n = Number(text.replace(',', '.'));
    const next = text.trim() !== '' && n > 0 ? n : undefined;
    // Leaving the field as it was, or typing the size asked for again, changes nothing.
    if (next === value || (shown !== undefined && next === shown)) {
      setText(display ? String(display) : '');
      return;
    }
    setText(next ? String(next) : '');
    onCommit(next);
  };
  return (
    <input
      type="number"
      min={0}
      step="any"
      inputMode="decimal"
      value={text}
      placeholder={placeholder === undefined ? '' : String(placeholder)}
      aria-label={label}
      title={label}
      className={cn(
        segment,
        'g-w-20 focus-visible:g-outline-none focus:g-ring-2 focus:g-ring-inset focus:g-ring-primary-500'
      )}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && commit()}
    />
  );
}

export function SwapButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(segmentGroup, segment, 'g-items-center')}
    >
      <MdSwapHoriz />
    </button>
  );
}
