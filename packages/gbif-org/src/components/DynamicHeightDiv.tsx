import { debounce } from '@/utils/debounce';
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  minPxHeight?: number;
  maxPxHeight?: number;
  onlySetMinHeight?: boolean;
  stepSize?: number;
  sizeByViewport?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export default function DynamicHeightDiv({
  minPxHeight = 300,
  maxPxHeight,
  onlySetMinHeight = false,
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
  }, [minPxHeight, maxPxHeight, sizeByViewport, stepSize, onlySetMinHeight]);

  const heightStyle = onlySetMinHeight
    ? { height: 'auto', minHeight: `${divHeight}px` }
    : { height: `${divHeight}px`, minHeight: `${minPxHeight}px` };
  return (
    <div
      ref={divRef}
      style={{
        ...heightStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function getDynamicViewportHeight() {
  // return window.visualViewport ? window.visualViewport.height : window.innerHeight;
  // insert a hidden div with height set to 100svh and read the height so we know what the smallest viewport height is.
  // insert it at root and make it invisible to the user and screen readers. This is a hack, but it is the only way I can think of to get the correct value.
  // if the elemt already exists, then just read that value. Asume a fixed ID
  const id = 'smallViewportHeightElement';
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement('div');
    element.id = id;
    element.style.height = '100svh';
    element.style.width = '0';
    element.style.position = 'fixed';
    element.style.top = '0';
    element.style.left = '0';
    element.style.visibility = 'hidden';
    document.body.appendChild(element);
  }
  return element.clientHeight;
}
