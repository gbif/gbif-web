import { RefObject, useEffect, useRef, useState } from 'react';

const SWITCH_TO_DESKTOP_SLACK = 32;
const SWITCH_TO_MOBILE_SLACK = 8;

export function useNavOverflow({
  containerRef,
  contentRef,
  rightSideRef,
  searchRef,
  desktopControlsRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  rightSideRef: RefObject<HTMLDivElement | null>;
  searchRef: RefObject<HTMLDivElement | null>;
  desktopControlsRef: RefObject<HTMLDivElement | null>;
}) {
  const [isOverflowing, setIsOverflowing] = useState(true);
  const [hasMeasured, setHasMeasured] = useState(false);
  const isOverflowingRef = useRef(isOverflowing);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const rightSide = rightSideRef.current;
    const search = searchRef.current;
    const desktopControls = desktopControlsRef.current;
    if (!container || !content || !rightSide || !search || !desktopControls) return;

    function check() {
      const contentWidth = content!.clientWidth;
      const desktopControlsWidth = desktopControls!.clientWidth;

      // The space the nav would get in the desktop layout. Every term is
      // independent of which layout is currently rendered, so the decision
      // cannot oscillate between the two layouts.
      const availableWidth =
        container!.clientWidth +
        rightSide!.clientWidth -
        search!.clientWidth -
        desktopControlsWidth;

      if (isOverflowingRef.current) {
        // widths of 0 mean display:none (pre-measurement) and cannot be judged
        if (
          contentWidth > 0 &&
          desktopControlsWidth > 0 &&
          contentWidth <= availableWidth - SWITCH_TO_DESKTOP_SLACK
        ) {
          isOverflowingRef.current = false;
          setIsOverflowing(false);
        }
      } else if (contentWidth > availableWidth - SWITCH_TO_MOBILE_SLACK) {
        isOverflowingRef.current = true;
        setIsOverflowing(true);
      }

      setHasMeasured(true);
    }

    const observer = new ResizeObserver(check);
    observer.observe(container);
    observer.observe(content);
    observer.observe(desktopControls);

    return () => observer.disconnect();
  }, [containerRef, contentRef, rightSideRef, searchRef, desktopControlsRef]);

  return { isOverflowing, hasMeasured };
}
