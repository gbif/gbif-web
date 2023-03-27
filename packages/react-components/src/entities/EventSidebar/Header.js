
import { jsx } from '@emotion/react';
import React, {useContext, useState} from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import {Row, Col, IconFeatures, Eyebrow, Button} from "../../components";
import useBelow from '../../utils/useBelow';
import {MdOutlineWarningAmber} from "react-icons/md";

export function Header({
  data,
  loading,
  error,
  showError,
  className,
  ...props
}) {
  const isBelow = useBelow(500);
  const theme = useContext(ThemeContext);
  const item = data?.event;

  function toggleShowError() {
    showError();
  };

  return <Row wrap="no-wrap" css={css.header({ theme })} {...props}>
    <Col grow>
      <h1>{item.eventType?.concept ? item.eventType.concept : 'Event'}</h1>
      <div css={css.headline({ theme })}>
        <Eyebrow 
          style={{fontSize: '80%'}}
          prefix={<FormattedMessage id="eventDetails.dataset" />}
          suffix={data?.event?.datasetTitle}
            />
      </div>
      <div css={css.entitySummary({ theme })}>
        <IconFeatures css={css.features({ theme })}
                      eventDate={item.eventDate}
                      countryCode={item.countryCode}
                      locality={item.locality}
        />
      </div>
      {error && (
        <div><MdOutlineWarningAmber color="red" />
          <Button appearance="link" onClick={showError}>&nbsp;  Warning: There are some issues related to this record!</Button>
        </div>
      )}
    </Col>
  </Row>
};
