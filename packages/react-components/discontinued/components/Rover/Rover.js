import React from 'react';
import { useRoverState, Rover } from "reakit/Rover";

const RoverGroup = ({ as: Bx = 'div', content }) => {
  const rover = useRoverState();

  return <Bx>
    {typeof content === 'function' ? content(rover) : content}
  </Bx>
};

export { Rover, useRoverState, RoverGroup };