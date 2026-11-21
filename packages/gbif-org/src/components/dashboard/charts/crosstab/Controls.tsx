import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';
import { MdSwapHoriz } from 'react-icons/md';
import { useIntl } from 'react-intl';
import { dimensions, type Dimension } from './dimensions';

const field =
  'g-border g-border-slate-300 g-rounded-md g-bg-white g-px-2 g-py-1 g-text-sm g-text-slate-700 focus-visible:g-outline-none focus-visible:g-ring-2 focus-visible:g-ring-primary-500';

type SegmentedProps<T extends string> = {
  label: string;
  value: T;
  options: { id: T; text: string; title?: string }[];
  onChange: (value: T) => void;
};

/** A few exclusive choices as buttons side by side. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="g-inline-flex g-rounded-md g-border g-border-slate-300 g-overflow-hidden"
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          title={o.title}
          onClick={() => onChange(o.id)}
          className={cn(
            'g-px-2 g-py-1 g-text-sm g-border-e g-border-slate-300 last:g-border-e-0',
            value === o.id
              ? 'g-bg-primary-500 g-text-white'
              : 'g-bg-white g-text-slate-600 hover:g-bg-slate-100'
          )}
        >
          {o.text}
        </button>
      ))}
    </div>
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
  onInterval: (size: number | undefined) => void;
}) {
  const intl = useIntl();
  return (
    <span className="g-inline-flex g-items-center g-gap-1">
      <select
        value={dimension.id}
        aria-label={label}
        title={label}
        className={cn(field, 'g-max-w-[12rem]')}
        onChange={(e) => onChange(e.target.value)}
      >
        {dimensions.map((d) => (
          <option key={d.id} value={d.id}>
            {intl.formatMessage({ id: d.labelId, defaultMessage: d.id })}
          </option>
        ))}
      </select>
      {dimension.kind === 'histogram' && (
        <SizeInput label={bucketLabel} value={interval} placeholder={auto} onCommit={onInterval} />
      )}
    </span>
  );
}

/** A bucket size. Applied when the field is left or Enter is pressed, not on every key. */
function SizeInput({
  label,
  value,
  placeholder,
  onCommit,
}: {
  label: string;
  value?: number;
  placeholder?: number;
  onCommit: (size: number | undefined) => void;
}) {
  const [text, setText] = useState(value ? String(value) : '');
  useEffect(() => setText(value ? String(value) : ''), [value]);
  const commit = () => {
    const n = Number(text.replace(',', '.'));
    const next = text.trim() !== '' && n > 0 ? n : undefined;
    setText(next ? String(next) : '');
    if (next !== value) onCommit(next);
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
      className={cn(field, 'g-w-20')}
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
      className={cn(field, 'g-inline-flex g-items-center g-text-slate-500 hover:g-bg-slate-100')}
    >
      <MdSwapHoriz />
    </button>
  );
}
