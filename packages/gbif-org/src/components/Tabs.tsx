import { useEffect, useRef, useState } from 'react';
import { TabLink } from './TabLink';
import { cn } from '@/utils/shadcn';
import { debounce } from '@/utils/debounce';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DynamicLink } from './DynamicLink';

type Props = {
  links: Array<{ to: string; children: React.ReactNode }>;
};

export function Tabs({ links }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const [visibleTabCount, setVisibleTabCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    function updateVisibleTabCount() {
      if (containerRef.current == null) return;
      if (dropdownMenuTriggerRef.current == null) return;

      const containerWidth = containerRef.current.clientWidth;

      // If the total width of the tabs is less than the container width, show all tabs
      const tabs = containerRef.current.querySelectorAll('li');
      const tabsWidth = Array.from(tabs).reduce((acc, tab) => acc + tab.offsetWidth, 0);
      if (tabsWidth < containerWidth) return void setVisibleTabCount(links.length);

      // Otherwise show as many tabs as possible taking into account the width of the button
      const buttonWidth = dropdownMenuTriggerRef.current?.offsetWidth ?? 0;

      let visibleCount = 0;
      let accumulatedWidth = buttonWidth;

      while ((accumulatedWidth += tabs[visibleCount].offsetWidth) < containerWidth) visibleCount++;

      setVisibleTabCount(visibleCount);
    }

    // Update the visible tab count on mount
    updateVisibleTabCount();

    // Add a small debounce to avoid unnecessary re-renders when resizing
    const handleResize = debounce(updateVisibleTabCount, 30);

    // Update the visible tab count on resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [links, setVisibleTabCount]);

  return (
    <div ref={containerRef} className="relative">
      <ul className="border-b border-slate-200 flex whitespace-nowrap dark:border-slate-200/5 mb-px overflow-hidden">
        {links.map(({ to, children }, idx) => {
          const visible = idx < visibleTabCount;

          return (
            <li key={to} className={cn({ invisible: !visible }, 'px-3')}>
              <TabLink to={to}>{children}</TabLink>
            </li>
          );
        })}
      </ul>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger
          ref={dropdownMenuTriggerRef}
          className={cn(
            { invisible: visibleTabCount === links.length },
            'absolute right-0 pr-3 top-1/2 -translate-y-1/2'
          )}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            style={{ fontSize: '1.5em' }}
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {links.slice(visibleTabCount).map(({ to, children }) => (
            <DropdownMenuItem key={to}>
              <DynamicLink
                onClick={() => setIsDropdownOpen(false)}
                to={to}
                className="w-full justify-center"
              >
                {children}
              </DynamicLink>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
