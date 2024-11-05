import { debounce } from "@/utils/debounce";
import { ReactNode, useEffect, useRef, useState } from "react";

export default function DynamicHeightDiv({ minPxHeight = 300, children, style = {}, ...props }: { minPxHeight?: number, children: ReactNode, style?: CSSProperties }) {
  const divRef = useRef(null);
  const [divHeight, setDivHeight] = useState(minPxHeight);

  useEffect(() => {
    const adjustHeight = () => {
      if (divRef.current) {
        // Get the position of the div relative to the viewport
        const { top } = divRef.current.getBoundingClientRect();

        // Calculate the remaining height
        const availableHeight = window.innerHeight - top;

        // Set the height, ensuring it's at least 300px
        setDivHeight(Math.max(minPxHeight, availableHeight));
      }
    };

    // Initial height adjustment and on resize
    adjustHeight();

    const handleResize = debounce(adjustHeight, 100);

    // Update the visible tab count on resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={divRef}
      style={{
        minHeight: `${minPxHeight}px`,
        height: `${divHeight}px`,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};