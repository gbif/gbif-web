
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, IconFeatures, Eyebrow } from "../../components";
import useBelow from '../../utils/useBelow';

export function Header({
  data,
  loading,
  error,
  className,
  ...props
}) {
  const isBelow = useBelow(500);
  const theme = useContext(ThemeContext);
  const item = data?.event;
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
    </Col>
  </Row>
};
