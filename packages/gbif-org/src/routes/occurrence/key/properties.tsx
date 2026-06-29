import { AutomaticPropertyValue, Term as T, Value as V } from '@/components/properties';
import { OccurrenceTermFragment } from '@/gql/graphql';
import React from 'react';
import { FormattedMessage } from 'react-intl';

// import { prettifyEnum } from '../../../utils/labelMaker/config2labels';

function prettifyEnum(str?: string | null) {
  return str;
}

function startCase(str?: string | null) {
  return str;
}

export const licenseMap: Record<string, string> = {
  CC0_1_0: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode',
  CC_BY_4_0: 'https://creativecommons.org/licenses/by/4.0/legalcode',
  CC_BY_NC_4_0: 'https://creativecommons.org/licenses/by-nc/4.0/legalcode',
};

export function HtmlField(props: {
  term: OccurrenceTermFragment;
  showDetails?: boolean;
  hideIssues?: boolean;
  hideRemarks?: boolean;
}) {
  if (!props.term) return null;
  const { htmlValue } = props.term;
  return (
    <Field {...props}>
      <AutomaticPropertyValue
        value={htmlValue}
        formatter={(val) => (
          <span className="[&_a]:g-underline" dangerouslySetInnerHTML={{ __html: val }} />
        )}
      />
    </Field>
  );
}

export function PlainTextField(props: {
  term: OccurrenceTermFragment;
  showDetails?: boolean;
  onlyShowVerbatim?: boolean;
}) {
  if (!props.term) return null;
  const { value, htmlValue } = props.term;
  return (
    <Field {...props}>
      <AutomaticPropertyValue value={value} />
    </Field>
  );
}

