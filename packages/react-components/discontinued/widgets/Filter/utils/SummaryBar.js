
import { css, jsx } from '@emotion/react';
import ThemeContext from '../../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Row, Col, Tooltip } from '../../../components';
import { TiArrowShuffle as InvertIcon } from "react-icons/ti";
import { MdDeleteOutline as DeleteIcon} from "react-icons/md";



const SummaryBar = ({ count, onClear, onInvert, ...props }) => {
  const theme = useContext(ThemeContext);
  return <div {...props} css={summary(theme)} >
    <Row as="div">
      <Col>
        <FormattedMessage id="counts.nSelected" values={{ total: count }} />
      </Col>
      <Col grow={false} css={css`display: flex; font-size: 1.3em; > * {margin-inline-start: 6px;}`}>
        {count > 0 && <Tooltip title={<FormattedMessage id="filterSupport.clear" defaultMessage="Clear" />} >
          <Button appearance="text" onClick={onClear}><DeleteIcon /></Button>
        </Tooltip>}
        {onInvert && <Tooltip title={<FormattedMessage id="filterSupport.invert" defaultMessage="Invert selection" />} >
          <Button appearance="text" onClick={onInvert}><InvertIcon /></Button>
        </Tooltip>}
      </Col>
    </Row>
  </div>
}

const summary = theme => css`
  font-size: .85em;
  color: #999;
  font-weight: 400;
  margin: .5em 1.5em;
`;

export default SummaryBar;