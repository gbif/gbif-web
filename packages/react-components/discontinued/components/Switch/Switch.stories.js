import React from 'react';
import Switch from './Switch';

export default {
  title: 'Components/Switch',
  component: Switch,
};

export const Example = () => <div>
  <div>
    <Switch style={{fontSize: 14, margin: 20}}/>
  </div>
  <div>
    <Switch style={{fontSize: 24, margin: 20}}/>
  </div>
</div>

Example.story = {
  name: 'Switch',
};
