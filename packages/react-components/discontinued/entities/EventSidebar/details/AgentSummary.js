
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col, Image, Properties } from "../../../components";
import { FormattedDate } from 'react-intl';

const { Term: T, Value: V } = Properties;

export function AgentSummary({
  agent,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { person } = agent;
  return <Row css={css.agentSummary({ theme })} wrap="nowrap">
    <div>{person?.image?.value && <Image src={person?.image?.value} h={80} style={{maxWidth: 80}}/>}</div>
    <div>
      <h4>{person?.name?.value}</h4>
      {person?.birthDate?.value && <div>
        <FormattedDate value={person?.birthDate?.value}
          year="numeric"
          month="long"
          day="2-digit" />
        {person?.deathDate?.value && <span> - <FormattedDate value={person?.deathDate?.value}
          year="numeric"
          month="long"
          day="2-digit" />
        </span>}
      </div>}
      <a href={agent.value}>{agent.value}</a>
    </div>
  </Row>
};
