import React, { useCallback } from 'react';
import { Properties, Tag, Tags } from "../../../components";
import { FormattedMessage } from 'react-intl';
import { prettifyEnum } from '../../../utils/labelMaker/config2labels';

const { Term: T, Value: V } = Properties;
const licenseMap = {
  'CC0_1_0': 'http://creativecommons.org/publicdomain/zero/1.0/legalcode',
  'CC_BY_4_0': 'http://creativecommons.org/licenses/by/4.0/legalcode',
  'CC_BY_NC_4_0': 'http://creativecommons.org/licenses/by-nc/4.0/legalcode'
};

export function HtmlField(props) {
  if (!props.term) return null;
  const { htmlValue } = props.term;
  const htmlValues = Array.isArray(htmlValue) ? htmlValue : [htmlValue];
  return <Field {...props}>
    {htmlValues.map((htmlContent, i) => <div key={i} dangerouslySetInnerHTML={{ __html: (htmlContent) }} />)}
  </Field>
}

export function PlainTextField(props) {
  if (!props.term) return null;
  const { value } = props.term;
  const values = Array.isArray(value) ? value : [value];
  return <Field {...props} >
    {values.join(' ● ')}
  </Field>
}

export function CustomValueField(props) {
  if (!props.term) return null;
  return <Field {...props} />
}

export function EnumField({ getEnum, ...props }) {
  if (!props.term) return null;
  const { value } = props.term;
  const values = Array.isArray(value) ? value : [value];
  return <Field {...props}>
    {values.map((enumValue, i) => <>{i > 0 && ' ● '}<FormattedMessage key={i} id={getEnum(enumValue)} defaultMessage={enumValue} /></>)}
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
  const { simpleName, verbatim, value } = term;
  if (!value && (!verbatim || !showDetails)) return null;

  const fieldName = label || `occurrenceFieldNames.${simpleName}`;
  return <React.Fragment>
    <T>
      <FormattedMessage
        id={fieldName}
        defaultMessage={_.startCase(simpleName)}
      />
    </T>
    <V style={{ position: 'relative' }}>
      <div style={{ display: 'inline-block', paddingRight: 8 }} {...props}></div>
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
    <span style={{ opacity: .6, whiteSpace: 'pre-wrap' }}>{term.verbatim}</span> <Tags>
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