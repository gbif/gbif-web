import React from 'react';

import AppContext from './AppContext';

/**
 * Will add data from the ComponentContext to the wrapped component's props
 * To use you should provide a map of params that you need injected (similar to Redux connect map)
 *
 * Usage exanmple: 
 * const mapContextToProps = ({ locale }) => ({ locale });
 * export default withContext(mapContextToProps)(MyComponent);
 * By default wrapper would provide nothing
 * @param injectedProps
 * @returns {function(*): function(*): *}
 */
const withContext = (injectedProps = context => {}) => WrappedComponent => {
  const Wrapper = props => {
    return (
      <AppContext.Consumer>
        {context => <WrappedComponent {...injectedProps(context)} {...props} />}
      </AppContext.Consumer>
    );
  };

  return Wrapper;
};

export default withContext;

