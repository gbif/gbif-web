import React, { useCallback } from 'react';
import { Term as T, Value as V, AutomaticPropertyValue } from "@/components/properties";
import { FormattedMessage } from 'react-intl';
import { startCase } from 'lodash';

// import { prettifyEnum } from '../../../utils/labelMaker/config2labels';

function prettifyEnum(value) {
  return value;
}

const licenseMap = {
  'CC0_1_0': 'http://creativecommons.org/publicdomain/zero/1.0/legalcode',
  'CC_BY_4_0': 'http://creativecommons.org/licenses/by/4.0/legalcode',
  'CC_BY_NC_4_0': 'http://creativecommons.org/licenses/by-nc/4.0/legalcode'
};

export function HtmlField(props) {
  if (!props.term) return null;
  const { htmlValue } = props.term;
  return <Field {...props} >
    <AutomaticPropertyValue value={htmlValue} formatter={val => <span dangerouslySetInnerHTML={{ __html: (val) }} />}/>
  </Field>
}

export function PlainTextField(props) {
  if (!props.term) return null;
  const { value, htmlValue } = props.term;
  return <Field {...props} >
    <AutomaticPropertyValue value={value} />
  </Field>
}

export function CustomValueField(props) {
  if (!props.term) return null;
  const { value } = props.term;
  return <Field {...props} />
}

export function EnumField({ getEnum, ...props }) {
  if (!props.term) return null;
  const { value } = props.term;
  return <Field {...props}>
    <FormattedMessage id={getEnum(value)} defaultMessage={value} />
  </Field>
}

export function LicenseField({ getEnum, label, term, ...props }) {
  if (!term) return null;
  const { value } = term;
  const licenseLink = licenseMap[value];
  return <>
    <T>
      <FormattedMessage id={label || 'occurrenceFieldNames.license'} defaultMessage="License" />
    </T>
    <V>
      {licenseLink && <a href={licenseLink}>
        <FormattedMessage id={`enums.license.${value}`} defaultMessage={value} />
      </a>}
      {!licenseLink && term.verbatim}
    </V>
  </>
}

export function BasicField({ label, ...props }) {
  return <>
    <T>
      <FormattedMessage id={label} defaultMessage={label} />
    </T>
    <V {...props} />
  </>
}

export function Field({ term, label, showDetails, hideIssues, hideRemarks, ...props }) {
  const { simpleName, verbatim, value, htmlValue, remarks, issues } = term;
  if (isEmpty(value) && (!verbatim || !showDetails)) return null;

  const fieldName = label || `occurrenceFieldNames.${simpleName}`;
  return <React.Fragment {...props}>
    <T>
      <FormattedMessage
        id={fieldName}
        defaultMessage={startCase(simpleName)}
      />
    </T>
    <V style={{ position: 'relative' }}>
      <div style={{ display: 'inline-block', paddingRight: 8 }}  {...props}></div>
      <Chips {...term} hideRemarks={hideRemarks} hideIssues={hideIssues}/>
      <Provenance {...{ term, showDetails, hideRemarks }} />
    </V>
  </React.Fragment>
}

function Provenance({ term, showDetails }) {
  // should show if inferred or different from original value. Or if user has asked to see everything.
  if (!term.verbatim) return null;
  if (!showDetails && term.remarks !== 'INFERRED' && term.remarks !== 'ALTERED') return null;
  return <div title="Verbatim">
    <span style={{ opacity: .6, whiteSpace: 'pre-wrap', fontFamily: "monospace" }}>{term.verbatim}</span> <Tags>
      <Tag type="light">
        <FormattedMessage id="occurrenceDetails.info.original" />
      </Tag>
      {term.value === null && <Tag type="light">
        <FormattedMessage id="occurrenceDetails.info.excluded" />
      </Tag>}
    </Tags>
  </div>
}

export function Chips({ issues = [], remarks, hideRemarks, hideIssues }) {
  const isInferred = remarks === 'INFERRED';
  const isAltered = remarks === 'ALTERED';
  const hasRemarks = !hideRemarks && (isInferred || isAltered);
  const hasIssues = !hideIssues && issues?.length > 0;
  if (!hasIssues && !hasRemarks) return null;

  return <Tags>
    {hasIssues && issues.map((i) => (
      <Tag type={i.severity.toLowerCase()} key={i.id}>
        <FormattedMessage
          id={`enums.occurrenceIssue.${i.id}`}
          defaultMessage={prettifyEnum(i.id)}
        />
      </Tag>
    ))}

    {!hideRemarks && <>
      {isInferred && <Tag type="INFO" >
        <FormattedMessage id="occurrenceDetails.info.inferred" defaultMessage="Inferred" />
      </Tag>}
      {isAltered && <Tag type="INFO" >
        <FormattedMessage id="occurrenceDetails.info.altered" defaultMessage="Altered" />
      </Tag>
      }
    </>}
  </Tags>
}

function Tags({ children }) {
  return <div className="-mx-1 inline-block">
    {children}
  </div>
}

function Tag({ type, children }) {
  const colors = {
    INFO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    WARNING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    ERROR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    LIGHT: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  };
  const color = colors[type] ?? colors.LIGHT;

  return <span className={`inline-block mx-1 text-xs font-medium me-2 px-2.5 py-0.5 rounded ${color}`} >
    {children}
  </span>
}

function isEmpty(value) {
  return value === null || value === undefined || (Array.isArray(value) && value.length === 0);
}