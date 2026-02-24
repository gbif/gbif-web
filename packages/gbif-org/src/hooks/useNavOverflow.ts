import { RefObject, useEffect, useRef, useState } from 'react';

export function useNavOverflow(
  containerRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  rightSideRef: RefObject<HTMLDivElement | null>
) {
  const [isOverflowing, setIsOverflowing] = useState(true);
  const [hasMeasured, setHasMeasured] = useState(false);
  const isOverflowingRef = useRef(isOverflowing);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const rightSide = rightSideRef.current;
    if (!container || !content || !rightSide) return;

    function check() {
      const containerWidth = container!.clientWidth;
      const contentWidth = content!.clientWidth;

      // Use the right-side element's width as the hysteresis buffer.
      // When we switch between mobile/desktop, the right-side controls change
      // size (mobile menu button vs profile button). Using this width as the
      // buffer ensures the nav must fit with enough room to absorb that shift,
      // preventing oscillation at the boundary.
      const buffer = rightSide!.clientWidth;

      if (isOverflowingRef.current) {
        if (contentWidth <= containerWidth - buffer) {
          isOverflowingRef.current = false;
          setIsOverflowing(false);
        }
      } else {
        if (contentWidth > containerWidth) {
          isOverflowingRef.current = true;
          setIsOverflowing(true);
        }
      }

      setHasMeasured(true);
    }

    const observer = new ResizeObserver(check);
    observer.observe(container);
    observer.observe(content);

    return () => observer.disconnect();
  }, [containerRef, contentRef, rightSideRef]);

  return { isOverflowing, hasMeasured };
}
