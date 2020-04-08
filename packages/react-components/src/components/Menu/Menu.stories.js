import React, { useState } from 'react';
import { Menu, MenuAction, MenuToggle } from './Menu';
import { Button } from '../index';

export default {
  title: 'Components/Menu',
  component: Menu,
};

export const Example = () => {
  const [help, showHelp] = useState(false);
  return (
    <Menu
      aria-label="Custom menu"
      trigger={<Button style={{ marginLeft: 200 }}>Custom menu</Button>}
      items={menuState => [
        <MenuAction onClick={e => {console.log('button action clicked', menuState); menuState.hide()}}>About this filter</MenuAction>,
        <MenuToggle checked={help} onChange={e => showHelp(!help)}>Show help texts</MenuToggle>,
        <MenuToggle onChange={e => console.log(e.target.checked, 'switch changed')}>Add as widget</MenuToggle>,
      ]}
    />
  );
}

Example.story = {
  name: 'Menu',
};
