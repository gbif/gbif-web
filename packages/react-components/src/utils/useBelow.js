import React, { useContext, useState, useEffect } from 'react';

export default function useBelow(breakpoint = 800) {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [isBelow, setBoolean] = useState(false);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setBoolean(window.innerWidth < breakpoint);
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return isBelow;
}