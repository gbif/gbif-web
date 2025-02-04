import { useEffect, useRef } from 'react';

export function useOnUnmount(callback: () => unknown) {
  const callbackRef = useRef(callback);

  // Update the ref to always hold the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      // Use the latest callback reference on unmount
      if (callbackRef.current) {
        callbackRef.current();
      }
    };
  }, []);
}
