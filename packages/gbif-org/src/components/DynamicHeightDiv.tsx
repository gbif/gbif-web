import { debounce } from '@/utils/debounce';
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

export default function DynamicHeightDiv({
  minPxHeight = 300,
  maxPxHeight,
  sizeByViewport = false,
  stepSize = 1,
  children,
  style = {},
  ...props
}: {
  minPxHeight?: number;
  maxPxHeight?: number;
  stepSize?: number;
  sizeByViewport?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const divRef = useRef(null);
  const [divHeight, setDivHeight] = useState(minPxHeight);

  useEffect(() => {
    const adjustHeight = () => {
      if (divRef.current) {
        // Get the position of the div relative to the viewport
        const { top } = divRef.current.getBoundingClientRect();

        // Calculate the remaining height
        const availableHeight = window.innerHeight - top - (sizeByViewport ? 0 : window.scrollY);

        const maximumHeight = Math.max(minPxHeight, maxPxHeight ?? getDynamicViewportHeight());
        // Set the height, ensuring it's at least 300px
        const height = Math.max(minPxHeight, Math.min(availableHeight, maximumHeight));
        setDivHeight(stepSize * Math.floor(height / stepSize)); // Round to nearest 10
      }
    };

    // Initial height adjustment and on resize
    adjustHeight();

    const handleResize = debounce(adjustHeight, 30);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    // Update the visible tab count on resize
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    resizeObserver.observe(document.body);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      resizeObserver.disconnect();
    };
  }, [minPxHeight, maxPxHeight, sizeByViewport, stepSize]);

  return (
    <div
      ref={divRef}
      style={{
        minHeight: `${minPxHeight}px`,
        height: `${divHeight}px`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function getDynamicViewportHeight() {
  return window.visualViewport ? window.visualViewport.height : window.innerHeight;
}
