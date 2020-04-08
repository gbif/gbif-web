import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import { Checkbox } from '../Checkbox';
import { Option } from '../../widgets/Filter/Option';

const list = Array(500).fill().map((e, i) => i + '');

export const Performance = ({
  ...props
}) => {
  return <div>
    {list.map(e => <Option
      // innerRef={index === 0 ? focusRef : null}
      key={e}
      helpVisible={true}
      helpText={e}
      label={e}
    />)}
  </div>
};

Performance.displayName = 'Performance';

// Performance.propTypes = {
  
// };
