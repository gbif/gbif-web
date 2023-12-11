import React from 'react';

export function useUnmounted() {
  const unmounted = React.useRef(false);

  React.useEffect(
    () => () => {
      unmounted.current = true;
    },
    []
  );

  return unmounted;
}
