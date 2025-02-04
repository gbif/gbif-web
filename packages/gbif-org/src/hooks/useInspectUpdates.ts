import { useEffect, useRef } from 'react';

export function useInspectUpdates<T>(name: string, value: T) {
  const countRef = useRef(0);
  useEffect(() => {
    console.log(`${name} changed for the ${countRef.current++} time`);
  }, [value]);
}
