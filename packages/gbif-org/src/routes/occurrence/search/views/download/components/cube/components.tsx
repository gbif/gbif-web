import { FormattedMessage } from 'react-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup as RadixRadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// ============================================================================
// Radio Group Component
// ============================================================================

interface BooleanRadioGroupProps {
  name: string;
  value: 'YES' | 'NO';
  onChange: (value: 'YES' | 'NO') => void;
}

export function BooleanRadioGroup({ name, value, onChange }: BooleanRadioGroupProps) {
  return (
    <RadixRadioGroup
      value={value}
      onValueChange={(newValue) => onChange(newValue as 'YES' | 'NO')}
      className="g-flex g-gap-4"
    >
      <label className="g-flex g-items-center g-gap-2 g-cursor-pointer">
        <RadioGroupItem value="YES" id={`${name}-yes`} />
        <span className="g-text-sm">
          <FormattedMessage id="customSqlDownload.boolean.YES" defaultMessage="Yes" />
        </span>
      </label>
      <label className="g-flex g-items-center g-gap-2 g-cursor-pointer">
        <RadioGroupItem value="NO" id={`${name}-no`} />
        <span className="g-text-sm">
          <FormattedMessage id="customSqlDownload.boolean.NO" defaultMessage="No" />
        </span>
      </label>
    </RadixRadioGroup>
  );
}

// Export as RadioGroup for backward compatibility
export const RadioGroup = BooleanRadioGroup;

// ============================================================================
// Checkbox Field Component
// ============================================================================

interface CheckboxFieldProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  labelId: string;
  labelDefault?: string;
  helpText?: string;
  disabled?: boolean;
}

export function CheckboxField({
  checked,
  onCheckedChange,
  labelId,
  labelDefault,
  helpText,
  disabled = false,
}: CheckboxFieldProps) {
  return (
    <label className="g-flex g-items-start g-gap-3">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
      />
      <div>
        <span className={`g-text-sm g-font-medium`}>
          <FormattedMessage id={labelId} defaultMessage={labelDefault || labelId} />
        </span>
        {helpText && (
          <p className="g-text-sm g-text-gray-600">
            <FormattedMessage id={helpText} />
          </p>
        )}
      </div>
    </label>
  );
}

// ============================================================================
// Select Field Component
// ============================================================================

interface SelectFieldProps {
  label: string;
  helpText: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | number[];
  translationPrefix: string;
  noneSelectedText?: string;
  disableNone?: boolean;
}

export function SelectField({
  label,
  helpText,
  value,
  onChange,
  options,
  translationPrefix,
  noneSelectedText = 'None selected',
  disableNone = false,
}: SelectFieldProps) {
  return (
    <div>
      <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
        <FormattedMessage id={label} defaultMessage={label} />
      </label>
      <p className="g-text-sm g-text-gray-600 g-mb-3">
        <FormattedMessage id={helpText} defaultMessage={helpText} />
      </p>
      <div className="g-w-full g-pe-2 g-border g-border-gray-300 g-rounded g-focus:ring-primary-500 g-focus:border-primary-500">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="g-w-full g-p-2 g-pe-0 g-rounded"
        >
          <option value="" disabled={disableNone}>
            <FormattedMessage
              id="customSqlDownload.noneSelected"
              defaultMessage={noneSelectedText}
            />
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              <FormattedMessage
                id={`${translationPrefix}.${option}`}
                defaultMessage={String(option)}
              />
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ============================================================================
// Fieldset Section Component
// ============================================================================

interface FieldsetSectionProps {
  title: string;
  helpText?: string;
  children: React.ReactNode;
}

export function FieldsetSection({ title, helpText, children }: FieldsetSectionProps) {
  return (
    <fieldset className="g-bg-white g-rounded g-shadow-lg g-border g-border-gray-200 g-p-4">
      <legend className="g-text-lg g-font-medium g-text-gray-900 g-mb-0 g-px-2">
        <FormattedMessage id={title} defaultMessage={title} />
      </legend>
      <div className="g-space-y-4">
        {helpText && (
          <div className="g-text-slate-500 g-text-sm g-mb-8">
            <FormattedMessage id={helpText} />
          </div>
        )}
        {children}
      </div>
    </fieldset>
  );
}