export function ElevationField({
  elevationTerm,
  elevationAccuracyTerm,
  minimumElevationTerm,
  maximumElevationTerm,
  showDetails,
}: {
  elevationTerm?: OccurrenceTermFragment;
  elevationAccuracyTerm?: OccurrenceTermFragment;
  minimumElevationTerm?: OccurrenceTermFragment;
  maximumElevationTerm?: OccurrenceTermFragment;
  showDetails?: boolean;
}) {
  const hasElevation = !isEmpty(elevationTerm?.value);
  const hasAccuracy = !isEmpty(elevationAccuracyTerm?.value);
  const hasMin = !isEmpty(minimumElevationTerm?.verbatim);
  const hasMax = !isEmpty(maximumElevationTerm?.verbatim);

  if (!hasElevation && !hasMin && !hasMax) return null;

  // Interpreted value: elevation±accuracy or just elevation
  let interpretedValue: string | null = null;
  if (hasElevation) {
    interpretedValue = hasAccuracy
      ? `${elevationTerm!.value}±${elevationAccuracyTerm!.value}`
      : `${elevationTerm!.value}`;
  }

  // Original DWC value: min - max, or whichever single value is present
  let originalValue: string | null = null;
  if (hasMin && hasMax) {
    originalValue = `${minimumElevationTerm!.verbatim} m - ${maximumElevationTerm!.verbatim} m`;
  } else if (hasMin) {
    originalValue = `${minimumElevationTerm!.verbatim} m`;
  } else if (hasMax) {
    originalValue = `${maximumElevationTerm!.verbatim} m`;
  }

  // Only show the original line when it differs from the interpreted and is present
  const showOriginal = !!originalValue && (hasElevation || showDetails);

  return (
    <>
      <T>
        <FormattedMessage id="occurrenceFieldNames.elevation" defaultMessage="Elevation" />
      </T>
      <V style={{ position: 'relative' }}>
        <div style={{ display: 'inline-block', paddingInlineEnd: 8 }}>
          {interpretedValue ?? originalValue}
        </div>
        <Chips issues={elevationTerm?.issues} remarks={elevationTerm?.remarks} />
        {showOriginal && (
          <div>
            <span style={{ opacity: 0.6, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {originalValue}
            </span>{' '}
            <Tags>
              <Tag type="light">
                <FormattedMessage id="occurrenceDetails.info.original" />
              </Tag>
            </Tags>
          </div>
        )}
      </V>
    </>
  );
}

export function DepthField({
  depthTerm,
  depthAccuracyTerm,
  minimumDepthTerm,
  maximumDepthTerm,
  showDetails,
}: {
  depthTerm?: OccurrenceTermFragment;
  depthAccuracyTerm?: OccurrenceTermFragment;
  minimumDepthTerm?: OccurrenceTermFragment;
  maximumDepthTerm?: OccurrenceTermFragment;
  showDetails?: boolean;
}) {
  const hasDepth = !isEmpty(depthTerm?.value);
  const hasAccuracy = !isEmpty(depthAccuracyTerm?.value);
  const hasMin = !isEmpty(minimumDepthTerm?.verbatim);
  const hasMax = !isEmpty(maximumDepthTerm?.verbatim);

  if (!hasDepth && !hasMin && !hasMax) return null;

  let interpretedValue: string | null = null;
  if (hasDepth) {
    interpretedValue = hasAccuracy
      ? `${depthTerm!.value}±${depthAccuracyTerm!.value}`
      : `${depthTerm!.value}`;
  }

  let originalValue: string | null = null;
  if (hasMin && hasMax) {
    originalValue = `${minimumDepthTerm!.verbatim} m - ${maximumDepthTerm!.verbatim} m`;
  } else if (hasMin) {
    originalValue = `${minimumDepthTerm!.verbatim} m`;
  } else if (hasMax) {
    originalValue = `${maximumDepthTerm!.verbatim} m`;
  }

  const showOriginal = !!originalValue && (hasDepth || showDetails);

  return (
    <>
      <T>
        <FormattedMessage id="occurrenceFieldNames.depth" defaultMessage="Depth" />
      </T>
      <V style={{ position: 'relative' }}>
        <div style={{ display: 'inline-block', paddingInlineEnd: 8 }}>
          {interpretedValue ?? originalValue}
        </div>
        <Chips issues={depthTerm?.issues} remarks={depthTerm?.remarks} />
        {showOriginal && (
          <div>
            <span style={{ opacity: 0.6, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {originalValue}
            </span>{' '}
            <Tags>
              <Tag type="light">
                <FormattedMessage id="occurrenceDetails.info.original" />
              </Tag>
            </Tags>
          </div>
        )}
      </V>
    </>
  );
}

export function VerbatimTextField({
  term,
  label,
}: {
  term: OccurrenceTermFragment;
  label?: string;
}) {
  if (!term) return null;
  const { simpleName, verbatim } = term;
  if (isEmpty(verbatim)) return null;

  const fieldName = label || `occurrenceFieldNames.${simpleName}`;
  return (
    <React.Fragment>
      <T>
        <FormattedMessage id={fieldName} defaultMessage={startCase(simpleName) ?? ''} />
      </T>
      <V style={{ position: 'relative' }}>
        <div style={{ display: 'inline-block', paddingInlineEnd: 8 }}>
          <AutomaticPropertyValue value={verbatim} />
        </div>
      </V>
    </React.Fragment>
  );
}

export function CustomValueField(props: { term: OccurrenceTermFragment }) {
  if (!props.term) return null;
  return <Field {...props} />;
}

export function EnumField({
  getEnum,
  ...props
}: {
  term: OccurrenceTermFragment;
  showDetails?: boolean;
  getEnum: (value: string) => string;
}) {
  if (!props.term) return null;
  const { value } = props.term;
  return (
    <Field {...props}>
      <FormattedMessage id={getEnum(value)} defaultMessage={value} />
    </Field>
  );
}

export function LicenseField({
  getEnum,
  label,
  term,
  ...props
}: {
  term: OccurrenceTermFragment;
  getEnum: (value: string) => string;
  label?: string;
}) {
  if (!term) return null;
  const { value } = term;
  const license = typeof value === 'string' ? value : 'UNKNOWN';
  const licenseLink = licenseMap[license];
  return (
    <>
      <T>
        <FormattedMessage id={label || 'occurrenceFieldNames.license'} defaultMessage="License" />
      </T>
      <V>
        {licenseLink && (
          <a href={licenseLink} className="g-underline">
            <FormattedMessage id={`enums.license.${value}`} defaultMessage={value} />
          </a>
        )}
        {!licenseLink && term.verbatim}
      </V>
    </>
  );
}

export function BasicField({
  label,
  children,
  ...props
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <T>
        <FormattedMessage id={label} defaultMessage={label} />
      </T>
      <V {...props}>{children}</V>
    </>
  );
}

export function Field({
  term,
  label,
  showDetails,
  hideIssues,
  hideRemarks,
  ...props
}: {
  term: OccurrenceTermFragment;
  label?: string;
  showDetails?: boolean;
  hideIssues?: boolean;
  hideRemarks?: boolean;
}) {
  const { simpleName, verbatim, value } = term;
  if (isEmpty(value) && (!verbatim || !showDetails)) return null;

  const fieldName = label || `occurrenceFieldNames.${simpleName}`;
  return (
    <React.Fragment {...props}>
      <T>
        <FormattedMessage id={fieldName} defaultMessage={startCase(simpleName) ?? ''} />
      </T>
      <V style={{ position: 'relative' }}>
        <div style={{ display: 'inline-block', paddingInlineEnd: 8 }} {...props}></div>
        <Chips
          issues={term.issues}
          remarks={term.remarks}
          hideRemarks={hideRemarks}
          hideIssues={hideIssues}
        />
        <Provenance {...{ term, showDetails, hideRemarks }} />
      </V>
    </React.Fragment>
  );
}

function Provenance({
  term,
  showDetails,
}: {
  term: OccurrenceTermFragment;
  showDetails?: boolean;
}) {
  // should show if inferred or different from original value. Or if user has asked to see everything.
  if (!term.verbatim) return null;
  if (!showDetails && term.remarks !== 'INFERRED' && term.remarks !== 'ALTERED') return null;
  return (
    <div title="Verbatim">
      <span style={{ opacity: 0.6, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
        {term.verbatim}
      </span>{' '}
      <Tags>
        <Tag type="light">
          <FormattedMessage id="occurrenceDetails.info.original" />
        </Tag>
        {term.value === null && (
          <Tag type="light">
            <FormattedMessage id="occurrenceDetails.info.excluded" />
          </Tag>
        )}
      </Tags>
    </div>
  );
}

export function Chips({
  issues = [],
  remarks,
  hideRemarks,
  hideIssues,
}: {
  issues?: any[] | null;
  remarks?: string | null;
  hideRemarks?: boolean;
  hideIssues?: boolean;
}) {
  const isInferred = remarks === 'INFERRED';
  const isAltered = remarks === 'ALTERED';
  const hasRemarks = !hideRemarks && (isInferred || isAltered);
  const hasIssues = !hideIssues && issues && issues?.length > 0;
  if (!hasIssues && !hasRemarks) return null;

  return (
    <Tags>
      {hasIssues &&
        issues.map((i) => (
          <Tag type={i.severity} key={i.id}>
            <FormattedMessage
              id={`enums.occurrenceIssue.${i.id}`}
              defaultMessage={prettifyEnum(i.id) ?? ''}
            />
          </Tag>
        ))}

      {!hideRemarks && (
        <>
          {isInferred && (
            <Tag type="INFO">
              <FormattedMessage id="occurrenceDetails.info.inferred" defaultMessage="Inferred" />
            </Tag>
          )}
          {isAltered && (
            <Tag type="INFO">
              <FormattedMessage id="occurrenceDetails.info.altered" defaultMessage="Altered" />
            </Tag>
          )}
        </>
      )}
    </Tags>
  );
}

function Tags({ children }: { children: React.ReactNode }) {
  return <div className="-g-mx-1 g-inline-block">{children}</div>;
}

function Tag({ type, children }: { type: string; children: React.ReactNode }) {
  const colors: { [key: string]: string } = {
    INFO: 'g-bg-blue-100 g-text-blue-800 dark:g-bg-blue-900 dark:g-text-blue-300',
    WARNING: 'g-bg-yellow-100 g-text-yellow-800 dark:g-bg-yellow-900 dark:g-text-yellow-300',
    ERROR: 'g-bg-red-100 g-text-red-800 dark:g-bg-red-900 dark:g-text-red-300',
    LIGHT: 'g-bg-gray-100 g-text-gray-800 dark:g-bg-gray-900 dark:g-text-gray-300',
  };
  const color = colors[type] ?? colors.LIGHT;

  return (
    <span
      className={`g-inline-block g-mx-1 g-text-xs g-font-medium g-me-2 g-px-2.5 g-py-0.5 g-rounded ${color}`}
    >
      {children}
    </span>
  );
}

function isEmpty(value: any) {
  return value === null || value === undefined || (Array.isArray(value) && value.length === 0);
}

export const IssueTag = Tag;
export const IssueTags = Tags;
