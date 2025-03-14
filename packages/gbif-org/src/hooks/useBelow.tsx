import { useEffect, useState } from 'react';

export default function useBelow(breakpoint = 800, defaultState = false) {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [isBelow, setBoolean] = useState(defaultState);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setBoolean(window.innerWidth < breakpoint);
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return isBelow;
}

export function is_touch_enabled() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0; // msMaxTouchPoints would be added for IE10
}
