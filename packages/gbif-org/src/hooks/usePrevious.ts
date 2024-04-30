import { useRef, useEffect } from 'react';

function usePrevious<T>(value: T): T | undefined {
  // Ref object to hold the previous value
  const ref = useRef<T>();

  // Effect to update the ref after each render
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return the previous value (will be `undefined` on the first render)
  return ref.current;
}

export default usePrevious;
