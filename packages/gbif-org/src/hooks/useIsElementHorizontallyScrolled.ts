import { useState, useEffect, RefObject } from 'react';

export function useIsElementHorizontallyScrolled(elementRef: RefObject<HTMLElement>) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    const checkTableScroll = () => {
      if (element) {
        // Determine if table is currently scrolled
        const currentlyScrolled = element.scrollLeft > 0;

        setIsScrolled(currentlyScrolled);
      }
    };

    // Check initial scroll state
    checkTableScroll();

    // Add scroll event listener
    if (element) {
      element.addEventListener('scroll', checkTableScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', checkTableScroll);
      }
    };
  }, [elementRef]);

  return isScrolled;
}
