import { useEffect, useRef } from 'react';

/**
 * This function logs to the console whenever props change. It isn't to be used in production.
 * It is intended to help debugging rerenders.
 */
export function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}

/*
usage
function MyComponent(props) {
  useTraceUpdate(props);
  return <div>{props.children}</div>;
}
*/
