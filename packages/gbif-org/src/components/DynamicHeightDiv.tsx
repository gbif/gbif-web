import { debounce } from '@/utils/debounce';
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  minPxHeight?: number;
  maxPxHeight?: number;
  stepSize?: number;
  sizeByViewport?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export default function DynamicHeightDiv({
  minPxHeight = 300,
  maxPxHeight,
  sizeByViewport = false,
  stepSize = 20,
  children,
  style = {},
  ...props
}: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const [divHeight, setDivHeight] = useState(minPxHeight);

  useEffect(() => {
    const adjustHeight = () => {
      if (divRef.current) {
        // Get the position of the div relative to the viewport
        const { top: relativetop } = divRef.current.getBoundingClientRect();
        // get position relative to document top
        const absoluteTop = window.scrollY + relativetop;

        // Calculate the remaining height
        // default behaviour is relative to the window, but it can be relative to the viewport. The latter will mean that the div will grow when scrolling
        const availableHeight = window.innerHeight - (sizeByViewport ? relativetop : absoluteTop);

        // get maximium height - the default is viewport height, but it can be set to a fixed value
        const maximumHeight = Math.max(minPxHeight, maxPxHeight ?? getDynamicViewportHeight());

        // Set the height, ensuring it is between min and max heights
        const height = Math.max(minPxHeight, Math.min(availableHeight, maximumHeight));
        // Allow rounding down to nearest step size (e.g. 10 px). This will prevent as much flickering when resizing
        const stepHeight = stepSize * Math.floor(height / stepSize);
        setDivHeight(stepHeight);
      }
    };

    // Initial height adjustment and on resize
    adjustHeight();

    // add a debounce to avoid excessive recalculations
    const handleResize = debounce(adjustHeight, 100);

    // watch for changes in the body size
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(document.body);

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

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
