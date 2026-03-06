import type { ReactNode } from 'react';
import { cn } from '@/utils/shadcn';

/**
 * Anchor describes where the arrow attaches to the popup box (i.e. the side
 * closest to the map point). For example `'bottom'` means the arrow points
 * downward and the popup floats above the point.
 */
export type PopupAnchor =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Shared map popup component used by both MapLibre and OpenLayers maps.
 * Styled to match the shadcn PopoverContent. Cannot use the Radix Popover directly
 * because map popups are positioned by the map libraries (OL Overlay / MapLibre Popup)
 * rather than by Radix's floating UI positioning.
 */
export function MapPopup({
  children,
  onClose,
  anchor = 'bottom',
}: {
  children: ReactNode;
  onClose: () => void;
  anchor?: PopupAnchor;
}) {
  // Determine layout axis and arrow alignment.
  // For top/bottom (including corners), the arrow sits above/below the box.
  // For pure left/right, the arrow sits beside the box.
  // For corners, the arrow is pushed to the relevant side instead of centered.
  const isTop = anchor.startsWith('top');
  const isBottom = anchor.startsWith('bottom');
  const isLeft = anchor === 'left';
  const isRight = anchor === 'right';
  const isHorizontal = isLeft || isRight;

  // Corner arrows are right-angled triangles (half of the full arrow).
  // The two straight edges align with the box corner; the hypotenuse faces the map point.
  const arrowElement = (() => {
    switch (anchor) {
      // Corners — right-angled triangles flush with the box corner
      case 'bottom-left':
        // ◤  top edge + left edge visible, hypotenuse to bottom-right
        return <div className="g-w-0 g-h-0 g-self-start g-border-t-[10px] g-border-t-popover g-border-r-[10px] g-border-r-transparent" />;
      case 'bottom-right':
        // ◥  top edge + right edge visible, hypotenuse to bottom-left
        return <div className="g-w-0 g-h-0 g-self-end g-border-t-[10px] g-border-t-popover g-border-l-[10px] g-border-l-transparent" />;
      case 'top-left':
        // ◣  bottom edge + left edge visible, hypotenuse to top-right
        return <div className="g-w-0 g-h-0 g-self-start g-border-b-[10px] g-border-b-popover g-border-r-[10px] g-border-r-transparent" />;
      case 'top-right':
        // ◢  bottom edge + right edge visible, hypotenuse to top-left
        return <div className="g-w-0 g-h-0 g-self-end g-border-b-[10px] g-border-b-popover g-border-l-[10px] g-border-l-transparent" />;
      // Cardinal directions — full symmetric triangles, centered
      case 'top':
        return <div className="g-w-0 g-h-0 g-self-center g-border-[10px] g-border-transparent g-border-b-popover g-border-t-0" />;
      case 'bottom':
        return <div className="g-w-0 g-h-0 g-self-center g-border-[10px] g-border-transparent g-border-t-popover g-border-b-0" />;
      case 'left':
        return <div className="g-w-0 g-h-0 g-self-center g-border-[10px] g-border-transparent g-border-r-popover g-border-l-0" />;
      case 'right':
        return <div className="g-w-0 g-h-0 g-self-center g-border-[10px] g-border-transparent g-border-l-popover g-border-r-0" />;
    }
  })();

  const box = (
    <div className={cn(
      'g-bg-popover g-p-4 g-text-popover-foreground g-outline-none g-relative g-min-w-[200px] g-rounded-md',
      anchor === 'top-left' && 'g-rounded-tl-none',
      anchor === 'top-right' && 'g-rounded-tr-none',
      anchor === 'bottom-left' && 'g-rounded-bl-none',
      anchor === 'bottom-right' && 'g-rounded-br-none',
    )}>
      <button
        onClick={onClose}
        className="g-absolute g-right-1 g-top-1 g-rounded-sm g-opacity-70 g-transition-opacity hover:g-opacity-100 g-cursor-pointer"
        aria-label="Close popup"
      >
        &#x2715;
      </button>
      {children}
    </div>
  );

  if (isHorizontal) {
    return (
      <div className="g-flex g-flex-row g-items-center g-text-xs g-leading-5 g-font-sans g-drop-shadow-md g-max-w-60">
        {isLeft && arrowElement}
        {box}
        {isRight && arrowElement}
      </div>
    );
  }

  return (
    <div className="g-flex g-flex-col g-text-xs g-leading-5 g-font-sans g-drop-shadow-md g-max-w-60">
      {isTop && arrowElement}
      {box}
      {isBottom && arrowElement}
    </div>
  );
}
