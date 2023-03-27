import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import { Card, CardHeader2 } from '../../shared';
import _ from 'lodash';
import useEventData from './useEventData';
import { prettifyString } from '../../../utils/labelMaker/config2labels';
import { Location } from './Location';

export function Events({
  specimen,
  setSection,
  name = 'events',
  ...props
}) {
  const [events, error, loading] = useEventData({ eventId: specimen?.collectionEvent?.eventId });
  if (loading || !events) return null;

  if (events?.length === 0) {
    setSection(name, false);
    return null;
  }
  setSection(name, true);

  const eventItems = events.map(event => <Event event={event} />);
  return <div>
    {events
      .map((event, index, array) => {
        return <>
          <Event event={event} {...props} />
          {index < array.length - 1 && <div css={css`margin-left: 24px; width: 2px; height: 12px; background: var(--transparentInk20);`}></div>}
        </>
      })
    }
  </div>
}

export function Event({ event, ...props }) {
  return <Location event={event} {...props} />
  // return <Card padded={false} css={css`padding: 12px 24px;`} {...props}>
  //   <CardHeader2>{prettifyString(event.eventType)}</CardHeader2>
  //   <div>
  //     card content
  //   </div>
  // </Card>
}

const events = css`
  
`;