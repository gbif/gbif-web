import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, Properties } from '../../../components';
import * as css from '../../EventSidebar/styles';
import { SeedbankFields } from '../SeedbankFields';
import { Measurements } from './Measurements';
import { Treatments } from './Treatments';

export function Groups({ event, showAll }) {
  console.log(event);
  if (!event) return null;

  const trialFields = [
    'testDateStarted',
    'testLengthInDays',
    'numberGerminated',
    'germinationRateInDays',
    'adjustedGerminationPercentage',
    'viabilityPercentage',
    'numberFull',
    'numberEmpty',
    'numberTested',
    'preTestProcessingNotes',
  ];

  return (
    <>
      <h4 style={{ marginLeft: 16 }}>Trial: {event.eventID}</h4>
      <Group label='extensions.seedbank.groups.details'>
        <SeedbankFields event={event} fields={trialFields} />
      </Group>
      <Measurements {...{ showAll, event: event }} />
      <Treatments event={event} />
    </>
  );
}

export function Group({ label, ...props }) {
  return (
    <Accordion
      summary={<FormattedMessage id={label} />}
      defaultOpen={true}
      css={css.group()}
      {...props}
    />
  );
}
