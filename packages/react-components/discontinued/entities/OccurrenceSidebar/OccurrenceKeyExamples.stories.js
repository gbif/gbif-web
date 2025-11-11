import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Accordion, Properties } from '../../components';
import { MockGroups } from './MockGroups';
const { Term: T, Value: V } = Properties;

export default {
  title: 'Entities/Occurrence examples',
};

export const Example = () => <div style={{background: '#fff', width: 700, fontSize: '13px', padding: 32}}>
  Based on https://www.gbif.org/occurrence/1147311717.
  <br />
  <br />
  <strong>Group fields into one property</strong><br />
  I was wondering if we should try to collapse more fields into 1. 
  Taxonomy being a good example. Also e.g. lat/lng/uncertainty/Geodetic datum.
  <br />
  Exactly which fields would make sense to collapse we would need to consider - this is just an idea.
  <br />
  <br />
  <strong>Hide fields</strong><br />
  Also we could consider hiding some fields per default. E.g.<br />
  * day/month/year since we show full date<br />
  * eventID if only one event and no sampling protocol (then it is probably just filled in for the sake of it)<br />
  * institution code if it isn't a specimen (data is often filled despite being meaningless)<br />
  <br />
  <strong>Option to show all</strong><br />
  We could then have a toggle to show the remaining fields and possibly ungroup them - that is show day/month/year etc (and store the choice for the future)<br />
  <br />
  <strong>Show verbatim when there are related issues</strong><br />
  For fields that we do show and there is an issue related to the field, then we could show both the interpreted and the verbatim name along with the issue.
  <br />
  <br />
  <strong>Show verbatim toggle</strong><br />
  Option to show all data incl verbatim. This would be similar to gbif.org
  <br />
  <br />
  <MockGroups />
</div>;

Example.story = {
  name: 'Occurrence std view',
};
