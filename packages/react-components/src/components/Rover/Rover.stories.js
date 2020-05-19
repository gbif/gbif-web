import React, { useState } from 'react';
import { Rover, useRoverState, RoverGroup } from './Rover';
import { Group } from "reakit/Group";
import { Button } from "reakit/Button";
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

export default {
  title: 'Components/Rover',
  component: Rover,
};

export const WithOutState = () => {
  const content = rover => <>
    <Rover {...rover} as={Button}>
      Button 1
    </Rover>
    <Rover {...rover} as={Button} onClick={e => rover.next()}>
      next
    </Rover>
    <Rover {...rover} as={Button} onClick={e => rover.previous()}>
      prev
    </Rover>
  </>;

  return <>
    <StyledProse source={readme}></StyledProse>
    <RoverGroup content={content} />
  </>;
}

WithOutState.story = {
  name: 'Without state',
};

export const WithState = () => {
  const rover = useRoverState();
  const [isHidden, hidden] = useState(false);

  return (
    <Group>
      <span>
        <Rover {...rover} as={Button}>
          Button 1
        </Rover>
      </span>
      {!isHidden && <Rover {...rover} as={Button} onClick={e => { hidden(true); rover.next() }}>
        can disappear
      </Rover>}
      <Rover {...rover} as={Button}>
        Button 3
      </Rover>
      <Rover {...rover} as={Button} onClick={e => hidden(true)}>
        hide
      </Rover>
      <Rover {...rover} as={Button} onClick={e => hidden(false)}>
        unhide
      </Rover>
    </Group>
  );
}

WithState.story = {
  name: 'With state',
};
